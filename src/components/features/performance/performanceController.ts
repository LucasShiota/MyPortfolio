const STORAGE_KEY = "performance-mode-v3";
const TOGGLE_SELECTOR = ".performance-toggle";

export const PERF_MODES = ["auto", "eco", "off"] as const;
export type PerformanceMode = (typeof PERF_MODES)[number];

export const initPerformanceController = () => {
  const applyPerformanceMode = (mode: PerformanceMode) => {
    // 1. Tag Document
    PERF_MODES.forEach((m) => document.documentElement.classList.remove(`perf-${m}`));
    document.documentElement.classList.add(`perf-${mode}`);

    // Legacy support for other components
    document.documentElement.classList.toggle("performance-mode", mode === "off");

    // 2. Global Flag
    window.__performanceModeEnabled = mode === "off";

    // 3. Update Vanta/Shader
    if (window.performanceModeVanta) {
      if (mode === "auto") {
        window.performanceModeVanta.setLevel?.("high", false); // Start high, ALLOW auto-downgrade
        window.performanceModeVanta.resume?.();
      } else if (mode === "eco") {
        window.performanceModeVanta.setLevel?.("low", true); // Force low, NO change
        window.performanceModeVanta.resume?.();
      } else {
        window.performanceModeVanta.setLevel?.("off", true);
        window.performanceModeVanta.freeze?.();
      }
    }

    // 4. Other Systems (Matter.js, etc.)
    if (mode === "off") {
      window.performanceModeMatter?.stop();
    } else {
      window.performanceModeMatter?.start();
    }

    // 5. Update UI
    const buttons = document.querySelectorAll<HTMLElement>(TOGGLE_SELECTOR);
    buttons.forEach((button) => {
      button.setAttribute("data-mode", mode);

      // Trigger the "expansion" animation
      button.classList.remove("is-switching");
      void button.offsetWidth;
      button.classList.add("is-switching");

      // Remove the class after animation completes
      setTimeout(() => button.classList.remove("is-switching"), 2000);
    });
  };

  window.togglePerformanceMode = () => {
    const currentMode = (localStorage.getItem(STORAGE_KEY) as PerformanceMode) || "auto";
    const currentIndex = PERF_MODES.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % PERF_MODES.length;
    const nextMode = PERF_MODES[nextIndex];

    applyPerformanceMode(nextMode);
    localStorage.setItem(STORAGE_KEY, nextMode);
  };

  // Initial State Detection
  const savedMode = localStorage.getItem(STORAGE_KEY) as PerformanceMode;
  const initialMode = savedMode || (window.innerWidth < 1024 ? "eco" : "auto");

  applyPerformanceMode(initialMode);

  // Click Listener
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const btn = target.closest(TOGGLE_SELECTOR);
    if (!btn) return;

    window.togglePerformanceMode?.();
  });
};
