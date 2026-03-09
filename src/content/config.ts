/**
 * ══════════════════════════════════════════════
 *  CONTENT CONFIGURATION (config.ts)
 * ══════════════════════════════════════════════
 *
 * PURPOSE: Defines the schema and validation for Astro content collections.
 *
 * CRITICAL RULES:
 * - Uses the image() helper for assets to enable Astro's optimization pipeline.
 */
import { defineCollection, z } from "astro:content";

const projectsCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      title: z.string(),
      subtitle: z.string().optional(),
      thumbnailSrc: image(),
      thumbnailAlt: z.string(),
      previewImage: image(),
      previewVideo: z.string().optional(),
      heroImage: image().optional(),
      logo: image().optional(),

      // For Home Page Filtering
      filterTags: z.array(z.string()),

      // For Styled Tag Display
      descriptorTags: z.array(z.string()).optional(),
      descriptorTagColors: z.record(z.enum(["green", "purple", "red", "blue"])).optional(),

      // Links
      previewButton: z.object({
        text: z.string(),
        href: z.string(),
        ariaLabel: z.string(),
      }),

      summary: z.string(),

      // Page Structure - The "Master System"
      sections: z
        .array(
          z.lazy(() =>
            z.object({
              id: z.string().optional(),
              label: z.string().optional(),
              component: z.string(),
              options: z
                .object({
                  excludeFromOrder: z.boolean().optional(),
                  barColor: z.string().optional(),
                  compact: z.boolean().optional(),
                })
                .optional(),
              props: z.record(z.any()).optional(), // Any additional data for that component
              subsections: z
                .array(
                  z.lazy(() =>
                    z.object({
                      id: z.string().optional(),
                      label: z.string().optional(),
                      component: z.string(),
                      options: z
                        .object({
                          excludeFromOrder: z.boolean().optional(),
                          barColor: z.string().optional(),
                          compact: z.boolean().optional(),
                        })
                        .optional(),
                      props: z.record(z.any()).optional(),
                    })
                  )
                )
                .optional(),
            })
          )
        )
        .optional(),

      // Full Page Specifics (Keep legacy fields for now to avoid breaking changes)
      goals: z.array(z.string()).optional(),
    }),
});

export const collections = {
  projects: projectsCollection,
};
