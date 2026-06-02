import { z } from "zod";

// Registered system protection constraints
const RESERVED_SLUGS = [
  "admin", "api", "login", "register", "dashboard", 
  "cms", "uploads", "settings", "profile", "users",
  "home", "index", "404", "500"
];

export const ALLOWED_TEMPLATES = [
  "default",
  "landing-page",
  "service-page",
  "contact-page",
  "about-page"
];

// Headless Content Engine Block Structure Definition
const heroBlockSchema = z.object({
  type: z.literal("hero"),
  data: z.record(z.any()).default({}), 
});

const richTextBlockSchema = z.object({
  type: z.literal("richText"),
  data: z.record(z.any()).default({}),
});

const galleryBlockSchema = z.object({
  type: z.literal("gallery"),
  data: z.record(z.any()).default({}),
});

const testimonialBlockSchema = z.object({
  type: z.literal("testimonials"),
  data: z.record(z.any()).default({}),
});

const blockSchema = z.discriminatedUnion("type", [
  heroBlockSchema,
  richTextBlockSchema,
  galleryBlockSchema,
  testimonialBlockSchema,
]);

const pageContentSchema = z.object({
  blocks: z.array(blockSchema).default([]),
}).default({ blocks: [] });

// Create Validation Schema
export const createPageSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(150, "Title cannot exceed 150 characters"),
  
  slug: z.string().trim().toLowerCase()
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and dashes")
    .max(150, "Slug cannot exceed 150 characters")
    .refine((slug) => !RESERVED_SLUGS.includes(slug), {
      message: "This slug is reserved by the system and cannot be used.",
    })
    .optional(), 
    
  excerpt: z.string().trim().max(1000, "Excerpt cannot exceed 1000 characters").optional().nullable(),
  content: pageContentSchema,
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT").optional(),
  
  // Whitelist Template Security
  template: z.enum(ALLOWED_TEMPLATES, {
    errorMap: () => ({ message: "Selected layout design template is not registered or supported by system." })
  }).default("default").optional(),

  parentId: z.string().cuid("Invalid Parent ID structure").optional().nullable(),
  menuOrder: z.coerce.number().int("Menu order must be an integer").default(0).optional(),
  showInMenu: z.boolean().default(true).optional(),
  
  metaTitle: z.string().trim().max(100, "Meta title cannot exceed 100 characters").optional().nullable(),
  metaDescription: z.string().trim().max(500, "Meta description cannot exceed 500 characters").optional().nullable(),
  metaKeywords: z.string().trim().max(300, "Meta keywords cannot exceed 300 characters").optional().nullable(),
  
  featuredImageId: z.string().cuid("Invalid Media Asset ID mapping").optional().nullable(),
}).strict();

// Core Update Validation Schema
export const updatePageSchema = createPageSchema.partial().extend({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

// Admin Filter Matrix & Pagination Configuration Schema
export const pageQuerySchema = z.object({
  page: z.coerce.number().int().min(1, "Page must be greater than 0").default(1),
  limit: z.coerce.number().int().min(1, "Limit must be at least 1").max(100, "Maximum limit allowed is 100").default(10),
  search: z.string().trim().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  template: z.enum(ALLOWED_TEMPLATES).optional(), 
  authorId: z.string().cuid("Invalid Author filter constraint").optional(),
  parentId: z.string().cuid("Invalid Parent filter constraint").optional().nullable(), 
  sortBy: z.enum(["createdAt", "updatedAt", "publishedAt", "title", "menuOrder"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Dynamic Route Param hard security locks
export const pageIdParamSchema = z.object({
  id: z.string().cuid("Invalid cryptographic or transaction identity format mapped"),
});

export const pageSlugParamSchema = z.object({
  slug: z.string().min(1, "Absolute layout path resource identity tracking failed"),
});

// Administrative Revision Version Control Subsystem Parameters Match Locking
export const pageRevisionParamSchema = z.object({
  id: z.string().cuid("Invalid Page context ID template mapping"),
  revisionId: z.string().cuid("Invalid cryptographic targeted Revision snapshot identity format")
});