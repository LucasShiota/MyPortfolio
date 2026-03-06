import { ProjectSliderPhysics } from "./projectsPhysics";

type Options = {
  panel: HTMLElement;
  onActiveIdChange: (id: string) => void;
  onVisibleIdsChange: (ids: Set<string>) => void;
};

export const initProjectsEntriesController = ({
  panel,
  onActiveIdChange,
  onVisibleIdsChange,
}: Options): void => {
  const container = panel.querySelector<HTMLElement>(".project-list");
  const entries = Array.from(panel.querySelectorAll<HTMLElement>('.project-entry[data-project-selectable="true"]'));
  const filterButtons = Array.from(panel.querySelectorAll<HTMLButtonElement>(".project-filter-btn"));

  if (!container || entries.length === 0) return;

  // --- STATE ---
  const physics = new ProjectSliderPhysics(container);
  const selectedFilters = new Set<string>();
  let visibleEntries: HTMLElement[] = [...entries];
  let currentVisibleIndex = 0;
  let dragStartX = 0;
  let lastDragPos = 0;
  let dragVelocity = 0;

  // --- HELPERS ---
  const getEntryId = (entry: HTMLElement) => entry.getAttribute("data-project-id") || "";

  const syncVisibleEntries = () => {
    visibleEntries = entries.filter(e => !e.classList.contains("is-filtered-out"));
  };

  const getEntryCenterInContainer = (entry: HTMLElement) => {
    const entryRect = entry.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return entryRect.left - containerRect.left + container.scrollLeft + entryRect.width / 2;
  };

  const getVisibleIndexAtCenter = () => {
    const centerX = container.scrollLeft + container.clientWidth / 2;
    let minDistance = Infinity;
    let closest = 0;

    visibleEntries.forEach((entry, i) => {
      const distance = Math.abs(getEntryCenterInContainer(entry) - centerX);
      if (distance < minDistance) {
        minDistance = distance;
        closest = i;
      }
    });

    return closest;
  };

  const updateVisuals = (index: number) => {
    const activeEntry = visibleEntries[index];
    const activeId = activeEntry ? getEntryId(activeEntry) : "";

    entries.forEach(e => {
      e.classList.remove("is-active");
      e.setAttribute("aria-pressed", "false");
    });

    if (activeEntry) {
      activeEntry.classList.add("is-active");
      activeEntry.setAttribute("aria-pressed", "true");
    }

    onActiveIdChange(activeId);
  };

  const selectVisibleIndex = (index: number, { shouldScroll = true, instant = false } = {}) => {
    if (visibleEntries.length === 0) {
      updateVisuals(-1);
      return;
    }

    currentVisibleIndex = Math.max(0, Math.min(visibleEntries.length - 1, index));
    updateVisuals(currentVisibleIndex);

    const entry = visibleEntries[currentVisibleIndex];
    if (shouldScroll && entry) {
      const position = getEntryCenterInContainer(entry) - container.clientWidth / 2;
      physics.scrollTo(position, instant);
    }
  };

  // --- INTERACTIONS ---
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    physics.applyDelta(delta * 1.5);
  };

  const initDrag = (clientX: number) => {
    physics.isDragging = true;
    physics.stopLerp();
    container.classList.add("is-grabbing");
    
    dragStartX = clientX;
    lastDragPos = clientX;
    dragVelocity = 0;
    
    physics.currentScroll = container.scrollLeft;
    physics.targetScroll = physics.currentScroll;
  };

  const processDragMove = (clientX: number, e: Event) => {
    if (!physics.isDragging) return;
    e.preventDefault();

    const walk = dragStartX - clientX;
    dragVelocity = lastDragPos - clientX;
    lastDragPos = clientX;

    physics.currentScroll = physics.targetScroll + walk;
    container.scrollLeft = physics.currentScroll;
    
    physics.targetScroll = physics.currentScroll;
    dragStartX = clientX;
  };

  const releaseDrag = () => {
    if (!physics.isDragging) return;
    physics.isDragging = false;
    container.classList.remove("is-grabbing");
    
    physics.scrollTo(physics.currentScroll + (dragVelocity * 15));
  };

  // --- FILTERS ---
  const isVisibleForFilter = (entry: HTMLElement, filters: Set<string>) => {
    if (filters.size === 0) return true;
    const tags = (entry.getAttribute("data-project-tags") || "").split(",").map(t => t.trim()).filter(Boolean);
    return tags.some(t => filters.has(t));
  };

  const applyFilters = () => {
    const currentActiveId = visibleEntries[currentVisibleIndex] && getEntryId(visibleEntries[currentVisibleIndex]);

    filterButtons.forEach(btn => {
      const filter = btn.dataset.filter || "all";
      const isActive = filter === "all" ? selectedFilters.size === 0 : selectedFilters.has(filter);
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });

    entries.forEach(e => {
      const shouldShow = isVisibleForFilter(e, selectedFilters);
      e.classList.toggle("is-filtered-out", !shouldShow);
    });

    syncVisibleEntries();
    onVisibleIdsChange(new Set(visibleEntries.map(e => getEntryId(e))));

    const preservedIndex = currentActiveId ? visibleEntries.findIndex(e => getEntryId(e) === currentActiveId) : -1;
    selectVisibleIndex(preservedIndex >= 0 ? preservedIndex : 0, { instant: true });
  };

  // --- LISTENERS ---
  container.addEventListener("mousedown", (e) => initDrag(e.pageX));
  window.addEventListener("mousemove", (e) => processDragMove(e.pageX, e));
  window.addEventListener("mouseup", releaseDrag);
  container.addEventListener("mouseleave", releaseDrag);

  container.addEventListener("wheel", handleWheel, { passive: false });
  container.addEventListener("touchstart", (e) => e.touches[0] && initDrag(e.touches[0].clientX), { passive: true });
  container.addEventListener("touchmove", (e) => e.touches[0] && processDragMove(e.touches[0].clientX, e), { passive: false });
  container.addEventListener("touchend", releaseDrag);

  entries.forEach(e => e.addEventListener("click", () => {
    const index = visibleEntries.indexOf(e);
    if (index >= 0) selectVisibleIndex(index);
  }));

  filterButtons.forEach(btn => btn.addEventListener("click", () => {
    const filter = btn.dataset.filter || "all";
    if (filter === "all") selectedFilters.clear();
    else if (selectedFilters.has(filter)) selectedFilters.delete(filter);
    else selectedFilters.add(filter);
    applyFilters();
  }));

  // --- RESIZE ---
  let resizeTimeout: number;
  window.addEventListener("resize", () => {
    physics.currentScroll = container.scrollLeft;
    physics.targetScroll = physics.currentScroll;

    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      if (window.innerWidth < 720 && selectedFilters.size > 0) {
        selectedFilters.clear();
        applyFilters();
      } else {
        selectVisibleIndex(getVisibleIndexAtCenter(), { instant: true });
      }
    }, 150);
  });

  // --- INIT ---
  applyFilters();
  selectVisibleIndex(0, { instant: true });
};
