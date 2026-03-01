import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

function dispatchStage(name) {
  window.dispatchEvent(new CustomEvent(name));
}

function runWhenIdle(task, timeout = 800) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(task, { timeout });
    return;
  }
  setTimeout(task, 0);
}

/**
 * Perform a slow, cinematic scroll to a target element or hash
 * @param {string|HTMLElement} target - The element or hash ID to scroll to
 */
const performSlowScroll = (target) => {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  
  if (element) {
    // 1. Calculate base header height offset explicitly
    const header = document.querySelector('header');
    let totalOffset = header ? header.offsetHeight : 0;
    
    // 2. Add any CSS `scroll-margin-top` defined on the element itself
    const computedStyle = window.getComputedStyle(element);
    const scrollMarginTop = parseFloat(computedStyle.scrollMarginTop);
    if (!isNaN(scrollMarginTop)) {
       // Note: getComputedStyle returns exact pixels (e.g. "96px") even if the CSS uses rem or calc()
       totalOffset += scrollMarginTop; 
    }
    
    // Check for Reduced Motion (Accessibility) OR Performance Mode (Site Setting)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isPerformanceMode = document.documentElement.classList.contains('performance-mode');

    // If either is true, we snap instantly (duration 0)
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

export function startStartupGate() {
  const gate = document.getElementById("startup-gate");

  // Logic for the very first load of the page
  const handleInitialHash = () => {
    if (window.location.hash) {
      // 1. Instantly reset to top while the gate is still opaque.
      // This counteracts the browser's native jump to the #hash.
      window.scrollTo(0, 0);

      // 2. Small delay ensures layout is painted before we measure positions
      setTimeout(() => {
        // Double check we are still at top before starting cinematic scroll
        window.scrollTo(0, 0); 
        performSlowScroll(window.location.hash);
      }, 150);
    }
  };

  // Logic for clicking links while already on the page
  const setupGlobalLinkInterception = () => {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const url = new URL(link.href, window.location.href);
      const isSamePage = url.pathname === window.location.pathname;
      const hash = url.hash;

      if (isSamePage && hash && hash.length > 1) {
        const target = document.querySelector(hash);
        if (target) {
          e.preventDefault();
          // Update the URL without jumping (silent update)
          history.pushState(null, '', hash);
          performSlowScroll(target);
        }
      }
    });
  };

  const openUI = () => {
    document.documentElement.classList.add("startup-ready");
    if (!gate) return;
    
    gate.setAttribute("aria-hidden", "true");
    
    // Start initial scroll (if URL has a hash)
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

  // Setup click listener once when the site scripts load
  setupGlobalLinkInterception();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runStages, { once: true });
    return;
  }

  runStages();
}
