import { z } from "zod";

export const createFunctionalRoleSchema = z.object({
  name: z.string().trim().min(2, "Role name must be at least 2 characters").max(50),
  description: z.string().trim().max(300).optional().nullable(),
  permissionIds: z.array(z.string().cuid("Invalid permission ID format"))
    .default([])
    .refine(
      (arr) => new Set(arr).size === arr.length,
      "Duplicate permissions are not allowed"
    )
});

export const updateFunctionalRoleSchema = createFunctionalRoleSchema.partial();

export const roleIdParamSchema = z.object({
  id: z.string().cuid("Invalid role ID")
});