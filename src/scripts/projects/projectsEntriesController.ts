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
    panel.querySelectorAll<HTMLElement>('.project-entry[data-project-selectable="true"]')
  );
  const filterButtons = Array.from(
    panel.querySelectorAll<HTMLButtonElement>(".project-filter-btn")
  );

  if (!container || entries.length === 0) return;

  let visibleEntries = [...entries];
  let currentVisibleIndex = 0;
  let isProgrammaticScroll = false;
  let touchStartX: number | null = null;
  const selectedFilters = new Set<string>();
  let programmaticScrollReleaseTimer: number | null = null;

  const getEntryId = (entry: HTMLElement): string =>
    entry.getAttribute("data-project-id") || "";

  const syncVisibleEntries = (): void => {
    visibleEntries = entries.filter(
      (entry) => !entry.classList.contains("is-filtered-out")
    );
  };

  const updateEdgePadding = (): void => {
    const firstVisible = visibleEntries[0];
    const lastVisible = visibleEntries[visibleEntries.length - 1];

    if (!firstVisible || !lastVisible) {
      container.style.paddingLeft = "0px";
      container.style.paddingRight = "0px";
      return;
    }

    const leftPadding = Math.max(
      0,
      (container.clientWidth - firstVisible.offsetWidth) / 2
    );
    const rightPadding = Math.max(
      0,
      (container.clientWidth - lastVisible.offsetWidth) / 2
    );

    container.style.paddingLeft = `${leftPadding}px`;
    container.style.paddingRight = `${rightPadding}px`;
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
      return;
    }

    visibleEntries.forEach((entry, i) => {
      const distance = Math.abs(i - index);
      entry.classList.toggle("is-active", distance === 0);
      entry.classList.toggle("is-hovering", distance === 1);
      entry.setAttribute("aria-pressed", distance === 0 ? "true" : "false");
    });

    onActiveIdChange(activeId);
  };

  const getEntryCenterInContainer = (entry: HTMLElement): number => {
    const entryRect = entry.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return entryRect.left - containerRect.left + container.scrollLeft + entryRect.width / 2;
  };

  const scrollEntryToCenter = (
    index: number,
    behavior: ScrollBehavior = "smooth"
  ): void => {
    const entry = visibleEntries[index];
    if (!entry) return;

    const left = getEntryCenterInContainer(entry) - container.clientWidth / 2;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    container.scrollTo({
      left: Math.max(0, Math.min(left, maxScrollLeft)),
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
    const center = container.scrollLeft + container.clientWidth / 2;

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

  const canScrollForDelta = (deltaX: number): boolean => {
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    if (maxScrollLeft <= 0) return false;

    const edgeEpsilon = 1;
    if (deltaX < 0) return container.scrollLeft > edgeEpsilon;
    if (deltaX > 0) return container.scrollLeft < maxScrollLeft - edgeEpsilon;
    return true;
  };

  const handleWheel = (event: WheelEvent): void => {
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (canScrollForDelta(delta)) {
      container.scrollLeft += delta;
      event.preventDefault();
      return;
    }
    event.preventDefault();
    event.stopPropagation();
  };

  const handleTouchStart = (event: TouchEvent): void => {
    touchStartX = event.touches[0]?.clientX ?? null;
  };

  const handleTouchMove = (event: TouchEvent): void => {
    const currentTouchX = event.touches[0]?.clientX;
    if (touchStartX == null || currentTouchX == null) return;

    const deltaX = touchStartX - currentTouchX;
    if (canScrollForDelta(deltaX)) return;

    event.preventDefault();
    event.stopPropagation();
  };

  const resetTouchStart = (): void => {
    touchStartX = null;
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
