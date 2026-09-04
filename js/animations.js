/**
 * animations.js - IntersectionObserver scroll triggers and subtle card micro-interactions.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Scroll Reveal using IntersectionObserver
  const revealElements = document.querySelectorAll(".reveal-on-scroll");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); // Unobserve once revealed for performance
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -60px 0px",
        threshold: 0.12,
      }
    );

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach((el) => {
      el.classList.add("is-visible");
    });
  }

  // 2. Subtle Apple-Style Card Tilt / Spotlight (Desktop only, respect reduced motion)
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  if (!isReducedMotion && !isTouchDevice && window.innerWidth > 840) {
    const interactiveCards = document.querySelectorAll(".project-card, .skill-category-card, .about-card, .education-card");

    interactiveCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        // Subtle 3D rotation (max 2 degrees for refined Apple feel)
        card.style.transform = `perspective(1000px) rotateX(${-deltaY * 2}deg) rotateY(${deltaX * 2}deg) translateY(-6px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }
});
