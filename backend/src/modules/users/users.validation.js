import { z } from "zod";
import { normalizeString } from "../../shared/utils/normalizeString.js";

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .transform((val) => normalizeString(val))
      .pipe(z.string().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters"))
      .optional(),

    avatar: z
      .string()
      .trim()
      .max(2000)
      .optional()
      .transform((value) => (value === "" ? null : value))
      .refine(
        (value) => {
          if (value === null) {
            return true;
          }
          try {
            const parsed = new URL(value);
            return ["http:", "https:"].includes(parsed.protocol);
          } catch {
            return false;
          }
        },
        { message: "Avatar must be a valid HTTP or HTTPS URL" }
      ),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update",
  });

export const userIdParamSchema = z.object({
  id: z.string().cuid("Invalid user ID format"),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING"], {
    errorMap: () => ({ message: "Invalid status value" }),
  }),
});

export const updateSystemRoleSchema = z.object({
  systemRoleSlug: z.enum(["USER", "ADMIN", "SUPER_ADMIN"], {
    errorMap: () => ({ message: "Invalid system role slug." }),
  }),
});

export const assignFunctionalRolesSchema = z.object({
  functionalRoleIds: z.array(z.string().cuid("Invalid role ID format"))
    .default([])
    .refine((arr) => new Set(arr).size === arr.length, "Duplicate roles are not allowed")
});

// Admin Invitation Schema
export const inviteAdminSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Invalid corporate email format"),
  systemRoleSlug: z.enum(["ADMIN", "SUPER_ADMIN"]).default("ADMIN"),
  functionalRoleIds: z.array(z.string().cuid()).default([])
});

export const userQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING"]).optional(),
  systemRole: z.enum(["USER", "ADMIN", "SUPER_ADMIN"]).optional(),
});