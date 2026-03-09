/**
 * ══════════════════════════════════════════════
 *  PROJECT DATA UTILITY (projectsData.ts)
 * ══════════════════════════════════════════════
 *
 * PURPOSE: Fetches and maps project content from Astro Collections.
 *
 * CRITICAL RULES:
 * - Uses entry.id for URL generation (required for Astro 5 compatibility).
 * - Maps image fields to ImageMetadata objects for optimization.
 */
import type { ImageMetadata } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";

export type Project = {
  id: string;
  title: string;
  thumbnailSrc: ImageMetadata | string;
  thumbnailAlt: string;
  body: string; // Summary HTML
  previewImage: ImageMetadata | string;
  previewVideo?: string;
  heroImage?: ImageMetadata | string;
  logo?: ImageMetadata | string;
  tags: string[]; // filterTags
  descriptorTags?: string[];
  descriptorTagColors?: Record<string, "green" | "purple" | "red" | "blue">;
  previewButton: {
    text: string;
    href: string;
    ariaLabel: string;
  };
};

export async function getProjects(): Promise<Project[]> {
  const collection = await getCollection("projects");

  return collection.map((entry: CollectionEntry<"projects">) => {
    const data = entry.data;

    // Convert summary & goals back into the HTML body format the UI currently expects
    const goalsHtml = data.goals
      ? `<ul>${data.goals.map((g: string) => `<li>${g}</li>`).join("")}</ul>`
      : "";
    const bodyHtml = `<p>${data.summary}</p>${goalsHtml}`;

    return {
      id: data.id,
      title: data.title,
      thumbnailSrc: data.thumbnailSrc,
      thumbnailAlt: data.thumbnailAlt,
      body: bodyHtml,
      previewImage: data.previewImage,
      previewVideo: data.previewVideo,
      heroImage: data.heroImage,
      logo: data.logo,
      tags: data.filterTags,
      descriptorTags: data.descriptorTags,
      descriptorTagColors: data.descriptorTagColors,
      previewButton: {
        text: data.previewButton.text,
        ariaLabel: data.previewButton.ariaLabel,
        href: `/${entry.id}`, // Dynamically centralized! Ensures the button always points to the live [slug].astro route
      },
    };
  });
}

// Keep the filterTags export, but it will need to be calculated from the fetched projects now
export async function getFilterTags() {
  const projects = await getProjects();
  return Array.from(
    new Set(projects.flatMap((project) => project.tags).filter((tag) => tag !== "all"))
  );
}
