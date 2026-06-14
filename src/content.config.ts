import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const writing = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    lens: z.enum(["economics", "philosophy", "technical", "theatrical"]),
    status: z.enum(["published", "writing"]).default("published"),
    featured: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

const reading = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/reading" }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    note: z.string(),
    status: z.enum(["read", "on-deck"]),
    opened: z.string(),
    cover: z.string().optional(),
    link: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { writing, reading };
