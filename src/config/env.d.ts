/**
 * ══════════════════════════════════════════════
 *  ENVIRONMENT TYPE DEFINITIONS (env.d.ts)
 * ══════════════════════════════════════════════
 *
 * PURPOSE: Extends the global Window interface and Astro environment types.
 *
 * CRITICAL RULES:
 * - All global property extensions MUST be documented here for IDE support.
 */
/// <reference types="astro/client" />

interface VantaEffect {
  options?: {
    highlightColor?: number;
    midtoneColor?: number;
    lowlightColor?: number;
    baseColor?: number;
  };
  setOptions: (options: {
    highlightColor?: number;
    midtoneColor?: number;
    lowlightColor?: number;
    baseColor?: number;
  }) => void;
  destroy?: () => void;
}

interface Window {
  vantaEffect?: VantaEffect;
  __performanceModeEnabled?: boolean;
  togglePerformanceMode?: () => void;
  performanceModeVanta?: {
    freeze: () => void;
    resume: () => void;
  };
  performanceModeMatter?: {
    start: () => void;
    stop: () => void;
  };
  performanceModeMarquee?: {
    start: () => void;
    refresh: () => void;
  };
  performanceModeScroll?: {
    enableSnap: () => void;
    disableSnap: () => void;
    syncSnapping: () => void;
    refresh: () => void;
  };
}
