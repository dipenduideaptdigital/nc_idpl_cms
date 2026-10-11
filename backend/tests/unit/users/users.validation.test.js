import { describe, it, expect } from "vitest";
import {
  updateProfileSchema,
  userIdParamSchema,
  updateUserStatusSchema,
  updateSystemRoleSchema,
  assignFunctionalRolesSchema,
  inviteAdminSchema,
  userQuerySchema,
} from "../../../src/modules/users/users.validation.js";

// CUID for testing validation
const VALID_CUID = "clk1234567890abcdefghijklm";
const VALID_CUID_2 = "clk0987654321zyxwvutsrqpo";

describe("Users Validation Schemas", () => {
  describe("updateProfileSchema", () => {
    it("should accept valid name and avatar", () => {
      const result = updateProfileSchema.safeParse({ name: "John Doe", avatar: "https://example.com/avatar.jpg" });
      expect(result.success).toBe(true);
    });

    it("should reject if no fields are provided (empty object)", () => {
      const result = updateProfileSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it("should reject extra/unknown fields due to strict mode", () => {
      const result = updateProfileSchema.safeParse({ name: "John Doe", role: "ADMIN" });
      expect(result.success).toBe(false);
    });

    it("should trim and normalize name", () => {
      const result = updateProfileSchema.safeParse({ name: "  Jane Doe  ", avatar: "" });
      expect(result.success).toBe(true);
      expect(result.data.name).toBe("Jane Doe");
    });

    it("should reject name shorter than 2 or longer than 100 characters", () => {
      expect(updateProfileSchema.safeParse({ name: "A" }).success).toBe(false);
      expect(updateProfileSchema.safeParse({ name: "A".repeat(101) }).success).toBe(false);
    });

    it("should accept HTTP and HTTPS URLs for avatar", () => {
      expect(updateProfileSchema.safeParse({ avatar: "http://example.com/a.jpg" }).success).toBe(true);
      expect(updateProfileSchema.safeParse({ avatar: "https://example.com/a.jpg" }).success).toBe(true);
    });

    it("should transform empty string avatar to null", () => {
      const result = updateProfileSchema.safeParse({ avatar: "" });
      expect(result.success).toBe(true);
      expect(result.data.avatar).toBeNull();
    });

    it("should reject non-HTTP/HTTPS URLs for avatar", () => {
      const result = updateProfileSchema.safeParse({ avatar: "ftp://example.com/file.jpg" });
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe("Avatar must be a valid HTTP or HTTPS URL");
    });

    it("should reject invalid URL strings for avatar", () => {
      expect(updateProfileSchema.safeParse({ avatar: "not-a-url" }).success).toBe(false);
    });

    it("should reject avatar exceeding 2000 characters", () => {
      const longUrl = `https://example.com/${"a".repeat(2000)}.jpg`;
      expect(updateProfileSchema.safeParse({ avatar: longUrl }).success).toBe(false);
    });
  });

  describe("userIdParamSchema", () => {
    it("should accept a valid CUID", () => {
      expect(userIdParamSchema.safeParse({ id: VALID_CUID }).success).toBe(true);
    });

    it("should reject invalid ID format", () => {
      const result = userIdParamSchema.safeParse({ id: "invalid-id-123" });
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe("Invalid user ID format");
    });
  });

  describe("updateUserStatusSchema", () => {
    it("should accept valid status values", () => {
      expect(updateUserStatusSchema.safeParse({ status: "ACTIVE" }).success).toBe(true);
      expect(updateUserStatusSchema.safeParse({ status: "INACTIVE" }).success).toBe(true);
      expect(updateUserStatusSchema.safeParse({ status: "SUSPENDED" }).success).toBe(true);
      expect(updateUserStatusSchema.safeParse({ status: "PENDING" }).success).toBe(true);
    });

    it("should reject invalid status values", () => {
      const result = updateUserStatusSchema.safeParse({ status: "UNKNOWN_STATUS" });
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain("Invalid");
    });
  });

  describe("updateSystemRoleSchema", () => {
    it("should accept valid system roles", () => {
      expect(updateSystemRoleSchema.safeParse({ systemRoleSlug: "USER" }).success).toBe(true);
      expect(updateSystemRoleSchema.safeParse({ systemRoleSlug: "ADMIN" }).success).toBe(true);
      expect(updateSystemRoleSchema.safeParse({ systemRoleSlug: "SUPER_ADMIN" }).success).toBe(true);
    });

    it("should reject invalid system roles", () => {
      const result = updateSystemRoleSchema.safeParse({ systemRoleSlug: "GUEST" });
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain("Invalid");
    });
  });

  describe("assignFunctionalRolesSchema", () => {
    it("should accept valid array of CUIDs", () => {
      expect(assignFunctionalRolesSchema.safeParse({ functionalRoleIds: [VALID_CUID, VALID_CUID_2] }).success).toBe(true);
    });

    it("should default to an empty array if not provided", () => {
      const result = assignFunctionalRolesSchema.safeParse({});
      expect(result.success).toBe(true);
      expect(result.data.functionalRoleIds).toEqual([]);
    });

    it("should reject duplicate role IDs", () => {
      const result = assignFunctionalRolesSchema.safeParse({ functionalRoleIds: [VALID_CUID, VALID_CUID] });
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe("Duplicate roles are not allowed");
    });

    it("should reject invalid CUIDs in array", () => {
      const result = assignFunctionalRolesSchema.safeParse({ functionalRoleIds: [VALID_CUID, "invalid-123"] });
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe("Invalid role ID format");
    });
  });

  describe("inviteAdminSchema", () => {
    it("should accept valid invitation payload and apply defaults", () => {
      const result = inviteAdminSchema.safeParse({
        name: "New Admin",
        email: "admin@example.com"
      });
      expect(result.success).toBe(true);
      expect(result.data.systemRoleSlug).toBe("ADMIN"); // Default
      expect(result.data.functionalRoleIds).toEqual([]); // Default
    });

    it("should reject if name is less than 2 characters", () => {
      expect(inviteAdminSchema.safeParse({ name: "A", email: "admin@example.com" }).success).toBe(false);
    });

    it("should reject invalid email format", () => {
      expect(inviteAdminSchema.safeParse({ name: "Admin", email: "not-an-email" }).success).toBe(false);
    });

    it("should reject invalid system role for invitation", () => {
      expect(inviteAdminSchema.safeParse({ 
        name: "Admin", 
        email: "admin@example.com", 
        systemRoleSlug: "USER" // Only ADMIN and SUPER_ADMIN allowed
      }).success).toBe(false);
    });

    it("should reject invalid functional role ID", () => {
      expect(inviteAdminSchema.safeParse({ 
        name: "Admin", 
        email: "admin@example.com", 
        functionalRoleIds: ["invalid-id"] 
      }).success).toBe(false);
    });
  });

  describe("userQuerySchema", () => {
    it("should apply default pagination limits", () => {
      const result = userQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
    });

    it("should coerce string numbers to integers", () => {
      const result = userQuerySchema.safeParse({ page: "3", limit: "25" });
      expect(result.success).toBe(true);
      expect(result.data.page).toBe(3);
      expect(result.data.limit).toBe(25);
    });

    it("should reject page less than 1", () => {
      expect(userQuerySchema.safeParse({ page: 0 }).success).toBe(false);
    });

    it("should reject limit greater than 100", () => {
      expect(userQuerySchema.safeParse({ limit: 101 }).success).toBe(false);
    });

    it("should accept valid status and systemRole filters", () => {
      const result = userQuerySchema.safeParse({ status: "ACTIVE", systemRole: "ADMIN" });
      expect(result.success).toBe(true);
    });

    it("should reject invalid status or systemRole filters", () => {
      expect(userQuerySchema.safeParse({ status: "DELETED" }).success).toBe(false);
      expect(userQuerySchema.safeParse({ systemRole: "GUEST" }).success).toBe(false);
    });

    it("should trim search string", () => {
      const result = userQuerySchema.safeParse({ search: "  John Doe  " });
      expect(result.success).toBe(true);
      expect(result.data.search).toBe("John Doe");
    });
  });
});