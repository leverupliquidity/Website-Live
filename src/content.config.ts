// Content collections. Guides are Markdown files in src/content/guides/ (one file per guide).
// The fields below are what each guide file must have at the top (its "frontmatter").
// The comment block at the top of each guide file explains every field in plain words.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.string(),
      date: z.coerce.date(),
      author: z.string(),
      readTime: z.string(),
      lede: z.string(),
      leadImage: image(),
      leadImageAlt: z.string(),
      leadCaption: z.string().optional(),
      inlineImage: image().optional(),
      inlineImageAlt: z.string().default(''),
      inlineCaption: z.string().optional(),
      inlineAfterSection: z.number().int().min(0).default(1),
      beforeYouSign: z.array(z.string()).default([]),
      beforeYouSignAfterSection: z.number().int().min(0).default(2),
      costRows: z
        .array(
          z.object({
            item: z.string(),
            figure: z.string(),
            when: z.string(),
            broker: z.boolean().optional(),
          }),
        )
        .default([]),
      costTableAfterSection: z.number().int().min(0).default(3),
    }),
});

export const collections = { guides };
