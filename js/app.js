/**
 * app.js - Core application controller
 * Handles Dark/Light theme switching, mobile drawer navigation,
 * clipboard copy micro-actions, and resume interactions.
 */

document.addEventListener("DOMContentLoaded", () => {
  // =========================================================================
  // 1. Theme Management (Light / Dark Mode with LocalStorage)
  // =========================================================================
  const themeToggleBtns = document.querySelectorAll(".theme-toggle-btn");
  const htmlElement = document.documentElement;

  // Retrieve saved theme or system preference
  const savedTheme = localStorage.getItem("portfolio-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const currentTheme = savedTheme || (prefersDark ? "dark" : "light");
  htmlElement.setAttribute("data-theme", currentTheme);

  const toggleTheme = () => {
    const activeTheme = htmlElement.getAttribute("data-theme");
    const newTheme = activeTheme === "dark" ? "light" : "dark";
    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("portfolio-theme", newTheme);
  };

  themeToggleBtns.forEach((btn) => {
    btn.addEventListener("click", toggleTheme);
  });

  // Listen to OS-level theme preference changes if user hasn't overridden
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("portfolio-theme")) {
      htmlElement.setAttribute("data-theme", e.matches ? "dark" : "light");
    }
  });

  // =========================================================================
  // 2. Mobile Drawer Navigation
  // =========================================================================
  const mobileToggle = document.querySelector(".mobile-nav-toggle");
  const navLinksContainer = document.querySelector(".nav-links");

  if (mobileToggle && navLinksContainer) {
    const toggleMobileNav = () => {
      const isOpen = navLinksContainer.classList.contains("open");
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    };

    const openMobileNav = () => {
      navLinksContainer.classList.add("open");
      mobileToggle.classList.add("open");
      mobileToggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };

    const closeMobileNav = () => {
      navLinksContainer.classList.remove("open");
      mobileToggle.classList.remove("open");
      mobileToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };

    mobileToggle.addEventListener("click", toggleMobileNav);

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinksContainer.classList.contains("open")) {
        closeMobileNav();
      }
    });

    // Close on click outside
    document.addEventListener("click", (e) => {
      if (
        navLinksContainer.classList.contains("open") &&
        !navLinksContainer.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        closeMobileNav();
      }
    });
  }

  // =========================================================================
  // 3. Toast Notifications & Clipboard Copy
  // =========================================================================
  const toast = document.querySelector(".toast");
  let toastTimeout;

  const showToast = (message) => {
    if (!toast) return;
    const toastMessageEl = toast.querySelector(".toast-message");
    if (toastMessageEl) {
      toastMessageEl.textContent = message;
    }
    toast.classList.add("show");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  };

  // Attach copy handler to elements with data-copy attribute
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute("data-copy");
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Copied "${textToCopy}" to clipboard!`);
      } catch (err) {
        // Fallback
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        showToast(`Copied to clipboard!`);
      }
    });
  });

  // =========================================================================
  // 4. Resume Action Handlers
  // =========================================================================
  document.querySelectorAll(".trigger-resume-download").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Check if resume file exists in assets or trigger print view
      const resumeAssetUrl = "assets/Vishal_Tore_Resume.pdf";
      
      // Proactively trigger printable version or window.print() if preferred
      const link = document.createElement("a");
      link.href = resumeAssetUrl;
      link.download = "Vishal_Tore_Resume.pdf";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast("Downloading Vishal Tore's Resume...");
    });
  });

  // =========================================================================
  // 5. Japanese Wallpaper Theme System (6 Distinct Atmosphere Themes)
  // =========================================================================
  const themeMeta = {
    sakura: { name: "Sakura", icon: "🌸", label: "Sakura Moon (夜桜満月)" },
    temple: { name: "Jinja", icon: "⛩️", label: "Jinja Sanctuary (宵闇神社)" },
    bamboo: { name: "Bamboo", icon: "🎋", label: "Bamboo Dragon (竹林翠玉)" },
    wave: { name: "Wave", icon: "🌊", label: "Great Wave (神奈川沖波)" },
    imperial: { name: "Imperial", icon: "👑", label: "Imperial Violet (紫禁皇宮)" },
    library: { name: "Library", icon: "📜", label: "Grand Library (古文書館)" }
  };

  const bgLayers = document.querySelectorAll(".site-bg-layer");
  const themeSelects = document.querySelectorAll(".theme-select-dropdown");
  const themeQuickBtns = document.querySelectorAll(".mobile-theme-btn");

  // Retrieve saved wallpaper theme or default to "sakura"
  const savedWallpaperTheme = localStorage.getItem("portfolio-wallpaper-theme") || "sakura";

  const applyWallpaperTheme = (themeKey, notify = false) => {
    if (!themeMeta[themeKey]) return;

    htmlElement.setAttribute("data-wallpaper-theme", themeKey);
    localStorage.setItem("portfolio-wallpaper-theme", themeKey);

    // Cross-fade background layers
    bgLayers.forEach((layer) => {
      if (layer.getAttribute("data-bg-theme") === themeKey) {
        layer.classList.add("active");
      } else {
        layer.classList.remove("active");
      }
    });

    // Synchronize all dropdown bars (header, floating dock, mobile drawer)
    themeSelects.forEach((select) => {
      select.value = themeKey;
    });

    // Update active states on mobile quick buttons
    themeQuickBtns.forEach((btn) => {
      if (btn.getAttribute("data-set-theme") === themeKey) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    if (notify) {
      showToast(`Theme switched to ${themeMeta[themeKey].label}`);
    }
  };

  // Initial theme application
  applyWallpaperTheme(savedWallpaperTheme);

  // Dropdown bar selection change listeners (Header, Floating dock, Mobile)
  themeSelects.forEach((select) => {
    select.addEventListener("change", (e) => {
      applyWallpaperTheme(e.target.value, true);
    });
  });

  // Mobile quick buttons listeners
  themeQuickBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const themeKey = btn.getAttribute("data-set-theme");
      applyWallpaperTheme(themeKey, true);
    });
  });
});
