import { destroyMatter, initMatter } from "./physics.js";

const MATTER_DISABLE_MQ =
  "(max-width: 48rem), (max-height: 48rem), (hover: none) and (pointer: coarse)";

let isMatterInitialized = false;
let isControllerInitialized = false;
let matterDisableMediaQuery: MediaQueryList | null = null;
let onMatterViewportChange: (() => void) | null = null;

const isMatterBlockedByViewport = (): boolean =>
  matterDisableMediaQuery?.matches ?? false;

const startMatter = (): void => {
  if (
    window.__simpleModeEnabled ||
    isMatterInitialized ||
    isMatterBlockedByViewport()
  ) {
    return;
  }

  initMatter();
  isMatterInitialized = true;
};

const stopMatter = (): void => {
  if (!isMatterInitialized) return;
  destroyMatter();
  isMatterInitialized = false;
};

const syncMatterWithViewport = (): void => {
  if (isMatterBlockedByViewport()) {
    stopMatter();
    return;
  }

  if (!window.__simpleModeEnabled) {
    startMatter();
  }
};

const bindViewportWatcher = (): void => {
  if (!matterDisableMediaQuery || onMatterViewportChange) return;

  onMatterViewportChange = () => {
    syncMatterWithViewport();
  };

  if (typeof matterDisableMediaQuery.addEventListener === "function") {
    matterDisableMediaQuery.addEventListener("change", onMatterViewportChange);
  } else {
    matterDisableMediaQuery.addListener(onMatterViewportChange);
  }

  window.addEventListener(
    "beforeunload",
    () => {
      if (!matterDisableMediaQuery || !onMatterViewportChange) return;
      if (typeof matterDisableMediaQuery.removeEventListener === "function") {
        matterDisableMediaQuery.removeEventListener(
          "change",
          onMatterViewportChange
        );
      } else {
        matterDisableMediaQuery.removeListener(onMatterViewportChange);
      }
      onMatterViewportChange = null;
    },
    { once: true }
  );
};

export function initMatterController(): void {
  if (isControllerInitialized) return;
  isControllerInitialized = true;

  matterDisableMediaQuery = window.matchMedia(MATTER_DISABLE_MQ);

  window.simpleModeMatter = {
    start: startMatter,
    stop: stopMatter,
  };

  window.addEventListener("startup:matter", syncMatterWithViewport);
  bindViewportWatcher();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncMatterWithViewport, {
      once: true,
    });
    return;
  }

  syncMatterWithViewport();
}
