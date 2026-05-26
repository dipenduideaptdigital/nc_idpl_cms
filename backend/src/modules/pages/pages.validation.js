import { z } from "zod";

const RESERVED_SLUGS = [
  "admin", "api", "login", "register", "dashboard", 
  "cms", "uploads", "settings", "profile", "users",
  "home", "index", "404", "500"
];

const heroBlockSchema = z.object({
  type: z.literal("hero"),
  data: z.record(z.any()), 
});

const richTextBlockSchema = z.object({
  type: z.literal("richText"),
  data: z.record(z.any()),
});

const galleryBlockSchema = z.object({
  type: z.literal("gallery"),
  data: z.record(z.any()),
});

const testimonialBlockSchema = z.object({
  type: z.literal("testimonials"),
  data: z.record(z.any()),
});

const blockSchema = z.discriminatedUnion("type", [
  heroBlockSchema,
  richTextBlockSchema,
  galleryBlockSchema,
  testimonialBlockSchema,
]);

const pageContentSchema = z.object({
  blocks: z.array(blockSchema).default([]),
});

export const createPageSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(150),
  
  slug: z.string().trim().toLowerCase()
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and dashes")
    .max(150)
    .refine((slug) => !RESERVED_SLUGS.includes(slug), {
      message: "This slug is reserved by the system and cannot be used.",
    })
    .optional(), 
    
  excerpt: z.string().trim().max(1000).optional().nullable(),
  content: pageContentSchema,
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT").optional(),
  
  template: z.string().trim().max(100).default("default").optional(),
  
  metaTitle: z.string().trim().max(100).optional().nullable(),
  metaDescription: z.string().trim().max(500).optional().nullable(),
  metaKeywords: z.string().trim().max(300).optional().nullable(),
  
  featuredImageId: z.string().cuid("Invalid Media ID").optional().nullable(),
});

export const updatePageSchema = createPageSchema.partial().extend({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

//  Query Schema (Admin & Public)
export const pageQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  template: z.string().optional(),
  authorId: z.string().cuid().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "publishedAt", "title"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const pageIdParamSchema = z.object({
  id: z.string().cuid("Invalid Page ID"),
});

export const pageSlugParamSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});