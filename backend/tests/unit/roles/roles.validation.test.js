import { describe, it, expect } from "vitest";
import {
  createFunctionalRoleSchema,
  updateFunctionalRoleSchema,
  roleIdParamSchema,
} from "../../../src/modules/roles/roles.validation.js";

// Valid CUID fixtures for testing
const VALID_CUID_1 = "clk2a6x90000008l43m9c5q5u";
const VALID_CUID_2 = "clk2a6x90000008l43m9c5q5v";

describe("Roles Validation Schemas", () => {
  describe("createFunctionalRoleSchema", () => {
    it("TC-01: should succeed with valid role name and description", () => {
      const result = createFunctionalRoleSchema.safeParse({
        name: "Admin",
        description: "Administrator role",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Admin");
        expect(result.data.description).toBe("Administrator role");
      }
    });

    it("TC-02 & TC-03: should trim name and fail if length is less than 2 after trimming", () => {
      const resultValid = createFunctionalRoleSchema.safeParse({ name: "  Manager  " });
      expect(resultValid.success).toBe(true);
      expect(resultValid.data.name).toBe("Manager"); // Trimmed

      const resultInvalid = createFunctionalRoleSchema.safeParse({ name: " A " });
      expect(resultInvalid.success).toBe(false); // Trimmed to "A", length 1 (fails min 2)
    });

    it.each([
      ["A".repeat(50), true],  // TC-04: Exactly 50 characters
      ["A".repeat(51), false], // TC-05: 51 characters
    ])("TC-04 & TC-05: should validate name length limits (50 chars max)", (name, expectedSuccess) => {
      const result = createFunctionalRoleSchema.safeParse({ name });
      expect(result.success).toBe(expectedSuccess);
    });

    it.each([
      [undefined, true],       // TC-06: Description omitted
      [null, true],            // TC-06: Description is null
      ["A".repeat(300), true], // TC-07: Description exactly 300 characters
      ["A".repeat(301), false] // TC-08: Description 301 characters
    ])("TC-06, TC-07, TC-08: should validate description rules", (description, expectedSuccess) => {
      const payload = description !== undefined ? { name: "Role", description } : { name: "Role" };
      const result = createFunctionalRoleSchema.safeParse(payload);
      expect(result.success).toBe(expectedSuccess);
    });

    it("TC-09: should default permissionIds to an empty array when omitted", () => {
      const result = createFunctionalRoleSchema.safeParse({ name: "Editor" });
      expect(result.success).toBe(true);
      expect(result.data.permissionIds).toEqual([]);
    });

    it("TC-10: should succeed when permissionIds contains valid CUIDs", () => {
      const result = createFunctionalRoleSchema.safeParse({
        name: "Editor",
        permissionIds: [VALID_CUID_1, VALID_CUID_2],
      });
      expect(result.success).toBe(true);
    });

    it("TC-11: should fail if a permission ID has an invalid format", () => {
      const result = createFunctionalRoleSchema.safeParse({
        name: "Editor",
        permissionIds: ["invalid_format", VALID_CUID_1],
      });
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe("Invalid permission ID format");
    });

    it("TC-12: should fail if permission IDs contain duplicates", () => {
      const result = createFunctionalRoleSchema.safeParse({
        name: "Editor",
        permissionIds: [VALID_CUID_1, VALID_CUID_1],
      });
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe("Duplicate permissions are not allowed");
    });

    it("TC-13: should strip unsupported fields from the parsed output", () => {
      const result = createFunctionalRoleSchema.safeParse({
        name: "Manager",
        unknownField: "malicious_data",
      });
      expect(result.success).toBe(true);
      expect(result.data).not.toHaveProperty("unknownField");
    });
  });

  describe("updateFunctionalRoleSchema", () => {
    it.each([
      [{ name: "Updated Name" }, true],                           // TC-14: Only name supplied
      [{ description: "Updated Description" }, true],             // TC-15: Only description supplied
      [{ permissionIds: [VALID_CUID_1] }, true],                  // TC-16: Only permissionIds supplied
    ])("TC-14, TC-15, TC-16: should succeed with valid partial updates", (payload, expectedSuccess) => {
      const result = updateFunctionalRoleSchema.safeParse(payload);
      expect(result.success).toBe(expectedSuccess);
    });

    it("TC-17 & TC-18: should enforce constraints on partially updated fields", () => {
      // TC-17: Name too short
      const shortNameResult = updateFunctionalRoleSchema.safeParse({ name: "A" });
      expect(shortNameResult.success).toBe(false);

      // TC-18: Duplicate permission IDs
      const duplicatePermResult = updateFunctionalRoleSchema.safeParse({
        permissionIds: [VALID_CUID_1, VALID_CUID_1],
      });
      expect(duplicatePermResult.success).toBe(false);
    });

    it("TC-19: should not add permissionIds: [] when omitted from an update payload", () => {
      const result = updateFunctionalRoleSchema.safeParse({ description: "Updating description only" });
      expect(result.success).toBe(true);
      expect(result.data).not.toHaveProperty("permissionIds");
    });

    it("TC-20: should strip unsupported fields from the partial schema output", () => {
      const result = updateFunctionalRoleSchema.safeParse({
        name: "Manager",
        unsupported: "should_be_removed",
      });
      expect(result.success).toBe(true);
      expect(result.data).not.toHaveProperty("unsupported");
    });
  });

  describe("roleIdParamSchema", () => {
    it("TC-21: should succeed with a valid CUID string", () => {
      const result = roleIdParamSchema.safeParse({ id: VALID_CUID_1 });
      expect(result.success).toBe(true);
    });

    it.each([
      [{ id: "invalid_id_format" }], // TC-22: Invalid format
      [{}],                          // TC-23: Missing ID
      [{ id: "" }],                  // TC-24: Empty string
    ])("TC-22, TC-23, TC-24: should fail for invalid, missing, or empty ID params", (payload) => {
      const result = roleIdParamSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });
});