import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = {
  id: string;
  title: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  body: string; // Summary HTML
  previewImage: string;
  previewVideo?: string;
  tags: string[]; // filterTags
  descriptorTags?: string[];
  descriptorTagColors?: Record<string, 'green' | 'purple' | 'red' | 'blue'>;
  previewButton: {
    text: string;
    href: string;
    ariaLabel: string;
  };
};

export async function getProjects(): Promise<Project[]> {
  const collection = await getCollection('projects');
  
  return collection.map((entry: CollectionEntry<'projects'>) => {
    const data = entry.data;
    
    // Convert summary & goals back into the HTML body format the UI currently expects
    const goalsHtml = data.goals 
      ? `<ul>${data.goals.map((g: string) => `<li>${g}</li>`).join('')}</ul>` 
      : '';
    const bodyHtml = `<p>${data.summary}</p>${goalsHtml}`;
    
    return {
      id: data.id,
      title: data.title,
      thumbnailSrc: data.thumbnailSrc,
      thumbnailAlt: data.thumbnailAlt,
      body: bodyHtml,
      previewImage: data.previewImage,
      previewVideo: data.previewVideo,
      tags: data.filterTags,
      descriptorTags: data.descriptorTags,
      descriptorTagColors: data.descriptorTagColors,
      previewButton: data.previewButton,
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
