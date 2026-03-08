import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/**
 * ══════════════════════════════════════════════
 *  MASTER SCROLL MANAGER (Consolidated)
 * ══════════════════════════════════════════════
 *
 * PURPOSE: Handles GSAP-based scroll behavior, including sidebar
 * visual updates, snapping mechanisms, and hash synchronization.
 *
 * DESIGN RULE (CRITICAL):
 * The 'sidebar-visuals' and 'snapping' triggers MUST remain separate.
 * - 'sidebar-visuals' uses scrub:0.5 and callbacks to update UI.
 * - 'snapping' MUST be a "naked" trigger (no scrub/callbacks) so GSAP can
 *   reliably detect native scroll velocity reaching zero to trigger snapping.
 *
 * MERGING THESE TWO WILL BREAK AUTO-SNAP ON WHEEL/SCROLLBAR.
 */

// --- SHARED STATE ---
let _panels: HTMLElement[] = [];
let _totalSteps = 0;
let _step = 0;
let activeScrollTween: gsap.core.Tween | null = null;

const SIDEBAR_SCALE = { min: 1, max: 1.45, falloffRate: 1, falloffPower: 1.7 } as const;

// --- CONFIG HELPERS ---
const refreshPanelConfig = () => {
  _panels = gsap.utils.toArray<HTMLElement>(".panel");
  _totalSteps = _panels.length - 1;
  _step = _totalSteps > 0 ? 1 / _totalSteps : 1;
};

const getCurrentPanelIndex = () => {
  const scrollY = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progressRatio = maxScroll > 0 ? scrollY / maxScroll : 0;
  return Math.round(progressRatio / _step);
};

const progressToScrollY = (progress: number) => {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  return progress * maxScroll;
};

// --- CORE SCROLL LOGIC ---
const scrollToIndex = (index: number) => {
  if (_totalSteps <= 0) return;
  const clamped = gsap.utils.clamp(0, _totalSteps, index);
  const targetY = progressToScrollY(clamped * _step);

  const isReducedMotion = document.documentElement.getAttribute("data-reduced-motion") === "true";

  activeScrollTween?.kill();
  activeScrollTween = gsap.to(window, {
    duration: isReducedMotion ? 0 : 0.7,
    scrollTo: { y: targetY },
    ease: "power2.inOut",
  });
};

// --- MODULE INITIALIZATIONS ---
const initScrollNavigation = () => {
  const navSections = document.querySelectorAll<HTMLElement>(".nav-section");

  navSections.forEach((section, index) => {
    section.addEventListener("click", () => {
      scrollToIndex(index);
    });

    // Add keyboard navigation for Enter/Space
    section.setAttribute("tabindex", "0"); // Make it focusable
    section.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault(); // Prevent default scroll behavior for spacebar
        scrollToIndex(index);
      }
    });
  });
};

const initFocusScroll = () => {
  window.addEventListener("focusin", (e) => {
    const target = e.target as HTMLElement;
    const panel = target.closest(".panel") as HTMLElement;
    if (panel) {
      const panelIndex = _panels.indexOf(panel);
      if (panelIndex !== -1) {
        scrollToIndex(panelIndex);
      }
    }
  });
};

