import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const collections = {
  projects: defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      publishDate: z.coerce.date(),
      tags: z.array(z.string()),
      tools: z
        .array(
          z.object({
            name: z.string(),
            alt: z.string().optional(),
            icon: z.string().optional(),
          })
        )
        .optional(),
      live: z.string().optional(),
      git: z.string().optional(),
      img: z.string(),
      img_w: z.number(),
      img_h: z.number(),
      img_alt: z.string().optional(),
      featured: z.boolean().optional().default(false),
      role: z.string().optional(),
      highlights: z.array(z.string()).optional(),
    }),
  }),
  blog: defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      publishDate: z.coerce.date(),
      tags: z.array(z.string()),
      tools: z
        .array(
          z.object({
            name: z.string(),
            alt: z.string().optional(),
            icon: z.string().optional(),
          })
        )
        .optional(),
      live: z.string().optional(),
      git: z.string().optional(),
      img: z.string(),
      img_w: z.number(),
      img_h: z.number(),
      img_alt: z.string().optional(),
    }),
  }),
};
