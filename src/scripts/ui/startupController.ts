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
const performSlowScroll = (target: string | HTMLElement) => {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  
  if (element instanceof HTMLElement) {
    const computedStyle = window.getComputedStyle(element);
    const scrollMarginTop = parseFloat(computedStyle.scrollMarginTop);
    let totalOffset = 0;
    
    if (!isNaN(scrollMarginTop) && scrollMarginTop > 0) {
       totalOffset = scrollMarginTop; 
    } else {
       const header = document.querySelector('header');
       totalOffset = header ? (header as HTMLElement).offsetHeight : 0;
    }
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isPerformanceMode = document.documentElement.classList.contains('performance-mode');
    const skipAnimation = prefersReducedMotion || isPerformanceMode;

    gsap.to(window, {
      duration: skipAnimation ? 0 : 1, 
      scrollTo: {
        y: element,
        offsetY: totalOffset,
        autoKill: true
      },
      ease: skipAnimation ? "none" : "power2.inOut"
    });
  }
};

export function initStartupController() {
  const gate = document.getElementById("startup-gate");

  const handleInitialHash = () => {
    if (window.location.hash) {
      window.scrollTo(0, 0);
      setTimeout(() => {
        window.scrollTo(0, 0); 
        performSlowScroll(window.location.hash);
      }, 150);
    }
  };

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
    handleInitialHash();
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