// --- VISUAL/STATE UPDATERS ---
function updateSidebarVisuals(progress: number) {
  const sidebar = document.querySelector<HTMLElement>(".sidebar");
  const navContainer = document.querySelector<HTMLElement>(".nav");
  if (!navContainer) return;

  // Select BOTH sections and circles in their DOM order
  const allNavElements = Array.from(navContainer.children) as HTMLElement[];
  const contactsEnterThreshold = gsap.utils.clamp(0, 1, 1 - _step * 0.5);
  const isHighContrast = document.documentElement.getAttribute("data-high-contrast") === "true";
  const isReducedMotion = document.documentElement.getAttribute("data-reduced-motion") === "true";

  // Toggle footer spacing
  if (sidebar) {
    sidebar.classList.toggle("contacts-entering", progress >= contactsEnterThreshold);
  }

  // Dynamic scaling
  const activeSectionPosition = progress * _totalSteps;

  allNavElements.forEach((el) => {
    const dataIndex = parseInt(el.getAttribute("data-index") || "0");
    // Convert DOM index (0,1,2,3,4,5,6) to Scroll index (0, 0.5, 1, 1.5, 2, 2.5, 3)
    const virtualIndex = dataIndex / 2;

    const isSection = el.classList.contains("nav-section");
    const isDirectMatch = isSection && Math.abs(virtualIndex - activeSectionPosition) < 0.35;
    const distanceFromActive = Math.abs(virtualIndex - activeSectionPosition);

    // Update active class for High Contrast border fills (only for sections)
    if (isSection) {
      el.classList.toggle("active", isDirectMatch);
    }

    let scale = 1;

    if (isReducedMotion) {
      // BINARY SCALE for Reduced Motion
      // For circles, we use a smaller scale bump or none, but here we'll match user intent
      const matchThreshold = isSection ? 0.35 : 0.25;
      scale = Math.abs(virtualIndex - activeSectionPosition) < matchThreshold ? 1.25 : 1;
    } else {
      // Exponential falloff for smooth scaling
      const falloff = Math.exp(
        -SIDEBAR_SCALE.falloffRate * Math.pow(distanceFromActive, SIDEBAR_SCALE.falloffPower)
      );
      scale = SIDEBAR_SCALE.min + (SIDEBAR_SCALE.max - SIDEBAR_SCALE.min) * falloff;
    }

    // Apply scaling
    el.style.transform = `scale(${scale})`;

    // DYNAMIC MARGINS: Scale margins proportionally
    const baseMargin = el.classList.contains("nav-circle") ? 4 : 6; // Circles are tighter
    const dynamicMargin = baseMargin * scale;
    el.style.marginTop = `${dynamicMargin}px`;
    el.style.marginBottom = `${dynamicMargin}px`;

    // Explicitly handle color inversion for High Contrast active state
    if (isHighContrast && isSection) {
      const box = el.querySelector<HTMLElement>(".navsec-box");
      if (box) box.style.transform = "translateZ(0)";
    }
  });
}

function updateHashSync(progress: number) {
  const panels = ["hello", "projects", "about", "contacts"];
  const index = Math.round(progress * (panels.length - 1));

  const currentHash = progress < 0.05 ? "" : `#${panels[index]}`;
  const newURL = currentHash === "" ? window.location.pathname : currentHash;

  if (window.location.hash !== currentHash) {
    history.replaceState(null, "", newURL);
  }
}

// --- CORE SCROLL CONTROLLER ---
export const initPanelScroll = () => {
  refreshPanelConfig();

  /**
   * TRIGGER 1: Sidebar Visuals & Hash Sync
   * Purpose: Smooth UI updates while scrolling.
   * Modes: scrub: 0.5 (Smooth interpolation)
   */
  ScrollTrigger.create({
    id: "sidebar-visuals",
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.5,
    onUpdate: (self) => {
      updateSidebarVisuals(self.progress);
      updateHashSync(self.progress);
    },
    onRefresh: (self) => updateSidebarVisuals(self.progress),
  });

  /**
   * TRIGGER 2: Snapping (THE NAKED TRIGGER)
   * Purpose: Correct scroll position to panel boundaries.
   * Constraint: MUST NOT HAVE scrub or onUpdate/callbacks.
   */
  let snapTrigger: ScrollTrigger | null = null;

  const enableSnapping = () => {
    if (snapTrigger || _totalSteps <= 0) return;
    snapTrigger = ScrollTrigger.create({
      id: "snapping",
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      snap: {
        directional: false,
        snapTo: (progress) => {
          const closestIndex = Math.round(progress / _step);
          const delta = (progress - closestIndex * _step) / _step;
          const threshold = 0.1; // Intent threshold

          const targetIndex =
            Math.abs(delta) > threshold ? closestIndex + (delta > 0 ? 1 : -1) : closestIndex;

          return gsap.utils.clamp(0, 1, targetIndex * _step);
        },
        duration: { min: 0.1, max: 0.3 }, // Snappier for reduced motion compatibility
        delay: 0.03,
        ease: "power1.inOut",
      },
    });
  };

  const disableSnapping = () => {
    if (snapTrigger) {
      snapTrigger.kill();
      snapTrigger = null;
    }
  };

  // --- GLOBAL PERFORMANCE BRIDGE ---
  window.performanceModeScroll = {
    enableSnap: enableSnapping,
    disableSnap: disableSnapping,
    refresh: () => {
      ScrollTrigger.getById("sidebar-visuals")?.refresh();
      if (snapTrigger) snapTrigger.refresh();
    },
  };

  if (!window.__performanceModeEnabled) {
    enableSnapping();
  }

  // Refresh on vanta finish
  window.addEventListener("startup:vanta", () => {
    ScrollTrigger.getById("sidebar-visuals")?.refresh();
    if (snapTrigger) snapTrigger.refresh();
  });

  // --- MODULE INITIALIZATIONS ---
  initScrollNavigation();
  initScrollResize();
  initKeyboardScroll();
  initJumpToController();
  initFocusScroll();

  // --- CLEANUP ---
  window.addEventListener(
    "beforeunload",
    () => {
      activeScrollTween?.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      window.performanceModeScroll = undefined;
    },
    { once: true }
  );
};

