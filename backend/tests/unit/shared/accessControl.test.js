import { describe, it, expect } from "vitest";
import { canManageUser, canAssignRole } from "../../../src/shared/utils/accessControl.js";

describe("Access Control Utilities", () => {
  describe("canManageUser()", () => {
    it("should return false if target is SUPER_ADMIN", () => {
      // No one modifies SUPER_ADMIN
      expect(canManageUser("SUPER_ADMIN", "SUPER_ADMIN")).toBe(false);
      expect(canManageUser("ADMIN", "SUPER_ADMIN")).toBe(false);
    });

    it("should return false if ADMIN tries to manage ADMIN", () => {
      // ADMIN cannot modify ADMIN
      expect(canManageUser("ADMIN", "ADMIN")).toBe(false);
    });

    it("should return true for valid management combinations", () => {
      // SUPER_ADMIN can modify ADMIN/USER, ADMIN can modify USER
      expect(canManageUser("SUPER_ADMIN", "ADMIN")).toBe(true);
      expect(canManageUser("SUPER_ADMIN", "USER")).toBe(true);
      expect(canManageUser("ADMIN", "USER")).toBe(true);
      
      // Edge case based on current function logic
      expect(canManageUser("USER", "USER")).toBe(true); 
    });
  });

  describe("canAssignRole()", () => {
    it("should return false if trying to assign SUPER_ADMIN role dynamically", () => {
      // No one assigns SUPER_ADMIN dynamically
      expect(canAssignRole("SUPER_ADMIN", "SUPER_ADMIN")).toBe(false);
      expect(canAssignRole("ADMIN", "SUPER_ADMIN")).toBe(false);
    });

    it("should return false if actor is not SUPER_ADMIN", () => {
      // Only SUPER_ADMIN can change roles
      expect(canAssignRole("ADMIN", "ADMIN")).toBe(false);
      expect(canAssignRole("ADMIN", "USER")).toBe(false);
      expect(canAssignRole("USER", "USER")).toBe(false);
    });

    it("should return true when SUPER_ADMIN assigns ADMIN or USER roles", () => {
      // SUPER_ADMIN successfully assigning allowed roles
      expect(canAssignRole("SUPER_ADMIN", "ADMIN")).toBe(true);
      expect(canAssignRole("SUPER_ADMIN", "USER")).toBe(true);
    });
  });
});