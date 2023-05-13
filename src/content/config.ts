import { defineCollection, z } from 'astro:content';

export const collections = {
	work: defineCollection({
		schema: z.object({

			title: z.string(),
			description: z.string(),
			publishDate: z.coerce.date(),
			tags: z.array(z.string()),
			tools: z.array(z.object({
				name: z.string(),
				alt: z.string().optional(),
				icon: z.string().optional(),
			})).optional(),
			live: z.string().optional(),
			git: z.string().optional(),
			img: z.string(),
			img_w: z.number(),
			img_h: z.number(),
			img_alt: z.string().optional(),

		}),
	}),
	blog: defineCollection({
		schema: z.object({

			title: z.string(),
			description: z.string(),
			publishDate: z.coerce.date(),
			tags: z.array(z.string()),
			tools: z.array(z.object({
				name: z.string(),
				alt: z.string().optional(),
				icon: z.string().optional(),
			})).optional(),
			live: z.string().optional(),
			git: z.string().optional(),
			img: z.string(),
			img_w: z.number(),
			img_h: z.number(),
			img_alt: z.string().optional(),

		}),
	}),
};
