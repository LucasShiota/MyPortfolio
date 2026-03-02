interface PerformanceWindow extends Window {
  performanceModeVanta?: any;
  performanceModeMatter?: any;
  performanceModeMarquee?: any;
  performanceModeScroll?: any;
  __performanceModeEnabled?: boolean;
  togglePerformanceMode?: () => void;
}

const win = window as unknown as PerformanceWindow;
const STORAGE_KEY = "performance-mode";
const TOGGLE_SELECTOR = ".performance-toggle";

export const initPerformanceController = () => {
  const setPerformanceMode = (enabled: boolean) => {
    win.__performanceModeEnabled = enabled;
    document.documentElement.classList.toggle("performance-mode", enabled);

    const buttons = document.querySelectorAll<HTMLElement>(TOGGLE_SELECTOR);
    buttons.forEach(button => {
      button.setAttribute("aria-pressed", String(enabled));
    });

    if (enabled) {
      win.performanceModeVanta?.freeze();
      win.performanceModeMatter?.stop();
      win.performanceModeMarquee?.refresh();
      win.performanceModeScroll?.disableSnap();
    } else {
      win.performanceModeVanta?.resume();
      win.performanceModeMatter?.start();
      win.performanceModeMarquee?.refresh();
      win.performanceModeScroll?.enableSnap();
    }
  };

  win.togglePerformanceMode = () => {
    const nextState = !win.__performanceModeEnabled;
    setPerformanceMode(nextState);
    localStorage.setItem(STORAGE_KEY, nextState ? "on" : "off");
  };

  // Initial State
  const initialState = localStorage.getItem(STORAGE_KEY) === "on";
  setPerformanceMode(initialState);

  // Global Click Listener for Toggles
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const btn = target.closest(TOGGLE_SELECTOR);
    if (!btn) return;

    // Handle Fling Animation
    if (btn instanceof HTMLElement && btn.hasAttribute('data-delay-toggle')) {
      event.stopPropagation();
      btn.classList.remove('fling');
      void btn.offsetWidth;
      btn.classList.add('fling');
      return;
    }

    win.togglePerformanceMode?.();
  });

  // Handle Animation End for delayed toggles
  document.addEventListener('animationend', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const btn = target.closest('.performance-toggle.fling');
    if (btn) {
      btn.classList.remove('fling');
      win.togglePerformanceMode?.();
    }
  }, { capture: true });
};
