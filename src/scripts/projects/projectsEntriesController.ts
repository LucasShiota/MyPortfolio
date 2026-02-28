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
    // Edge padding is no longer needed since the dummy elements were removed
    // and we are embracing the native scroll bounds behavior.
  };

  const updateVisuals = (index: number): void => {
    const activeEntry = visibleEntries[index];
    const activeId = activeEntry ? getEntryId(activeEntry) : "";

    entries.forEach((entry) => {
      entry.classList.remove("is-active");
      entry.setAttribute("aria-pressed", "false");
    });

    if (!activeEntry) {
      onActiveIdChange("");
      return;
    }

    visibleEntries.forEach((entry, i) => {
      const distance = Math.abs(i - index);
      entry.classList.toggle("is-active", distance === 0);
      entry.setAttribute("aria-pressed", distance === 0 ? "true" : "false");
    });

    onActiveIdChange(activeId);
  };

  // --- Unified Physics Scroll System ---
  let currentScroll = container.scrollLeft;
  let targetScroll = container.scrollLeft;
  let lerpRafId: number | null = null;
  let isDragging = false;
  let dragStartX = 0;
  let lastDragPos = 0;
  let dragVelocity = 0;

  const startLerp = (): void => {
    if (!lerpRafId && !isDragging) {
      lerpRafId = requestAnimationFrame(updateLerpScroll);
    }
  };

  const updateLerpScroll = (): void => {
    if (isDragging) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    // Auto-clamp target to natural bounds
    targetScroll = Math.max(0, Math.min(targetScroll, maxScrollLeft));

    // Lerp interpolation (stiffness = 0.1)
    currentScroll += (targetScroll - currentScroll) * 0.1;

    if (Math.abs(targetScroll - currentScroll) > 0.5) {
      container.scrollLeft = currentScroll;
      lerpRafId = requestAnimationFrame(updateLerpScroll);
    } else {
      currentScroll = targetScroll;
      container.scrollLeft = currentScroll;
      lerpRafId = null;
    }
  };

  const getEntryCenterInContainer = (entry: HTMLElement): number => {
    const entryRect = entry.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return entryRect.left - containerRect.left + container.scrollLeft + entryRect.width / 2;
  };

  const getDistanceToEdge = (entry: HTMLElement): { left: number; right: number } => {
    const entryRect = entry.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return {
      left: entryRect.left - containerRect.left,
      right: containerRect.right - entryRect.right,
    };
  };

  const selectVisibleIndex = (
    index: number,
    options: { shouldScroll?: boolean; behavior?: ScrollBehavior } = {}
  ): void => {
    if (visibleEntries.length === 0) {
      updateVisuals(-1);
      return;
    }

    const { shouldScroll = true, behavior = "smooth" } = options;
    currentVisibleIndex = Math.max(0, Math.min(visibleEntries.length - 1, index));
    updateVisuals(currentVisibleIndex);

    const entry = visibleEntries[currentVisibleIndex];
    if (!entry || !shouldScroll) return;

    const { left, right } = getDistanceToEdge(entry);
    const threshold = container.clientWidth * 0.3;

    if (left < threshold || right < threshold || behavior === "auto") {
      const entryCenterLeft = getEntryCenterInContainer(entry) - container.clientWidth / 2;
      targetScroll = entryCenterLeft;
      
      if (behavior === "auto") {
        currentScroll = targetScroll;
        container.scrollLeft = currentScroll;
      } else {
        startLerp();
      }
    }
  };

  // --- Momentum Scrolling Variables ---
  const handleWheel = (event: WheelEvent): void => {
    // Unconditionally trap the scroll event to prevent layout cascading
    // (e.g., accidental full-page panel snaps).
    event.preventDefault();

    const isHorizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    const delta = isHorizontal ? event.deltaX : event.deltaY;

    if (delta !== 0) {
      // Apply delta directly to target for responsive tracking
      targetScroll += delta * 1.5; 
      startLerp();
    }
  };

  const initDrag = (clientX: number): void => {
    isDragging = true;
    if (lerpRafId) { cancelAnimationFrame(lerpRafId); lerpRafId = null; }
    container.classList.add("is-grabbing");
    
    dragStartX = clientX;
    lastDragPos = clientX;
    dragVelocity = 0;
    
    // Sync loops to current exact position
    currentScroll = container.scrollLeft;
    targetScroll = currentScroll;
  };

  const processDragMove = (clientX: number, event: Event): void => {
    if (!isDragging) return;
    event.preventDefault();

    const walk = dragStartX - clientX;
    dragVelocity = lastDragPos - clientX;
    lastDragPos = clientX;

    currentScroll = targetScroll + walk;
    container.scrollLeft = currentScroll;
    
    // Keep target synced for release
    targetScroll = currentScroll;
    dragStartX = clientX; // continuous walk offset
  };

  const releaseDrag = (): void => {
    if (!isDragging) return;
    isDragging = false;
    container.classList.remove("is-grabbing");
    
    // Apply inertia multiplier to ending velocity
    targetScroll = currentScroll + (dragVelocity * 15);
    startLerp();
  };

  const handleTouchStart = (event: TouchEvent): void => {
    if (event.touches[0]) initDrag(event.touches[0].clientX);
  };

  const handleTouchMove = (event: TouchEvent): void => {
    event.preventDefault(); // Trap vertical page scroll while touching list
    if (event.touches[0]) processDragMove(event.touches[0].clientX, event);
  };

  const handleTouchEnd = (): void => releaseDrag();

  const isVisibleForFilter = (
    entry: HTMLElement,
    filters: Set<string>
  ): boolean => {
    const isIntro = getEntryId(entry) === "0";
    if (filters.size === 0) return true;
    
    // Usually, we hide the Intro when other filters are active 
    // to show a focused list of projects.
    if (isIntro) return false;

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

    // Use preserved index if still available, otherwise:
    // If we have active filters, skip the "Intro" (index 0) and select the first project (index 1)
    // if it exists, to show the user the results of their filter immediately.
    let targetIndex = preservedIndex;
    if (targetIndex < 0) {
      targetIndex = (selectedFilters.size > 0 && visibleEntries.length > 1) ? 1 : 0;
    }

    selectVisibleIndex(targetIndex, {
      shouldScroll: true,
      behavior: "auto",
    });
  };

  const handleMouseDown = (e: MouseEvent): void => initDrag(e.pageX);
  const handleMouseMove = (e: MouseEvent): void => processDragMove(e.pageX, e);
  const handleMouseEnd = (): void => releaseDrag();

  container.addEventListener("mousedown", handleMouseDown);
  container.addEventListener("mouseleave", handleMouseEnd);
  container.addEventListener("mouseup", handleMouseEnd);
  container.addEventListener("mousemove", handleMouseMove);

  container.addEventListener("wheel", handleWheel, { passive: false });
  container.addEventListener("touchstart", handleTouchStart, { passive: true });
  container.addEventListener("touchmove", handleTouchMove, { passive: false });
  container.addEventListener("touchend", handleTouchEnd);
  container.addEventListener("touchcancel", handleTouchEnd);

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
