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

export function startStartupGate() {
  const gate = document.getElementById("startup-gate");

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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runStages, { once: true });
    return;
  }

  runStages();
}
