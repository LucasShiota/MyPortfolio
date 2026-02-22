type InitProjectsEntriesControllerOptions = {
  panel: HTMLElement;
  onActiveIdChange: (id: string) => void;
  onVisibleIdsChange: (ids: Set<string>) => void;
};

export const initProjectsEntriesController = ({
  panel,
  onActiveIdChange,
  onVisibleIdsChange,
}: InitProjectsEntriesControllerOptions): void => {
  const container = panel.querySelector<HTMLElement>(".project-list");
  const entries = Array.from(
    panel.querySelectorAll<HTMLElement>(".project-entry")
  );
  const filterButtons = Array.from(
    panel.querySelectorAll<HTMLButtonElement>(".project-filter-btn")
  );
  const upButton = panel.querySelector<HTMLButtonElement>('[data-nav="up"]');
  const downButton = panel.querySelector<HTMLButtonElement>('[data-nav="down"]');

  if (!container || entries.length === 0) return;

  let visibleEntries = [...entries];
  let currentVisibleIndex = 0;
  let isProgrammaticScroll = false;
  let touchStartY: number | null = null;
  const selectedFilters = new Set<string>();
  let programmaticScrollReleaseTimer: number | null = null;

  const getEntryId = (entry: HTMLElement): string =>
    entry.getAttribute("data-project-id") || "";

  const syncVisibleEntries = (): void => {
    visibleEntries = entries.filter(
      (entry) => !entry.classList.contains("is-filtered-out")
    );
  };

  const updateArrowState = (): void => {
    const canMoveUp = currentVisibleIndex > 0;
    const canMoveDown = currentVisibleIndex < visibleEntries.length - 1;
    if (upButton) upButton.disabled = !canMoveUp;
    if (downButton) downButton.disabled = !canMoveDown;
  };

  const updateEdgePadding = (): void => {
    const firstVisible = visibleEntries[0];
    const lastVisible = visibleEntries[visibleEntries.length - 1];

    if (!firstVisible || !lastVisible) {
      container.style.paddingTop = "0px";
      container.style.paddingBottom = "0px";
      return;
    }

    const topPadding = Math.max(
      0,
      (container.clientHeight - firstVisible.offsetHeight) / 2
    );
    const bottomPadding = Math.max(
      0,
      (container.clientHeight - lastVisible.offsetHeight) / 2
    );

    container.style.paddingTop = `${topPadding}px`;
    container.style.paddingBottom = `${bottomPadding}px`;
  };

  const updateVisuals = (index: number): void => {
    const activeEntry = visibleEntries[index];
    const activeId = activeEntry ? getEntryId(activeEntry) : "";

    entries.forEach((entry) => {
      entry.classList.remove("is-active", "is-hovering");
      entry.setAttribute("aria-pressed", "false");
    });

    if (!activeEntry) {
      onActiveIdChange("");
      updateArrowState();
      return;
    }

    visibleEntries.forEach((entry, i) => {
      const distance = Math.abs(i - index);
      entry.classList.toggle("is-active", distance === 0);
      entry.classList.toggle("is-hovering", distance === 1);
      entry.setAttribute("aria-pressed", distance === 0 ? "true" : "false");
    });

    onActiveIdChange(activeId);
    updateArrowState();
  };

  const getEntryCenterInContainer = (entry: HTMLElement): number =>
    entry.offsetTop - container.offsetTop + entry.offsetHeight / 2;

  const scrollEntryToCenter = (
    index: number,
    behavior: ScrollBehavior = "smooth"
  ): void => {
    const entry = visibleEntries[index];
    if (!entry) return;

    const top = getEntryCenterInContainer(entry) - container.clientHeight / 2;
    const maxScrollTop = container.scrollHeight - container.clientHeight;

    container.scrollTo({
      top: Math.max(0, Math.min(top, maxScrollTop)),
      behavior,
    });
  };

  const selectVisibleIndex = (
    index: number,
    options: { shouldScroll?: boolean; behavior?: ScrollBehavior } = {}
  ): void => {
    if (visibleEntries.length === 0) {
      updateVisuals(0);
      return;
    }

    const { shouldScroll = true, behavior = "smooth" } = options;
    currentVisibleIndex = Math.max(0, Math.min(visibleEntries.length - 1, index));
    updateVisuals(currentVisibleIndex);

    if (shouldScroll) {
      isProgrammaticScroll = true;
      scrollEntryToCenter(currentVisibleIndex, behavior);
      if (programmaticScrollReleaseTimer !== null) {
        window.clearTimeout(programmaticScrollReleaseTimer);
      }
      programmaticScrollReleaseTimer = window.setTimeout(() => {
        isProgrammaticScroll = false;
        programmaticScrollReleaseTimer = null;
      }, 250);
    }
  };

  const getClosestVisibleIndexToCenter = (): number => {
    if (visibleEntries.length === 0) return 0;
    const center = container.scrollTop + container.clientHeight / 2;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    visibleEntries.forEach((entry, i) => {
      const entryCenter = getEntryCenterInContainer(entry);
      const distance = Math.abs(center - entryCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });

    return closestIndex;
  };

  const handleScroll = (): void => {
    if (isProgrammaticScroll) return;
    const closest = getClosestVisibleIndexToCenter();
    if (closest !== currentVisibleIndex) {
      currentVisibleIndex = closest;
      updateVisuals(currentVisibleIndex);
    }
  };

  const canScrollForDelta = (deltaY: number): boolean => {
    const maxScrollTop = container.scrollHeight - container.clientHeight;
    if (maxScrollTop <= 0) return false;

    const edgeEpsilon = 1;
    if (deltaY < 0) return container.scrollTop > edgeEpsilon;
    if (deltaY > 0) return container.scrollTop < maxScrollTop - edgeEpsilon;
    return true;
  };

  const handleWheel = (event: WheelEvent): void => {
    if (canScrollForDelta(event.deltaY)) return;
    event.preventDefault();
    event.stopPropagation();
  };

  const handleTouchStart = (event: TouchEvent): void => {
    touchStartY = event.touches[0]?.clientY ?? null;
  };

  const handleTouchMove = (event: TouchEvent): void => {
    const currentTouchY = event.touches[0]?.clientY;
    if (touchStartY == null || currentTouchY == null) return;

    const deltaY = touchStartY - currentTouchY;
    if (canScrollForDelta(deltaY)) return;

    event.preventDefault();
    event.stopPropagation();
  };

  const resetTouchStart = (): void => {
    touchStartY = null;
  };

  const isVisibleForFilter = (
    entry: HTMLElement,
    filters: Set<string>
  ): boolean => {
    if (getEntryId(entry) === "0") return true;
    if (filters.size === 0) return true;
    const tags = (entry.getAttribute("data-project-tags") || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    return tags.some((tag) => filters.has(tag));
  };

  const getVisibleIds = (): Set<string> =>
    new Set(visibleEntries.map((entry) => getEntryId(entry)));

  const applyFilters = (): void => {
    const currentActiveId =
      visibleEntries[currentVisibleIndex] &&
      getEntryId(visibleEntries[currentVisibleIndex]);

    filterButtons.forEach((button) => {
      const buttonFilter = button.dataset.filter || "all";
      const isAll = buttonFilter === "all";
      const isActive = isAll
        ? selectedFilters.size === 0
        : selectedFilters.has(buttonFilter);

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    entries.forEach((entry) => {
      const shouldShow = isVisibleForFilter(entry, selectedFilters);
      entry.classList.toggle("is-filtered-out", !shouldShow);
    });

    syncVisibleEntries();
    updateEdgePadding();
    onVisibleIdsChange(getVisibleIds());

    const preservedIndex = currentActiveId
      ? visibleEntries.findIndex((entry) => getEntryId(entry) === currentActiveId)
      : -1;

    selectVisibleIndex(preservedIndex >= 0 ? preservedIndex : 0, {
      shouldScroll: true,
      behavior: "auto",
    });
  };

  container.addEventListener("scroll", handleScroll);
  container.addEventListener("wheel", handleWheel, { passive: false });
  container.addEventListener("touchstart", handleTouchStart, { passive: true });
  container.addEventListener("touchmove", handleTouchMove, { passive: false });
  container.addEventListener("touchend", resetTouchStart);
  container.addEventListener("touchcancel", resetTouchStart);

  entries.forEach((entry) => {
    entry.addEventListener("click", () => {
      const index = visibleEntries.findIndex((visibleEntry) => visibleEntry === entry);
      if (index < 0) return;
      selectVisibleIndex(index, { shouldScroll: true, behavior: "smooth" });
    });
  });

  upButton?.addEventListener("click", () => {
    selectVisibleIndex(currentVisibleIndex - 1, {
      shouldScroll: true,
      behavior: "smooth",
    });
  });

  downButton?.addEventListener("click", () => {
    selectVisibleIndex(currentVisibleIndex + 1, {
      shouldScroll: true,
      behavior: "smooth",
    });
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";
      if (filter === "all") {
        selectedFilters.clear();
      } else if (selectedFilters.has(filter)) {
        selectedFilters.delete(filter);
      } else {
        selectedFilters.add(filter);
      }

      applyFilters();
    });
  });

  window.addEventListener("resize", () => {
    updateEdgePadding();
  });

  applyFilters();
  selectVisibleIndex(Math.min(1, visibleEntries.length - 1), {
    shouldScroll: true,
    behavior: "auto",
  });
};
