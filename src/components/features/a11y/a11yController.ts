/**
 * ══════════════════════════════════════════════
 *  A11Y CONTROLLER
 * ══════════════════════════════════════════════
 *
 * PURPOSE: Manages accessibility preferences (Reduced Motion, High Contrast).
 *
 * CRITICAL RULES:
 * - Persists choice to localStorage.
 * - Respects system-level media queries on initial load.
 */

const RM_STORAGE_KEY = "reduced-motion";
const RM_TOGGLE_SELECTOR = ".reduced-motion-toggle";

const HC_STORAGE_KEY = "high-contrast";
const HC_TOGGLE_SELECTOR = ".high-contrast-toggle";

export const initA11yController = () => {
  // REDUCED MOTION
  const setReducedMotion = (enabled: boolean) => {
    document.documentElement.setAttribute("data-reduced-motion", String(enabled));

    const toggles = document.querySelectorAll(RM_TOGGLE_SELECTOR);
    toggles.forEach((toggle) => {
      toggle.setAttribute("aria-checked", String(enabled));
    });
  };

  const toggleReducedMotion = () => {
    const isEnabled = document.documentElement.getAttribute("data-reduced-motion") === "true";
    const nextState = !isEnabled;
    setReducedMotion(nextState);
    localStorage.setItem(RM_STORAGE_KEY, nextState ? "on" : "off");
  };

  // HIGH CONTRAST
  const setHighContrast = (enabled: boolean) => {
    document.documentElement.setAttribute("data-high-contrast", String(enabled));

    const toggles = document.querySelectorAll(HC_TOGGLE_SELECTOR);
    toggles.forEach((toggle) => {
      toggle.setAttribute("aria-checked", String(enabled));
    });
  };

  const toggleHighContrast = () => {
    const isEnabled = document.documentElement.getAttribute("data-high-contrast") === "true";
    const nextState = !isEnabled;
    setHighContrast(nextState);
    localStorage.setItem(HC_STORAGE_KEY, nextState ? "on" : "off");
  };

  const attachListeners = () => {
    // Reduced Motion Listeners
    const rmToggles = document.querySelectorAll(RM_TOGGLE_SELECTOR);
    rmToggles.forEach((btn) => {
      const newBtn = btn.cloneNode(true) as HTMLElement;
      btn.parentNode?.replaceChild(newBtn, btn);

      newBtn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleReducedMotion();
      });

      newBtn.addEventListener("keydown", (e) => {
        if ((e as KeyboardEvent).key === "Enter" || (e as KeyboardEvent).key === " ") {
          e.preventDefault();
          toggleReducedMotion();
        }
      });
    });

    // High Contrast Listeners
    const hcToggles = document.querySelectorAll(HC_TOGGLE_SELECTOR);
    hcToggles.forEach((btn) => {
      const newBtn = btn.cloneNode(true) as HTMLElement;
      btn.parentNode?.replaceChild(newBtn, btn);

      newBtn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleHighContrast();
      });

      newBtn.addEventListener("keydown", (e) => {
        if ((e as KeyboardEvent).key === "Enter" || (e as KeyboardEvent).key === " ") {
          e.preventDefault();
          toggleHighContrast();
        }
      });
    });
  };

  // Initial state (Reduced Motion)
  const savedRM = localStorage.getItem(RM_STORAGE_KEY);
  if (savedRM) {
    setReducedMotion(savedRM === "on");
  } else {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReduced);
  }

  // Initial state (High Contrast)
  const savedHC = localStorage.getItem(HC_STORAGE_KEY);
  if (savedHC) {
    setHighContrast(savedHC === "on");
  } else {
    const prefersContrast = window.matchMedia("(prefers-contrast: more)").matches;
    setHighContrast(prefersContrast);
  }

  // Attach initial
  attachListeners();

  // Re-attach on page transitions
  document.addEventListener("astro:after-swap", attachListeners);
};
