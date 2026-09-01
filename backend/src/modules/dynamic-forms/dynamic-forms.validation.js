import { z } from "zod";
import { FieldRegistry } from "./fields/registry.js";

// Validate individual field configuration
const fieldDefinitionSchema = z.object({
  id: z.string().min(1, "Field ID is required"),
  key: z.string().regex(/^[a-zA-Z0-9_]+$/, "Keys can only contain letters, numbers, and underscores"),
  type: z.string().refine((type) => FieldRegistry.isSupported(type), {
    message: "Unsupported field type selected.",
  }),
  label: z.string().min(1, "Field label is required"),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  // Catchall for properties like minLength, options, etc.
}).catchall(z.any());

// Validate the schema array and ensure keys are unique
const formSchemaJson = z.object({
  version: z.number().default(1),
  fields: z.array(fieldDefinitionSchema).refine((fields) => {
    const keys = fields.map(f => f.key);
    return new Set(keys).size === keys.length;
  }, { message: "Field keys must be completely unique within the form." })
});

// Validate the settings JSON
const formSettingsJson = z.object({
  submitButton: z.object({
    text: z.string().default("Submit"),
    processingText: z.string().default("Please wait...")
  }).default({}),
  successAction: z.object({
    type: z.enum(["message", "redirect"]).default("message"),
    message: z.string().default("Thank you! Your submission has been received."),
    redirectUrl: z.string().optional()
  }).default({})
}).catchall(z.any());

export const updateSubmissionStatusSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "SPAM"], {
    errorMap: () => ({ message: "Invalid submission status" })
  })
}).strict();

// Main wrapper schema for creating/updating a form
export const saveDynamicFormSchema = z.object({
  title: z.string().trim().min(2, "Form title is required").max(150),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  schema: formSchemaJson,
  settings: formSettingsJson
}).strict();