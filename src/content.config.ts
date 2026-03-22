// src/content.config.ts
import { defineCollection, z } from 'astro:content';

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    catalogNumber: z.string().optional(),
    shortDescription: z.string().optional(),
    featuredImage: z.string().optional(),
    videoUrl: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    category: z.string().optional(),
    motorType: z.string().optional(),
    featured: z.boolean().optional().default(true),
    order: z.number().optional().default(0),
  }),
});

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishDate: z.string(),
    excerpt: z.string().optional(),
    featuredImage: z.string().optional(),
    category: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

const testimonials = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    company: z.string().optional(),
    quote: z.string(),
    rating: z.number().min(1).max(5).optional().default(5),
  }),
});

// PL collections — same schema, separate content
const servicesPl = defineCollection({
  type: 'content',
  schema: services.schema,
});

const postsPl = defineCollection({
  type: 'content',
  schema: posts.schema,
});

export const collections = {
  services, posts, pages, testimonials,
  'services-pl': servicesPl,
  'posts-pl': postsPl,
};
