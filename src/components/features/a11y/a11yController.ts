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
    // ⚡ PRO-TRICK: Temporarily disable transitions during the attribute swap
    document.documentElement.classList.add("no-transitions");

    document.documentElement.setAttribute("data-reduced-motion", String(enabled));

    const toggles = document.querySelectorAll(RM_TOGGLE_SELECTOR);
    toggles.forEach((toggle) => {
      toggle.setAttribute("aria-checked", String(enabled));
    });

    // Refresh sidebar scaling logic immediately
    window.performanceModeScroll?.syncSnapping?.();

    // Re-enable transitions after the paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("no-transitions");
      });
    });
  };

  const toggleReducedMotion = () => {
    const isEnabled = document.documentElement.getAttribute("data-reduced-motion") === "true";
    const nextState = !isEnabled;
    setReducedMotion(nextState);
    localStorage.setItem(RM_STORAGE_KEY, nextState ? "on" : "off");
  };

  // CLARITY MODE
  const setClarityMode = (enabled: boolean) => {
    // ⚡ PRO-TRICK: Temporarily disable all transitions to prevent "tremble" during mode shift
    document.documentElement.classList.add("no-transitions");

    document.documentElement.setAttribute("data-clarity", String(enabled));

    // UI Only: Update the toggle state visually
    const toggles = document.querySelectorAll(CLARITY_TOGGLE_SELECTOR);
    toggles.forEach((toggle) => {
      toggle.setAttribute("aria-checked", String(enabled));
    });

    // ⚡ DOUBLE-RAF: Ensures the browser commits the style change BEFORE transitions are re-enabled
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("no-transitions");
      });
    });
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

  // Initial state (Reduced Motion - Functional!)
  const savedRM = localStorage.getItem(RM_STORAGE_KEY);
  if (savedRM) {
    setReducedMotion(savedRM === "on");
  } else {
    const prefersReducedValue = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReducedValue);
  }

  // Initial state (Clarity Mode - Functional again)
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
