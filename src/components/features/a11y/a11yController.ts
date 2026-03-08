/**
 * ══════════════════════════════════════════════
 *  A11Y CONTROLLER
 * ══════════════════════════════════════════════
 *
 * PURPOSE: Manages accessibility preferences (Reduced Motion, Clarity Mode).
 *
 * CRITICAL RULES:
 * - Persists choice to localStorage.
 * - Respects system-level media queries on initial load.
 */

const RM_STORAGE_KEY = "reduced-motion";
const RM_TOGGLE_SELECTOR = ".reduced-motion-toggle";

const CLARITY_STORAGE_KEY = "clarity-mode";
const CLARITY_TOGGLE_SELECTOR = ".clarity-toggle";

export const initA11yController = () => {
  // REDUCED MOTION
  const setReducedMotion = (enabled: boolean) => {
    document.documentElement.setAttribute("data-reduced-motion", String(enabled));

    const toggles = document.querySelectorAll(RM_TOGGLE_SELECTOR);
    toggles.forEach((toggle) => {
      toggle.setAttribute("aria-checked", String(enabled));
    });

    // Refresh sidebar scaling logic immediately
    window.performanceModeScroll?.refresh?.();
    window.performanceModeScroll?.syncSnapping?.();
  };

  const toggleReducedMotion = () => {
    const isEnabled = document.documentElement.getAttribute("data-reduced-motion") === "true";
    const nextState = !isEnabled;
    setReducedMotion(nextState);
    localStorage.setItem(RM_STORAGE_KEY, nextState ? "on" : "off");
  };

  // CLARITY MODE
  const setClarityMode = (enabled: boolean) => {
    document.documentElement.setAttribute("data-clarity", String(enabled));

    const toggles = document.querySelectorAll(CLARITY_TOGGLE_SELECTOR);
    toggles.forEach((toggle) => {
      toggle.setAttribute("aria-checked", String(enabled));
    });

    // Refresh sidebar scaling logic immediately
    window.performanceModeScroll?.refresh?.();
  };

  const toggleClarityMode = () => {
    const isEnabled = document.documentElement.getAttribute("data-clarity") === "true";
    const nextState = !isEnabled;
    setClarityMode(nextState);
    localStorage.setItem(CLARITY_STORAGE_KEY, nextState ? "on" : "off");
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

    // Clarity Mode Listeners
    const clarityToggles = document.querySelectorAll(CLARITY_TOGGLE_SELECTOR);
    clarityToggles.forEach((btn) => {
      const newBtn = btn.cloneNode(true) as HTMLElement;
      btn.parentNode?.replaceChild(newBtn, btn);

      newBtn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleClarityMode();
      });

      newBtn.addEventListener("keydown", (e) => {
        if ((e as KeyboardEvent).key === "Enter" || (e as KeyboardEvent).key === " ") {
          e.preventDefault();
          toggleClarityMode();
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

  // Initial state (Clarity Mode)
  const savedClarity = localStorage.getItem(CLARITY_STORAGE_KEY);
  if (savedClarity) {
    setClarityMode(savedClarity === "on");
  } else {
    const prefersContrast = window.matchMedia("(prefers-contrast: more)").matches;
    setClarityMode(prefersContrast);
  }

  // Attach initial
  attachListeners();

  // Re-attach on page transitions
  document.addEventListener("astro:after-swap", attachListeners);
};
