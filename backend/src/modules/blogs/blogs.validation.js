import { z } from "zod";

const textDataSchema = z.object({
  content: z.string().trim().default(""),
  text: z.string().trim().optional()
}).catchall(z.any());

const mediaDataSchema = z.object({
  url: z.string().trim().optional().default(""), 
  caption: z.string().trim().max(300).optional().nullable(),
  videoId: z.string().trim().optional(),
  platform: z.enum(["youtube", "vimeo"]).optional()
}).catchall(z.any());

const richTextContentBlock = z.object({ type: z.literal("richText"), data: textDataSchema });
const headingBlock = z.object({ type: z.literal("heading"), data: textDataSchema });
const paragraphBlock = z.object({ type: z.literal("paragraph"), data: textDataSchema });
const quoteBlock = z.object({ type: z.literal("quote"), data: textDataSchema });
const dividerBlock = z.object({ type: z.literal("divider"), data: z.record(z.any()).default({}) });
const imageBlock = z.object({ type: z.literal("image"), data: mediaDataSchema });

const galleryBlock = z.object({ 
  type: z.literal("gallery"), 
  data: z.object({ 
    images: z.array(z.string()).default([]) 
  }).default({ images: [] }) 
});

const videoBlock = z.object({ type: z.literal("video"), data: mediaDataSchema });

const blogBlockSchema = z.discriminatedUnion("type", [
  richTextContentBlock, headingBlock, paragraphBlock, quoteBlock, 
  dividerBlock, imageBlock, galleryBlock, videoBlock
]);

const blogContentSchema = z.object({
  blocks: z.array(blogBlockSchema).default([])
}).default({ blocks: [] });

export const createBlogSchema = z.object({
  title: z.string().trim().min(5, "Title requires at least 5 characters.").max(200),
  slug: z.string().trim().toLowerCase()
    .regex(/^[a-z0-9-]*$/, "Slug can only contain lowercase letters, numbers, and dashes")
    .max(150)
    .optional()
    .nullable(),
  excerpt: z.string().trim().max(1000).optional().nullable(),
  content: blogContentSchema,
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]).default("DRAFT").optional(),
  isFeatured: z.boolean().default(false).optional(),
  categoryIds: z.array(z.string().cuid()).default([]).optional(),
  tagIds: z.array(z.string().cuid()).default([]).optional(),
  featuredImageId: z.string().cuid().optional().nullable(),
  publishedAt: z.string().datetime().optional().nullable(),
  metaTitle: z.string().trim().max(150).optional().nullable(),
  metaDescription: z.string().trim().max(500).optional().nullable(),
  metaKeywords: z.string().trim().max(300).optional().nullable()
}); 

export const updateBlogSchema = createBlogSchema.partial().extend({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "SCHEDULED"]).optional()
});

export const blogQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "SCHEDULED"]).optional(),
  categorySlug: z.string().trim().optional(),
  tagSlug: z.string().trim().optional(),
  isFeatured: z.coerce.boolean().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "publishedAt", "title", "viewCount"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
});

export const createTaxonomySchema = z.object({
  name: z.string().trim().min(1, "Taxonomy title is mandatory.").max(100)
}).strict();

export const blogParamSchema = z.object({ id: z.string().cuid() });
export const blogSlugParamSchema = z.object({ slug: z.string().min(1) });
export const blogPreviewTokenParamSchema = z.object({
  token: z.string()
    .length(64, "Token signature length evaluation failed system security constraints boundary checks.")
});