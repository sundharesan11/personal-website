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
    link: z.string().optional(),
  }),
});

const reading = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/reading" }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    note: z.string(),
    question: z.string().optional(),
    status: z.enum(["read", "on-deck"]),
    opened: z.string(),
    cover: z.string().optional(),
    link: z.string().optional(),
    order: z.number().default(0),
  }),
});

const modelling = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/modelling" }),
  schema: z.object({
    image: z.string(),
    title: z.string().optional(),
    photographer: z.string().optional(),
    brand: z.string().optional(),
    location: z.string().optional(),
    year: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = { writing, reading, modelling };
