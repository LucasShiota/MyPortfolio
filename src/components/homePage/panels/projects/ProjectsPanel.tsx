/**
 * ══════════════════════════════════════════════
 *  PROJECTS PANEL (SolidJS Integration)
 * ══════════════════════════════════════════════
 *
 * PURPOSE: Provides reactive state management for the project preview and list.
 * Eliminates "Ghost DOM" by conditionally rendering ONLY the active project preview.
 */
import { createSignal, createEffect, onMount, For, Show } from "solid-js";
import { ProjectSliderPhysics } from "./projectsPhysics";
import type { Project } from "./projectsData";

interface Props {
  projects: Project[];
  filterTags: string[];
}

export default function ProjectsPanel(props: Props) {
  const [activeId, setActiveId] = createSignal<string>(props.projects[0]?.id || "");
  const [selectedFilters, setSelectedFilters] = createSignal<Set<string>>(new Set());
  const [isDragging, setIsDragging] = createSignal(false);

  let containerRef: HTMLDivElement | undefined;
  let physics: ProjectSliderPhysics | undefined;
  let dragStartX = 0;
  let lastDragPos = 0;
  let dragVelocity = 0;

  // Filter logic
  const visibleProjects = () => {
    const filters = selectedFilters();
    if (filters.size === 0) return props.projects;

    return props.projects.filter((p) => {
      return p.tags.some((t) => filters.has(t));
    });
  };

  const activeProject = () => {
    return props.projects.find((p) => p.id === activeId()) || props.projects[0];
  };

  const toggleFilter = (tag: string) => {
    const newFilters = new Set(selectedFilters());
    if (tag === "all") {
      newFilters.clear();
    } else {
      if (newFilters.has(tag)) newFilters.delete(tag);
      else newFilters.add(tag);
    }
    setSelectedFilters(newFilters);

    // Auto-select the first visible project after filtering
    const visible = visibleProjects();
    if (visible.length > 0 && !visible.find(p => p.id === activeId())) {
      setActiveId(visible[0].id);
      physics?.scrollTo(0, true);
    }
  };

  const selectProject = (id: string, index: number) => {
    setActiveId(id);
    
    // Auto-scroll to center the elected item (approximate center)
    if (containerRef && physics) {
      const entryNodes = Array.from(containerRef.children).filter(node => node.tagName === "BUTTON") as HTMLElement[];
      const targetEntry = entryNodes[index];
      if (targetEntry) {
        const entryRect = targetEntry.getBoundingClientRect();
        const containerRect = containerRef.getBoundingClientRect();
        const position = (entryRect.left - containerRect.left + containerRef.scrollLeft + entryRect.width / 2) - containerRef.clientWidth / 2;
        physics.scrollTo(position);
      }
    }
  };

  // --- PHYSICS & SCROLLING CONTROLS ---
  onMount(() => {
    if (!containerRef) return;
    physics = new ProjectSliderPhysics(containerRef);

    const handleWheel = (e: WheelEvent) => {
      const isHorizontalDominant = Math.abs(e.deltaX) >= Math.abs(e.deltaY);
      if (isHorizontalDominant) {
        e.preventDefault();
      }
      const delta = isHorizontalDominant ? e.deltaX : e.deltaY;
      physics?.applyDelta(delta * 1.5);
    };

    const initDrag = (clientX: number) => {
      if (!physics) return;
      physics.isDragging = true;
      setIsDragging(true);
      physics.stopLerp();

      dragStartX = clientX;
      lastDragPos = clientX;
      dragVelocity = 0;

      physics.syncState();
    };

    const processDragMove = (clientX: number, e: Event) => {
      if (!physics?.isDragging) return;
      e.preventDefault();

      const walk = dragStartX - clientX;
      dragVelocity = lastDragPos - clientX;
      lastDragPos = clientX;

      const newScroll = physics.currentScroll + walk;
      containerRef!.scrollLeft = newScroll;

      dragStartX = clientX;
    };

    const releaseDrag = () => {
      if (!physics?.isDragging) return;
      physics.isDragging = false;
      setIsDragging(false);

      // Apply inertia using the new GSAP-based scrollTo
      // Using a factor for the "throw" distance
      physics.syncState();
      const throwDistance = dragVelocity * 15;
      physics.scrollTo(physics.currentScroll + throwDistance);
    };

    containerRef.addEventListener("wheel", handleWheel, { passive: false });
    containerRef.addEventListener("mousedown", (e) => initDrag(e.pageX));
    window.addEventListener("mousemove", (e) => processDragMove(e.pageX, e));
    window.addEventListener("mouseup", releaseDrag);
    containerRef.addEventListener("mouseleave", releaseDrag);

    containerRef.addEventListener("touchstart", (e) => e.touches[0] && initDrag(e.touches[0].clientX), { passive: true });
    containerRef.addEventListener("touchmove", (e) => e.touches[0] && processDragMove(e.touches[0].clientX, e), { passive: false });
    containerRef.addEventListener("touchend", releaseDrag);
  });

  return (
    <div id="projects" class="panel projects-panel flx-algncntr-clmn justify-between">
      
      {/* --- PREVIEWS (No Ghost DOM) --- */}
      <div class="projects-preview-wrap">
        <div class="projects-preview-parent flx-cntr-clmn">
          <Show when={activeProject()}>
            <div class="preview-entry active" data-project-id={activeProject().id}>
              <header class="preview-header">
                <h3 class="preview-title">
                  <For each={activeProject().title.split("\n")}>
                    {(line, i) => (
                      <>
                        {line}
                        {i() < activeProject().title.split("\n").length - 1 && <br />}
                      </>
                    )}
                  </For>
                </h3>
              </header>

              <Show when={activeProject().descriptorTags && activeProject().descriptorTags!.length > 0}>
                <div class="descriptor-tags-container flx-algncntr-rw">
                  <For each={activeProject().descriptorTags}>
                    {(tag) => {
                      const color = activeProject().descriptorTagColors?.[tag] || "blue";
                      const colorMap: Record<string, string> = {
                        green: "btn-tag-green",
                        purple: "btn-tag-purple",
                        red: "btn-tag-red",
                        blue: "btn-tag-blue",
                      };
                      const colorClass = colorMap[color] || "btn-tag-blue";
                      return <span class={`descriptor-tag btn-type-tag ${colorClass}`}>{tag}</span>;
                    }}
                  </For>
                </div>
              </Show>

              <div class="preview-media">
                <Show 
                  when={activeProject().previewVideo} 
                  fallback={
                    <img
                      src={typeof activeProject().previewImage === 'string' ? activeProject().previewImage as string : (activeProject().previewImage as any).src}
                      alt={activeProject().thumbnailAlt}
                      class="media-content"
                      width={800}
                      height={800}
                      loading="eager"
                    />
                  }
                >
                  <video
                    src={activeProject().previewVideo}
                    autoplay
                    muted
                    loop
                    playsinline
                    poster={typeof activeProject().previewImage === 'string' ? activeProject().previewImage as string : (activeProject().previewImage as any).src}
                    class="media-content"
                  />
                </Show>
              </div>

              <div class="preview-body-text">
                <div class="body-content" innerHTML={activeProject().body} />
              </div>

              <footer class="preview-footer">
                <a
                  class="preview-link-btn"
                  href={activeProject().previewButton.href}
                  aria-label={activeProject().previewButton.ariaLabel}
                >
                  {activeProject().previewButton.text}
                </a>
              </footer>
            </div>
          </Show>
        </div>
      </div>

      {/* --- FILTERS --- */}
      <div class="projects-filter-parent flx-algncntr-rw">
        <div class="project-filters flx-algncntr-rw" role="group" aria-label="Filter projects">
          <button
            type="button"
            class="project-filter-btn"
            classList={{ "is-active": selectedFilters().size === 0 }}
            aria-pressed={selectedFilters().size === 0}
            onClick={() => toggleFilter("all")}
          >
            All
          </button>
          <For each={props.filterTags}>
            {(tag) => (
              <button
                type="button"
                class="project-filter-btn"
                classList={{ "is-active": selectedFilters().has(tag) }}
                aria-pressed={selectedFilters().has(tag)}
                onClick={() => toggleFilter(tag)}
              >
                {tag}
              </button>
            )}
          </For>
        </div>
      </div>

      {/* --- LIST --- */}
      <div class="projects-list-parent">
        <section 
          ref={containerRef}
          class="project-list flx-algncntr-rw"
          classList={{ "is-grabbing": isDragging() }} 
          aria-label="Project list"
        >
          <div class="scroll-buffer" aria-hidden="true">&nbsp;</div>
          <For each={visibleProjects()}>
            {(project, index) => {
              const thumbUrl = typeof project.thumbnailSrc === 'string' ? project.thumbnailSrc : project.thumbnailSrc.src;
              return (
                <button
                  type="button"
                  class="project-entry"
                  classList={{ "is-active": activeId() === project.id }}
                  data-project-id={project.id}
                  data-project-selectable="true"
                  aria-pressed={activeId() === project.id}
                  onClick={() => selectProject(project.id, index())}
                >
                  <img
                    class="project-thumbnail"
                    src={thumbUrl}
                    alt={project.thumbnailAlt}
                    width={150}
                    height={150}
                    loading="lazy"
                  />
                </button>
              );
            }}
          </For>
          <div class="scroll-buffer" aria-hidden="true">&nbsp;</div>
        </section>
      </div>

    </div>
  );
}
