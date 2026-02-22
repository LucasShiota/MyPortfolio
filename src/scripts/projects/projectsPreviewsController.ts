type ProjectsPreviewsController = {
  setActiveId: (id: string) => void;
  setVisibleIds: (ids: Set<string>) => void;
};

export const initProjectsPreviewsController = (
  panel: HTMLElement
): ProjectsPreviewsController | null => {
  const previews = Array.from(
    panel.querySelectorAll<HTMLElement>(".preview-entry")
  );
  if (previews.length === 0) return null;

  const getPreviewId = (preview: HTMLElement): string =>
    preview.getAttribute("data-project-id") || "";

  const setVisibleIds = (ids: Set<string>): void => {
    previews.forEach((preview) => {
      const isVisible = ids.has(getPreviewId(preview));
      preview.classList.toggle("is-filtered-out", !isVisible);
      if (!isVisible) preview.classList.remove("active");
    });
  };

  const setActiveId = (id: string): void => {
    previews.forEach((preview) => {
      const previewId = getPreviewId(preview);
      const isVisible = !preview.classList.contains("is-filtered-out");
      preview.classList.toggle("active", isVisible && previewId === id);
    });
  };

  return {
    setActiveId,
    setVisibleIds,
  };
};
