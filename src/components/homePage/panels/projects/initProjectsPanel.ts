import { initProjectsEntriesController } from "./projectsEntriesController";
import { initProjectsPreviewsController } from "./projectsPreviewsController";

export const initProjectsPanel = (): void => {
  const panel = document.querySelector<HTMLElement>(".projects-panel");
  if (!panel) return;

  const previewsController = initProjectsPreviewsController(panel);
  if (!previewsController) return;

  initProjectsEntriesController({
    panel,
    onActiveIdChange: (id) => previewsController.setActiveId(id),
    onVisibleIdsChange: (ids) => previewsController.setVisibleIds(ids),
  });
};
