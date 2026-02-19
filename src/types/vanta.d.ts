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
  __simpleModeEnabled?: boolean;
  simpleModeVanta?: {
    freeze: () => void;
    resume: () => void;
  };
  simpleModeMatter?: {
    start: () => void;
    stop: () => void;
  };
  simpleModeMarquee?: {
    start: () => void;
    refresh: () => void;
  };
}
