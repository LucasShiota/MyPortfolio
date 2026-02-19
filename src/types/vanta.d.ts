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
}
