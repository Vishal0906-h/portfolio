/**
 * scroll.js - Handles smooth scrolling, active nav tracking (scrollspy),
 * header elevation states, and back-to-top interaction.
 */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const backToTopBtn = document.querySelector(".back-to-top-btn");
  const navLinks = document.querySelectorAll(".nav-link[href^='#']");
  const sections = document.querySelectorAll("section[id]");

  // 1. Header Elevation and Back-to-Top visibility on scroll
  const handleScrollEvents = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header styling
    if (header) {
      if (scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    // Back to top button
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }

    // Scrollspy: determine active section
    let currentSectionId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSectionId}`) {
          link.classList.add("active");
        }
      });
    }
  };

  window.addEventListener("scroll", handleScrollEvents, { passive: true });
  handleScrollEvents(); // Initial run

  // 2. Smooth scrolling with header offset for internal links
  document.querySelectorAll("a[href^='#']").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 56;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Close mobile nav drawer if open
        const navLinksContainer = document.querySelector(".nav-links");
        const mobileToggle = document.querySelector(".mobile-nav-toggle");
        if (navLinksContainer && navLinksContainer.classList.contains("open")) {
          navLinksContainer.classList.remove("open");
          if (mobileToggle) {
            mobileToggle.classList.remove("open");
            mobileToggle.setAttribute("aria-expanded", "false");
          }
          document.body.style.overflow = "";
        }
      }
    });
  });

  // 3. Back to Top Click
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
});
