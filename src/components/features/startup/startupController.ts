import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

function dispatchStage(name: string) {
  window.dispatchEvent(new CustomEvent(name));
}

function runWhenIdle(task: () => void, timeout = 1500) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(task, { timeout });
    return;
  }
  setTimeout(task, 200);
}

const waitForImages = (selector: string): Promise<void> => {
  const images = Array.from(document.querySelectorAll<HTMLImageElement>(selector));
  if (images.length === 0) return Promise.resolve();

  return new Promise((resolve) => {
    let loadedCount = 0;
    const checkResolve = () => {
      loadedCount++;
      if (loadedCount >= images.length) resolve();
    };

    images.forEach((img) => {
      if (img.complete) {
        checkResolve();
      } else {
        img.addEventListener("load", checkResolve, { once: true });
        img.addEventListener("error", checkResolve, { once: true });
      }
    });
  });
};

/**
 * Perform a slow, cinematic scroll to a target element or hash
 */
export const performSlowScroll = (
  target: string | HTMLElement,
  autoKill = true,
  onComplete?: () => void
) => {
  const element = typeof target === "string" ? document.querySelector(target) : target;

  if (element instanceof HTMLElement) {
    const computedStyle = window.getComputedStyle(element);
    const scrollMarginTop = parseFloat(computedStyle.scrollMarginTop);
    let totalOffset = 0;

    const isPanel = element.classList.contains("panel");
    let snapY: number | null = null;

    if (isPanel) {
      const panels = Array.from(document.querySelectorAll(".panel"));
      const index = panels.indexOf(element as HTMLElement);
      if (index !== -1) {
        const totalSteps = panels.length - 1;
        const step = totalSteps > 0 ? 1 / totalSteps : 1;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        snapY = index * step * maxScroll;
      }
    }

    if (!isPanel && !isNaN(scrollMarginTop) && scrollMarginTop > 0) {
      totalOffset = scrollMarginTop;
    } else if (!isPanel) {
      const header = document.querySelector("header");
      totalOffset = header ? (header as HTMLElement).offsetHeight : 0;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isPerformanceMode = document.documentElement.classList.contains("performance-mode");
    const skipAnimation = prefersReducedMotion || isPerformanceMode;

    // Temporarily disable snapping to prevent the jump artifact
    const snapBridge = (window as any).performanceModeScroll;
    snapBridge?.disableSnap?.();

    gsap.to(window, {
      duration: skipAnimation ? 0 : 0.75,
      scrollTo: {
        y: snapY !== null ? snapY : element,
        offsetY: snapY !== null ? 0 : totalOffset,
        autoKill: autoKill,
      },
      ease: skipAnimation ? "none" : "power2.inOut",
      onComplete: () => {
        // Re-enable snapping if we're not in performance mode
        if (!isPerformanceMode) {
          snapBridge?.enableSnap?.();
        }
        onComplete?.();
      },
      onInterrupt: () => {
        // Also re-enable on interruption (e.g. user manual scroll with autoKill: true)
        if (!isPerformanceMode) {
          snapBridge?.enableSnap?.();
        }
      },
    });
  }
};

export function initStartupController() {
  const gate = document.getElementById("startup-gate");

  const setupGlobalLinkInterception = () => {
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (!link) return;

      const url = new URL(link.href, window.location.href);
      const isSamePage = url.pathname === window.location.pathname;
      const hash = url.hash;

      if (isSamePage && hash && hash.length > 1) {
        const scrollTarget = document.querySelector(hash);
        if (scrollTarget instanceof HTMLElement) {
          e.preventDefault();
          history.pushState(null, "", hash);
          performSlowScroll(scrollTarget);
        }
      }
    });
  };

  const openUI = () => {
    document.documentElement.classList.add("startup-ready");
    if (!gate) return;

    gate.setAttribute("aria-hidden", "true");
    setTimeout(() => gate.remove(), 420);
  };

  const runStages = () => {
    // Stage 1: Initialize heavy visual background systems FIRST so they
    // are ready when the opening gate (loading screen) begins to fade.
    dispatchStage("startup:vanta");
    dispatchStage("startup:marquee");

    // Stage 2: Give the browser one frame to potentially execute initialization work
    requestAnimationFrame(() => {
      openUI();

      // Stage 3: Secondary systems (Physics) last.
      // We wait longer to allow the entrance animations and UI reveals to settle first.
      setTimeout(() => {
        dispatchStage("startup:matter");
      }, 2000);
    });
  };

  setupGlobalLinkInterception();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runStages, { once: true });
    return;
  }

  runStages();
}
