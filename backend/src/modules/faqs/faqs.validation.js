import { z } from "zod";

const FAQ_STATUS = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export const createFaqCategorySchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(100),

  slug: z.string()
    .trim()
    .toLowerCase()
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Invalid slug format")
    .optional(),

  description: z.string().max(300).optional().nullable(),

  sortOrder: z.coerce.number()
    .int()
    .min(0)
    .max(2147483647)
    .default(0)
    .optional(),

  status: z.enum(FAQ_STATUS)
    .default("PUBLISHED")
    .optional(),
}).strict();

export const updateFaqCategorySchema =
  createFaqCategorySchema.partial();

export const createFaqQuestionSchema = z.object({
  categoryId: z.string().cuid("Invalid category ID format"),

  question: z.string()
    .trim()
    .min(5, "Question must be at least 5 characters")
    .max(300),

  answer: z.string()
    .trim()
    .min(1, "Answer is required")
    .max(100000),

  sortOrder: z.coerce.number()
    .int()
    .min(0)
    .max(2147483647)
    .default(0)
    .optional(),

  status: z.enum(FAQ_STATUS)
    .default("PUBLISHED")
    .optional(),
}).strict();

export const updateFaqQuestionSchema =
  createFaqQuestionSchema.partial();

export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().cuid(),
      sortOrder: z.number().int().min(0).max(2147483647),
    })
  )
    .min(1, "Items array cannot be empty")
    .max(500)
    .refine(
      items =>
        new Set(items.map(item => item.id)).size === items.length,
      "Duplicate IDs are not allowed"
    ),
}).strict();

export const faqParamSchema = z.object({
  id: z.string().cuid("Invalid ID format"),
});

export const questionQuerySchema = z.object({
  categoryId: z.string().cuid().optional(),
  status: z.enum(FAQ_STATUS).optional(),
  search: z.string().trim().max(300).optional(),
});

export const reorderQuerySchema = z.object({
  type: z.enum(["category", "question"]),
});