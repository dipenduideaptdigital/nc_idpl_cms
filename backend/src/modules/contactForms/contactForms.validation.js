import { z } from "zod";

export const createContactFormSchema = z.object({
  name: z.string().trim().min(2, "Form name metadata requires at least 2 characters").max(100),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/, "Slug pattern configurations are restricted exclusively to alphanumeric values and dashes").max(100).optional(),
  successMessage: z.string().trim().max(500).optional().nullable(),
  redirectUrl: z.string().trim().max(500).refine((path) => !path || path.startsWith("/") || path.startsWith("http"), {
    message: "Redirect navigation target target routing logic tracking paths must be a valid structure path layer context string pointer."
  }).optional().nullable(),
  notifyEmails: z.array(z.string().email("Array data trace allocations parameters require strict RFC compliant string layouts")).default([]).optional(),
  isActive: z.boolean().default(true).optional()
}).strict();

export const updateContactFormSchema = createContactFormSchema.partial();

export const formParamSchema = z.object({
  id: z.string().cuid("Invalid operational engine key parameter target validation block reference trace profile setup rules token checking")
});