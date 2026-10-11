import { describe, it, expect, vi, beforeEach } from "vitest";
import * as repo from "../../../src/modules/roles/roles.repository.js";
import { prisma } from "../../../src/config/db.js";

// Mocking Prisma
vi.mock("../../../src/config/db.js", () => ({
  prisma: {
    functionalRole: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
    },
    permission: {
      findMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

const createMockTransaction = () => ({
  functionalRole: {
    create: vi.fn(),
    update: vi.fn(),
  },
  functionalRolePermission: {
    createMany: vi.fn(),
    deleteMany: vi.fn(),
  },
});

describe("Roles Repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findRoleByNameOrSlug()", () => {
    it("RR-01: should search with the correct Prisma query and return the role", async () => {
      const mockRole = { id: "role_1", name: "manager" };
      prisma.functionalRole.findFirst.mockResolvedValue(mockRole);

      const result = await repo.findRoleByNameOrSlug("manager");

      expect(prisma.functionalRole.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [{ name: "manager" }, { slug: "manager" }],
        },
      });
      expect(result).toEqual(mockRole);
    });

    it("RR-02: should return null when no matching role is found", async () => {
      prisma.functionalRole.findFirst.mockResolvedValue(null);
      const result = await repo.findRoleByNameOrSlug("non_existent");
      expect(result).toBeNull();
    });
  });

  describe("createRoleWithPermissions()", () => {
    it("RR-03: should create a role without permissions when array is empty", async () => {
      const tx = createMockTransaction();
      prisma.$transaction.mockImplementation(async (callback) => callback(tx));

      const mockRole = { id: "role_1", name: "Admin", slug: "admin" };
      tx.functionalRole.create.mockResolvedValue(mockRole);

      const payload = { name: "Admin", slug: "admin", description: "Admin desc" };
      const result = await repo.createRoleWithPermissions(payload, []);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(tx.functionalRole.create).toHaveBeenCalledWith({ data: payload });
      expect(tx.functionalRolePermission.createMany).not.toHaveBeenCalled();
      expect(result).toEqual(mockRole);
    });

    it("RR-04: should create a role with multiple permission mappings", async () => {
      const tx = createMockTransaction();
      prisma.$transaction.mockImplementation(async (callback) => callback(tx));

      const mockRole = { id: "role_1", name: "Admin", slug: "admin" };
      tx.functionalRole.create.mockResolvedValue(mockRole);

      const payload = { name: "Admin", slug: "admin", description: "Admin desc" };
      const permissionIds = ["perm_1", "perm_2"];

      const result = await repo.createRoleWithPermissions(payload, permissionIds);

      expect(tx.functionalRolePermission.createMany).toHaveBeenCalledWith({
        data: [
          { functionalRoleId: "role_1", permissionId: "perm_1" },
          { functionalRoleId: "role_1", permissionId: "perm_2" },
        ],
      });
      expect(result).toEqual(mockRole);
    });

    it("RR-05: should propagate error if role creation fails and halt mapping", async () => {
      const tx = createMockTransaction();
      prisma.$transaction.mockImplementation(async (callback) => callback(tx));

      const error = new Error("Creation failed");
      tx.functionalRole.create.mockRejectedValue(error);

      await expect(repo.createRoleWithPermissions({}, ["perm_1"])).rejects.toThrow(error);
      expect(tx.functionalRolePermission.createMany).not.toHaveBeenCalled();
    });

    it("RR-06: should propagate error if permission mapping creation fails", async () => {
      const tx = createMockTransaction();
      prisma.$transaction.mockImplementation(async (callback) => callback(tx));

      tx.functionalRole.create.mockResolvedValue({ id: "role_1" });
      const error = new Error("Mapping failed");
      tx.functionalRolePermission.createMany.mockRejectedValue(error);

      await expect(repo.createRoleWithPermissions({}, ["perm_1"])).rejects.toThrow(error);
    });
  });

  describe("updateRoleWithPermissions()", () => {
    it("RR-07 & RR-08: should update role data and preserve permissions when undefined", async () => {
      const tx = createMockTransaction();
      prisma.$transaction.mockImplementation(async (callback) => callback(tx));

      const mockRole = { id: "role_1", name: "New Name" };
      tx.functionalRole.update.mockResolvedValue(mockRole);

      const payload = { name: "New Name", slug: "new-name", description: "Desc" };
      const result = await repo.updateRoleWithPermissions("role_1", payload, undefined);

      expect(tx.functionalRole.update).toHaveBeenCalledWith({
        where: { id: "role_1" },
        data: payload,
      });
      expect(tx.functionalRolePermission.deleteMany).not.toHaveBeenCalled();
      expect(tx.functionalRolePermission.createMany).not.toHaveBeenCalled();
      expect(result).toEqual(mockRole);
    });

    it("RR-09: should clear permissions when permissionIds is an empty array", async () => {
      const tx = createMockTransaction();
      prisma.$transaction.mockImplementation(async (callback) => callback(tx));

      tx.functionalRole.update.mockResolvedValue({ id: "role_1" });

      await repo.updateRoleWithPermissions("role_1", {}, []);

      expect(tx.functionalRolePermission.deleteMany).toHaveBeenCalledWith({
        where: { functionalRoleId: "role_1" },
      });
      expect(tx.functionalRolePermission.createMany).not.toHaveBeenCalled();
    });

    it("RR-10: should replace permissions with a non-empty array in correct order", async () => {
      const tx = createMockTransaction();
      prisma.$transaction.mockImplementation(async (callback) => callback(tx));

      tx.functionalRole.update.mockResolvedValue({ id: "role_1" });

      await repo.updateRoleWithPermissions("role_1", {}, ["perm_1", "perm_2"]);

      expect(tx.functionalRolePermission.deleteMany).toHaveBeenCalledWith({
        where: { functionalRoleId: "role_1" },
      });
      expect(tx.functionalRolePermission.createMany).toHaveBeenCalledWith({
        data: [
          { functionalRoleId: "role_1", permissionId: "perm_1" },
          { functionalRoleId: "role_1", permissionId: "perm_2" },
        ],
      });

      // Verify invocation order: deleteMany happens before createMany
      const deleteOrder = tx.functionalRolePermission.deleteMany.mock.invocationCallOrder[0];
      const createOrder = tx.functionalRolePermission.createMany.mock.invocationCallOrder[0];
      expect(deleteOrder).toBeLessThan(createOrder);
    });

    it("RR-11: should propagate error if mapping fails during update", async () => {
      const tx = createMockTransaction();
      prisma.$transaction.mockImplementation(async (callback) => callback(tx));

      tx.functionalRole.update.mockResolvedValue({ id: "role_1" });
      const error = new Error("Update mapping failed");
      tx.functionalRolePermission.createMany.mockRejectedValue(error);

      await expect(repo.updateRoleWithPermissions("role_1", {}, ["perm_1"])).rejects.toThrow(error);
    });
  });

  describe("findRoleById()", () => {
    it("RR-12: should retrieve role with required relations", async () => {
      const mockRole = { id: "role_1", _count: { users: 5 } };
      prisma.functionalRole.findUnique.mockResolvedValue(mockRole);

      const result = await repo.findRoleById("role_1");

      expect(prisma.functionalRole.findUnique).toHaveBeenCalledWith({
        where: { id: "role_1" },
        include: {
          permissions: { select: { permissionId: true } },
          _count: { select: { users: true } },
        },
      });
      expect(result).toEqual(mockRole);
    });

    it("RR-13: should return null if role is not found", async () => {
      prisma.functionalRole.findUnique.mockResolvedValue(null);
      const result = await repo.findRoleById("non_existent");
      expect(result).toBeNull();
    });
  });

  describe("deleteRoleById()", () => {
    it("RR-14: should delete using correct role ID", async () => {
      prisma.functionalRole.delete.mockResolvedValue({ id: "role_1" });

      await repo.deleteRoleById("role_1");

      expect(prisma.functionalRole.delete).toHaveBeenCalledWith({
        where: { id: "role_1" },
      });
    });
  });

  describe("getAllRolesWithCounts()", () => {
    it("RR-15: should list roles ordered by createdAt with user counts", async () => {
      const mockRoles = [{ id: "role_1" }];
      prisma.functionalRole.findMany.mockResolvedValue(mockRoles);

      const result = await repo.getAllRolesWithCounts();

      expect(prisma.functionalRole.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { users: true } },
        },
      });
      expect(result).toEqual(mockRoles);
    });
  });

  describe("getAllGroupedPermissions()", () => {
    it("RR-16: should group permissions correctly by module", async () => {
      const rawPermissions = [
        { id: "perm_1", module: "USERS" },
        { id: "perm_2", module: "USERS" },
        { id: "perm_3", module: "PRODUCTS" },
      ];
      prisma.permission.findMany.mockResolvedValue(rawPermissions);

      const result = await repo.getAllGroupedPermissions();

      expect(prisma.permission.findMany).toHaveBeenCalledWith({
        orderBy: { module: "asc" },
      });
      expect(result).toEqual({
        USERS: [
          { id: "perm_1", module: "USERS" },
          { id: "perm_2", module: "USERS" },
        ],
        PRODUCTS: [{ id: "perm_3", module: "PRODUCTS" }],
      });
    });

    it("RR-17: should return an empty object if no permissions exist", async () => {
      prisma.permission.findMany.mockResolvedValue([]);
      const result = await repo.getAllGroupedPermissions();
      expect(result).toEqual({});
    });
  });
});