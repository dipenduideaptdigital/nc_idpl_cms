import { describe, it, expect, vi, beforeEach } from "vitest";
import * as rolesService from "../../../src/modules/roles/roles.service.js";
import * as repo from "../../../src/modules/roles/roles.repository.js";
import { prisma } from "../../../src/config/db.js";
import { AppError } from "../../../src/shared/errors/AppError.js";

// Mocking dependencies
vi.mock("../../../src/modules/roles/roles.repository.js");
vi.mock("../../../src/config/db.js", () => ({
  prisma: {
    permission: {
      count: vi.fn(),
    },
  },
}));

describe("Roles Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createRole()", () => {
    it("TC-01 & TC-03: should successfully create a role with valid permission IDs", async () => {
      repo.findRoleByNameOrSlug.mockResolvedValue(null);
      prisma.permission.count.mockResolvedValue(2); // 2 valid IDs provided
      repo.createRoleWithPermissions.mockResolvedValue({ id: "role_1", name: "Manager", slug: "manager" });

      const payload = { name: "Manager", description: "Manager Role", permissionIds: ["perm_1", "perm_2"] };
      const result = await rolesService.createRole(payload);

      expect(repo.findRoleByNameOrSlug).toHaveBeenCalledWith("manager");
      expect(prisma.permission.count).toHaveBeenCalledWith({ where: { id: { in: ["perm_1", "perm_2"] } } });
      expect(repo.createRoleWithPermissions).toHaveBeenCalledWith(
        { name: "Manager", slug: "manager", description: "Manager Role" },
        ["perm_1", "perm_2"]
      );
      expect(result.id).toBe("role_1");
    });

    it("TC-02: should throw 409 Conflict if a duplicate role exists", async () => {
      repo.findRoleByNameOrSlug.mockResolvedValue({ id: "existing_role" });

      const payload = { name: "Admin" };
      await expect(rolesService.createRole(payload)).rejects.toThrow(AppError);
      expect(prisma.permission.count).not.toHaveBeenCalled();
      expect(repo.createRoleWithPermissions).not.toHaveBeenCalled();
    });

    it("TC-04: should throw 400 Bad Request if one or more permission IDs are invalid", async () => {
      repo.findRoleByNameOrSlug.mockResolvedValue(null);
      prisma.permission.count.mockResolvedValue(1); // Provided 2, but only 1 found

      const payload = { name: "Editor", permissionIds: ["valid_perm", "invalid_perm"] };
      await expect(rolesService.createRole(payload)).rejects.toThrow(AppError);
      expect(repo.createRoleWithPermissions).not.toHaveBeenCalled();
    });

    it("TC-05: should create a role without permissions if permissionIds is omitted or empty", async () => {
      repo.findRoleByNameOrSlug.mockResolvedValue(null);
      repo.createRoleWithPermissions.mockResolvedValue({ id: "role_2" });

      await rolesService.createRole({ name: "Viewer" });

      expect(prisma.permission.count).not.toHaveBeenCalled();
      expect(repo.createRoleWithPermissions).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Viewer" }),
        []
      );
    });

    it("TC-06: should propagate repository failure during creation", async () => {
      repo.findRoleByNameOrSlug.mockResolvedValue(null);
      repo.createRoleWithPermissions.mockRejectedValue(new Error("Database connection error"));

      await expect(rolesService.createRole({ name: "Tester" })).rejects.toThrow("Database connection error");
    });
  });

  describe("updateRole()", () => {
    it("TC-07: should throw 404 if role does not exist", async () => {
      repo.findRoleById.mockResolvedValue(null);
      await expect(rolesService.updateRole("invalid_id", { name: "New Name" })).rejects.toThrow(AppError);
      expect(repo.updateRoleWithPermissions).not.toHaveBeenCalled();
    });

    it("TC-08: should update description without changing name and preserve existing slug", async () => {
      repo.findRoleById.mockResolvedValue({ id: "role_1", name: "Editor", slug: "editor" });
      repo.updateRoleWithPermissions.mockResolvedValue({ id: "role_1" });

      await rolesService.updateRole("role_1", { description: "Updated description" });

      expect(repo.findRoleByNameOrSlug).not.toHaveBeenCalled(); // No duplicate check needed
      expect(repo.updateRoleWithPermissions).toHaveBeenCalledWith(
        "role_1",
        expect.objectContaining({ slug: "editor", description: "Updated description" }),
        undefined
      );
    });

    it("TC-09 & TC-11: should rename successfully if slug is unique or belongs to the same role", async () => {
      repo.findRoleById.mockResolvedValue({ id: "role_1", name: "Old Name", slug: "old-name" });
      repo.findRoleByNameOrSlug.mockResolvedValue({ id: "role_1" }); // Matches current role (TC-11)
      repo.updateRoleWithPermissions.mockResolvedValue({ id: "role_1" });

      await rolesService.updateRole("role_1", { name: "New Name" });

      expect(repo.findRoleByNameOrSlug).toHaveBeenCalledWith("new-name");
      expect(repo.updateRoleWithPermissions).toHaveBeenCalledWith(
        "role_1",
        expect.objectContaining({ name: "New Name", slug: "new-name" }),
        undefined
      );
    });

    it("TC-10: should throw 409 if new name conflicts with another role", async () => {
      repo.findRoleById.mockResolvedValue({ id: "role_1", name: "Old", slug: "old" });
      repo.findRoleByNameOrSlug.mockResolvedValue({ id: "role_2" }); // Belongs to a different role

      await expect(rolesService.updateRole("role_1", { name: "Conflicting Name" })).rejects.toThrow(AppError);
      expect(repo.updateRoleWithPermissions).not.toHaveBeenCalled();
    });

    it("TC-12: should replace permissions with valid IDs", async () => {
      repo.findRoleById.mockResolvedValue({ id: "role_1", name: "Editor", slug: "editor" });
      prisma.permission.count.mockResolvedValue(1); // 1 valid ID provided

      await rolesService.updateRole("role_1", { permissionIds: ["perm_1"] });

      expect(prisma.permission.count).toHaveBeenCalledWith({ where: { id: { in: ["perm_1"] } } });
      expect(repo.updateRoleWithPermissions).toHaveBeenCalledWith("role_1", expect.any(Object), ["perm_1"]);
    });

    it("TC-13: should throw 400 Bad Request for invalid permission IDs during update", async () => {
      repo.findRoleById.mockResolvedValue({ id: "role_1", name: "Editor", slug: "editor" });
      prisma.permission.count.mockResolvedValue(0); // IDs not found

      await expect(rolesService.updateRole("role_1", { permissionIds: ["invalid_id"] })).rejects.toThrow(AppError);
      expect(repo.updateRoleWithPermissions).not.toHaveBeenCalled();
    });

    it("TC-14: should preserve permissions when permissionIds is omitted", async () => {
      repo.findRoleById.mockResolvedValue({ id: "role_1", name: "Editor", slug: "editor" });

      await rolesService.updateRole("role_1", { description: "No perm change" });

      expect(prisma.permission.count).not.toHaveBeenCalled();
      expect(repo.updateRoleWithPermissions).toHaveBeenCalledWith("role_1", expect.any(Object), undefined);
    });

    it("TC-15: should clear permissions when explicitly passed an empty array", async () => {
      repo.findRoleById.mockResolvedValue({ id: "role_1", name: "Editor", slug: "editor" });

      await rolesService.updateRole("role_1", { permissionIds: [] });

      expect(prisma.permission.count).not.toHaveBeenCalled();
      expect(repo.updateRoleWithPermissions).toHaveBeenCalledWith("role_1", expect.any(Object), []);
    });
  });

  describe("deleteRole()", () => {
    it("TC-16: should throw 404 if role does not exist", async () => {
      repo.findRoleById.mockResolvedValue(null);
      await expect(rolesService.deleteRole("invalid_id")).rejects.toThrow(AppError);
      expect(repo.deleteRoleById).not.toHaveBeenCalled();
    });

    it("TC-17: should throw 409 if role has assigned users", async () => {
      repo.findRoleById.mockResolvedValue({ id: "role_1", _count: { users: 2 } });
      await expect(rolesService.deleteRole("role_1")).rejects.toThrow(AppError);
      expect(repo.deleteRoleById).not.toHaveBeenCalled();
    });

    it("TC-18: should delete unassigned role successfully", async () => {
      repo.findRoleById.mockResolvedValue({ id: "role_1", _count: { users: 0 } });
      repo.deleteRoleById.mockResolvedValue({ message: "Deleted" });

      await rolesService.deleteRole("role_1");

      expect(repo.deleteRoleById).toHaveBeenCalledWith("role_1");
    });
  });

  describe("getRoleDetails()", () => {
    it("TC-19: should return flattened role permissions", async () => {
      repo.findRoleById.mockResolvedValue({
        id: "role_1",
        permissions: [{ permissionId: "perm_1" }, { permissionId: "perm_2" }],
      });

      const result = await rolesService.getRoleDetails("role_1");
      expect(result.permissions).toEqual(["perm_1", "perm_2"]);
    });

    it("TC-20: should throw 404 if role details are missing", async () => {
      repo.findRoleById.mockResolvedValue(null);
      await expect(rolesService.getRoleDetails("invalid_id")).rejects.toThrow(AppError);
    });

    it("TC-21: should return empty permission list if role has no permissions", async () => {
      repo.findRoleById.mockResolvedValue({ id: "role_2", permissions: [] });
      const result = await rolesService.getRoleDetails("role_2");
      expect(result.permissions).toEqual([]);
    });
  });

  describe("getAllRoles() & getSystemPermissions()", () => {
    it("TC-22: should delegate getAllRoles to repository", async () => {
      const mockRoles = [{ id: "role_1" }];
      repo.getAllRolesWithCounts.mockResolvedValue(mockRoles);

      const result = await rolesService.getAllRoles();
      expect(repo.getAllRolesWithCounts).toHaveBeenCalled();
      expect(result).toEqual(mockRoles);
    });

    it("TC-23: should delegate getSystemPermissions to repository", async () => {
      const mockPermissions = { USERS: [{ id: "perm_1" }] };
      repo.getAllGroupedPermissions.mockResolvedValue(mockPermissions);

      const result = await rolesService.getSystemPermissions();
      expect(repo.getAllGroupedPermissions).toHaveBeenCalled();
      expect(result).toEqual(mockPermissions);
    });
  });
});