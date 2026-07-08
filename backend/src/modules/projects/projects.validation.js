import { z } from "zod";

const PROJECT_STATUS = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export const createProjectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(150),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and dashes").optional(),
  category: z.string().min(1, "Category is required"),
  year: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  details: z.string().optional().nullable(),
  client: z.string().optional().nullable(),
  area: z.string().optional().nullable(),
  
  featuredImageId: z.union([
    z.string().min(5, "Invalid Image ID"), 
    z.literal("")
  ])
  .optional()
  .nullable()
  .transform(val => val === "" ? null : val),

  metaTitle: z.string().max(100).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  status: z.enum(PROJECT_STATUS).default("PUBLISHED").optional(),
  bulletPoints: z.array(z.string()).optional().nullable(),
  spaces: z.array(z.object({ size: z.string(), label: z.string() })).optional().nullable(),
}).strict();

export const updateProjectSchema = createProjectSchema.partial();

export const projectQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  status: z.enum(PROJECT_STATUS).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "title", "year"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const projectIdParamSchema = z.object({
  id: z.string().min(5, "Invalid Project ID"),
});

export const projectSlugParamSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});