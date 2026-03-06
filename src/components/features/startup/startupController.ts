import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

function dispatchStage(name: string) {
  window.dispatchEvent(new CustomEvent(name));
}

function runWhenIdle(task: () => void, timeout = 800) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(task, { timeout });
    return;
  }
  setTimeout(task, 0);
}

/**
 * Perform a slow, cinematic scroll to a target element or hash
 */
export const performSlowScroll = (target: string | HTMLElement, autoKill = true, onComplete?: () => void) => {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  
  if (element instanceof HTMLElement) {
    const computedStyle = window.getComputedStyle(element);
    const scrollMarginTop = parseFloat(computedStyle.scrollMarginTop);
    let totalOffset = 0;
    
    const isPanel = element.classList.contains('panel');
    let snapY: number | null = null;

    if (isPanel) {
      const panels = Array.from(document.querySelectorAll('.panel'));
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
       const header = document.querySelector('header');
       totalOffset = header ? (header as HTMLElement).offsetHeight : 0;
    }
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isPerformanceMode = document.documentElement.classList.contains('performance-mode');
    const skipAnimation = prefersReducedMotion || isPerformanceMode;

    // Temporarily disable snapping to prevent the jump artifact
    const snapBridge = (window as any).performanceModeScroll;
    snapBridge?.disableSnap?.();

    gsap.to(window, {
      duration: skipAnimation ? 0 : 0.75, 
      scrollTo: {
        y: snapY !== null ? snapY : element,
        offsetY: snapY !== null ? 0 : totalOffset,
        autoKill: autoKill
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
      }
    });
  }
};

export function initStartupController() {
  const gate = document.getElementById("startup-gate");

  const setupGlobalLinkInterception = () => {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (!link) return;

      const url = new URL(link.href, window.location.href);
      const isSamePage = url.pathname === window.location.pathname;
      const hash = url.hash;

      if (isSamePage && hash && hash.length > 1) {
        const scrollTarget = document.querySelector(hash);
        if (scrollTarget instanceof HTMLElement) {
          e.preventDefault();
          history.pushState(null, '', hash);
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
    dispatchStage("startup:marquee");
    openUI();

    runWhenIdle(() => {
      dispatchStage("startup:vanta");
    }, 1000);

    setTimeout(() => {
      dispatchStage("startup:matter");
    }, 700);
  };

  setupGlobalLinkInterception();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runStages, { once: true });
    return;
  }

  runStages();
}