export const initKeyboardScroll = () => {
  const handleKeyboard = (e: KeyboardEvent) => {
    const isSpace = e.code === "Space";
    const isPageDown = e.code === "PageDown";
    const isPageUp = e.code === "PageUp";

    if (!isSpace && !isPageDown && !isPageUp) return;

    // Skip if user is typing
    const active = document.activeElement;
    if (
      active &&
      (active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        (active as HTMLElement).isContentEditable)
    ) {
      return;
    }

    e.preventDefault();

    const isForward = isPageDown || (isSpace && !e.shiftKey);

    const currentProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
    const currentIndex = Math.round(currentProgress / _step);

    let targetIndex = currentIndex;
    if (isForward) {
      targetIndex = gsap.utils.clamp(0, _totalSteps, currentIndex + 1);
    } else {
      targetIndex = gsap.utils.clamp(0, _totalSteps, currentIndex - 1);
    }

    scrollToIndex(targetIndex);
  };

  window.addEventListener("keydown", handleKeyboard, { passive: false });
};

// --- RESIZE (Layout Correction) ---
const initScrollResize = () => {
  let isResizing = false;
  let resizeTimeout: number | null = null;
  let preResizeActiveIndex = 0;

  window.addEventListener("resize", () => {
    if (!isResizing) {
      isResizing = true;
      preResizeActiveIndex = getCurrentPanelIndex();
      window.performanceModeScroll?.disableSnap?.();
    }

    if (resizeTimeout) window.clearTimeout(resizeTimeout);

    resizeTimeout = window.setTimeout(() => {
      isResizing = false;
      refreshPanelConfig();
      ScrollTrigger.refresh();

      const targetY = progressToScrollY(preResizeActiveIndex * _step);
      gsap.set(window, { scrollTo: { y: targetY } });

      if (!window.__performanceModeEnabled) {
        window.performanceModeScroll?.enableSnap?.();
      }
    }, 150);
  });
};

// --- JUMP-TO MENU ---
export const initJumpToController = () => {
  const toggleBtn = document.getElementById("jump-toggle");
  const jumpNav = document.getElementById("jump-nav");

  if (!toggleBtn || !jumpNav) return;

  const closeJumpNav = () => {
    toggleBtn.setAttribute("aria-expanded", "false");
    jumpNav.classList.remove("is-open");
  };

  toggleBtn.addEventListener("click", () => {
    const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
    toggleBtn.setAttribute("aria-expanded", (!isExpanded).toString());
    jumpNav.classList.toggle("is-open");
  });

  jumpNav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 1024) closeJumpNav();
    });
  });

  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (!toggleBtn.contains(target) && !jumpNav.contains(target)) {
      if (window.innerWidth < 1024 && jumpNav.classList.contains("is-open")) closeJumpNav();
    }
  });
};

declare global {
  interface Window {
    performanceModeScroll?: {
      enableSnap: () => void;
      disableSnap: () => void;
      refresh: () => void;
    };
    __performanceModeEnabled?: boolean;
  }
}
