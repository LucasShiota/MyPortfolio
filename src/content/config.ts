import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string().optional(),
    thumbnailSrc: z.string(),
    thumbnailAlt: z.string(),
    previewImage: z.string(),
    previewVideo: z.string().optional(),
    heroImage: z.string().optional(),
    logo: z.string().optional(),
    
    // For Home Page Filtering
    filterTags: z.array(z.string()),
    
    // For Styled Tag Display
    descriptorTags: z.array(z.string()).optional(),
    descriptorTagColors: z.record(z.enum(['green', 'purple', 'red', 'blue'])).optional(),
    
    // Links
    previewButton: z.object({
      text: z.string(),
      href: z.string(),
      ariaLabel: z.string(),
    }),
    
    summary: z.string(),
    
    // Full Page Specifics
    goals: z.array(z.string()).optional(),
  }),
});

export const collections = {
  'projects': projectsCollection,
};
