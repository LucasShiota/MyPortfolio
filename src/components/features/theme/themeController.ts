interface ThemeWindow extends Window {}

const win = window as unknown as ThemeWindow;
const root = document.documentElement;

export const initThemeController = () => {
  const getHex = (varName: string) => {
    return getComputedStyle(root).getPropertyValue(varName).trim();
  };

  const hexToRgb = (hex: string): [number, number, number] => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  const rgbToHex = (r: number, g: number, b: number): number => {
    return (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b);
  };

  const setTheme = (nextTheme: "dark" | "light") => {
    if (nextTheme === "dark") {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  };

  const applyThemeInstantly = (nextTheme: "dark" | "light") => {
    root.classList.add("theme-switch-instant");
    setTheme(nextTheme);

    void root.offsetHeight; // Force reflow

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove("theme-switch-instant");
      });
    });
  };

  // Initial Sync

  // Listeners

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const toggleBtn = target.closest(".theme-toggle");
    if (!toggleBtn) return;

    const isDark = root.getAttribute("data-theme") === "dark";
    const nextTheme = isDark ? "light" : "dark";
    const isPerformanceMode = root.classList.contains("performance-mode");

    if (isPerformanceMode) {
      setTheme(nextTheme);
    } else {
      applyThemeInstantly(nextTheme);
    }
  });
};
