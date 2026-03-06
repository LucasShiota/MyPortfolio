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
    refresh: () => void;
  };
}
