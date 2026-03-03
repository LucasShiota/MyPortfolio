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
    
    // Page Structure - The "Master System"
    sections: z.array(z.lazy(() => z.object({
      id: z.string(),
      label: z.string(),
      component: z.string(), 
      props: z.record(z.any()).optional(), // Any additional data for that component
      subsections: z.array(z.lazy(() => z.object({
        id: z.string(),
        label: z.string(),
        component: z.string(),
        props: z.record(z.any()).optional()
      }))).optional()
    }))).optional(),

    // Full Page Specifics (Keep legacy fields for now to avoid breaking changes)
    goals: z.array(z.string()).optional(),
  }),
});

export const collections = {
  'projects': projectsCollection,
};
