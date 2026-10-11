import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as adminService from "../../../src/modules/users/users.admin.service.js";
import { prisma } from "../../../src/config/db.js";
import { AppError } from "../../../src/shared/errors/AppError.js";
import { StatusCodes } from "http-status-codes";
import * as secureToken from "../../../src/shared/utils/secureToken.js";
import * as passwordUtils from "../../../src/shared/utils/password.js";
import * as emailService from "../../../src/shared/services/email.service.js";
import { logger } from "../../../src/config/logger.js";

// MOCKS 
vi.mock("../../../src/config/db.js", () => ({
  prisma: {
    user: { findUnique: vi.fn(), update: vi.fn(), count: vi.fn(), create: vi.fn(), findMany: vi.fn(), deleteMany: vi.fn() },
    refreshToken: { updateMany: vi.fn() },
    systemRole: { findUnique: vi.fn() },
    functionalRole: { count: vi.fn() },
    userFunctionalRole: { deleteMany: vi.fn(), createMany: vi.fn(), findMany: vi.fn() },
    adminInvitation: { deleteMany: vi.fn(), create: vi.fn(), findUnique: vi.fn() },
    blogRevision: { findMany: vi.fn() },
    $transaction: vi.fn(),
  }
}));

vi.mock("../../../src/shared/utils/secureToken.js");
vi.mock("../../../src/shared/utils/password.js");
vi.mock("../../../src/shared/services/email.service.js");
vi.mock("../../../src/config/logger.js", () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  }
}));

describe("Users Admin Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock Prisma Transaction Handler
    prisma.$transaction.mockImplementation(async (arg) => {
      if (Array.isArray(arg)) return Promise.all(arg);
      if (typeof arg === 'function') return await arg(prisma);
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // changeUserStatus
  describe("changeUserStatus()", () => {
    it("TC-1: should throw 403 if user tries to change their own status", async () => {
      await expect(adminService.changeUserStatus({ actorUserId: "u1", targetUserId: "u1", newStatus: "INACTIVE" }))
        .rejects.toThrowError(new AppError("You cannot modify your own status", StatusCodes.FORBIDDEN));
    });

    it("TC-2: should only update user (no token revoke) if newStatus is ACTIVE", async () => {
      prisma.user.update.mockResolvedValue({ id: "u2", status: "ACTIVE" });

      const result = await adminService.changeUserStatus({ actorUserId: "u1", targetUserId: "u2", newStatus: "ACTIVE" });

      expect(prisma.refreshToken.updateMany).not.toHaveBeenCalled();
      expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({ data: { status: "ACTIVE" } }));
      expect(result.status).toBe("ACTIVE");
    });

    it("TC-3 & TC-4: should update user, revoke active refresh tokens, and return updated user for INACTIVE", async () => {
      prisma.user.findUnique.mockResolvedValue({ systemRole: { slug: "USER" } });
      prisma.refreshToken.updateMany.mockResolvedValue({ count: 2 });
      prisma.user.update.mockResolvedValue({ id: "u2", status: "INACTIVE" });

      const result = await adminService.changeUserStatus({ actorUserId: "u1", targetUserId: "u2", newStatus: "INACTIVE" });

      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: "u2", revokedAt: null },
        data: { revokedAt: expect.any(Date) },
      });
      expect(prisma.user.update).toHaveBeenCalled();
      expect(result.status).toBe("INACTIVE");
    });

    it("TC-5: should throw 403 if target is the last SUPER_ADMIN", async () => {
      prisma.user.findUnique.mockResolvedValue({ systemRole: { slug: "SUPER_ADMIN" } });
      prisma.user.count.mockResolvedValue(1); // Only 1 Super Admin left

      await expect(adminService.changeUserStatus({ actorUserId: "u1", targetUserId: "u2", newStatus: "INACTIVE" }))
        .rejects.toThrowError(AppError);

      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it("TC-6: should proceed if target is SUPER_ADMIN but multiple exist", async () => {
      prisma.user.findUnique.mockResolvedValue({ systemRole: { slug: "SUPER_ADMIN" } });
      prisma.user.count.mockResolvedValue(2);
      prisma.user.update.mockResolvedValue({ id: "u2", status: "INACTIVE" });

      await adminService.changeUserStatus({ actorUserId: "u1", targetUserId: "u2", newStatus: "INACTIVE" });
      expect(prisma.user.update).toHaveBeenCalled();
    });
  });

  // changeUserSystemRole
  describe("changeUserSystemRole()", () => {
    it("TC-8: should throw 403 if user tries to change their own role", async () => {
      await expect(adminService.changeUserSystemRole({ actorUserId: "u1", targetUserId: "u1", roleSlug: "ADMIN" }))
        .rejects.toThrowError(AppError);
    });

    it("TC-9: should throw 404 if target user is not found", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(adminService.changeUserSystemRole({ actorUserId: "u1", targetUserId: "u2", roleSlug: "ADMIN" }))
        .rejects.toThrow("User not found");
    });

    it("TC-10: should throw 403 if demoting the last SUPER_ADMIN", async () => {
      prisma.user.findUnique.mockResolvedValue({ systemRole: { slug: "SUPER_ADMIN" } }); // Target
      prisma.user.count.mockResolvedValue(1); // 1 Super Admin active

      await expect(adminService.changeUserSystemRole({ actorUserId: "u1", targetUserId: "u2", roleSlug: "ADMIN" }))
        .rejects.toThrow(AppError);
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it("TC-11: should update system role and revoke tokens for valid update", async () => {
      prisma.user.findUnique.mockResolvedValue({ systemRole: { slug: "USER" } });
      prisma.systemRole.findUnique.mockResolvedValue({ id: "role_admin" });
      prisma.user.update.mockResolvedValue({ id: "u2", systemRole: { slug: "ADMIN" } });

      const result = await adminService.changeUserSystemRole({ actorUserId: "u1", targetUserId: "u2", roleSlug: "ADMIN" });

      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: "u2", revokedAt: null } }));
      expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({ data: { systemRoleId: "role_admin" } }));
      expect(result.systemRole.slug).toBe("ADMIN");
    });

    it("TC-12: should throw 404 if requested role does not exist", async () => {
      prisma.user.findUnique.mockResolvedValue({ systemRole: { slug: "USER" } });
      prisma.systemRole.findUnique.mockResolvedValue(null);

      await expect(adminService.changeUserSystemRole({ actorUserId: "u1", targetUserId: "u2", roleSlug: "INVALID" }))
        .rejects.toThrow("System role not found");
    });
  });

  // assignFunctionalRolesToUser
  describe("assignFunctionalRolesToUser()", () => {
    it("TC-14: should throw 403 if assigning to self", async () => {
      await expect(adminService.assignFunctionalRolesToUser({ actorUserId: "u1", targetUserId: "u1", functionalRoleIds: [] }))
        .rejects.toThrow("You cannot modify your own functional roles.");
    });

    it("TC-15: should throw 400 if any role ID is invalid", async () => {
      prisma.functionalRole.count.mockResolvedValue(1); // Mismatch: 2 provided, 1 found
      await expect(adminService.assignFunctionalRolesToUser({ actorUserId: "u1", targetUserId: "u2", functionalRoleIds: ["r1", "r2"] }))
        .rejects.toThrow("One or more functional role IDs are invalid.");
    });

    it("TC-16: should delete old, create new roles, and revoke tokens successfully", async () => {
      prisma.functionalRole.count.mockResolvedValue(2);
      
      await adminService.assignFunctionalRolesToUser({ actorUserId: "u1", targetUserId: "u2", functionalRoleIds: ["r1", "r2"] });
      
      expect(prisma.userFunctionalRole.deleteMany).toHaveBeenCalledWith({ where: { userId: "u2" } });
      expect(prisma.userFunctionalRole.createMany).toHaveBeenCalledWith({
        data: [{ userId: "u2", functionalRoleId: "r1" }, { userId: "u2", functionalRoleId: "r2" }]
      });
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: "u2", revokedAt: null } }));
    });

    it("TC-17: should only delete and revoke tokens if empty role array is passed", async () => {
      await adminService.assignFunctionalRolesToUser({ actorUserId: "u1", targetUserId: "u2", functionalRoleIds: [] });
      
      expect(prisma.functionalRole.count).not.toHaveBeenCalled();
      expect(prisma.userFunctionalRole.deleteMany).toHaveBeenCalled();
      expect(prisma.userFunctionalRole.createMany).not.toHaveBeenCalled();
      expect(prisma.refreshToken.updateMany).toHaveBeenCalled();
    });
  });

  // getUserFunctionalRoles
  describe("getUserFunctionalRoles()", () => {
    it("TC-19 & 20: should fetch and flatten nested functional roles", async () => {
      prisma.userFunctionalRole.findMany.mockResolvedValue([
        { functionalRole: { id: "r1", name: "Editor", slug: "EDITOR" } },
        { functionalRole: { id: "r2", name: "Manager", slug: "MANAGER" } }
      ]);

      const result = await adminService.getUserFunctionalRoles("u1");

      expect(prisma.userFunctionalRole.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: "u1" } }));
      expect(result).toEqual([
        { id: "r1", name: "Editor", slug: "EDITOR" },
        { id: "r2", name: "Manager", slug: "MANAGER" }
      ]);
    });
  });

  // getAllUsersPaginated
  describe("getAllUsersPaginated()", () => {
    it("TC-22: should calculate default pagination correctly", async () => {
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(25);

      const result = await adminService.getAllUsersPaginated({});

      expect(prisma.user.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 0, take: 10 }));
      expect(result).toMatchObject({ page: 1, limit: 10, total: 25, totalPages: 3 });
    });

    it("TC-23: should calculate custom pagination correctly", async () => {
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(45);

      await adminService.getAllUsersPaginated({ page: 3, limit: 20 });

      expect(prisma.user.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 40, take: 20 }));
    });

    it("TC-27: should build combined filters correctly (Status, Role, Search)", async () => {
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(0);

      await adminService.getAllUsersPaginated({ status: "ACTIVE", systemRole: "ADMIN", search: "john" });

      expect(prisma.user.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: {
          status: "ACTIVE",
          systemRole: { slug: "ADMIN" },
          OR: [
            { name: { contains: "john", mode: "insensitive" } },
            { email: { contains: "john", mode: "insensitive" } }
          ]
        }
      }));
    });
  });

  // inviteAdminUser
  describe("inviteAdminUser()", () => {
    it("TC-31: should throw 409 if pending invitation already exists", async () => {
      prisma.user.findUnique.mockResolvedValue({ status: "PENDING" });
      await expect(adminService.inviteAdminUser({ email: "test@ex.com", systemRoleSlug: "ADMIN" }))
        .rejects.toThrow("A pending invitation already exists");
    });

    it("TC-32: should throw 409 if a non-pending user already exists", async () => {
      prisma.user.findUnique.mockResolvedValue({ status: "ACTIVE" });
      await expect(adminService.inviteAdminUser({ email: "test@ex.com", systemRoleSlug: "ADMIN" }))
        .rejects.toThrow("A user with this email already exists.");
    });

    it("TC-33: should throw 400 for invalid or unallowed system role", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.systemRole.findUnique.mockResolvedValue({ slug: "USER" }); // Explicitly USER, not allowed

      await expect(adminService.inviteAdminUser({ email: "test@ex.com", systemRoleSlug: "USER" }))
        .rejects.toThrow("Invalid system role for invitation.");
    });

    it("TC-35, 38, 39: should execute full invitation transaction and use mapped tokens safely", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.systemRole.findUnique.mockResolvedValue({ id: "sys_admin", slug: "ADMIN" });
      prisma.functionalRole.count.mockResolvedValue(1); // Valid functional role
      
      secureToken.generateSecureToken.mockReturnValue("raw_tk");
      secureToken.hashSecureToken.mockReturnValue("hash_tk");
      passwordUtils.hashPassword.mockResolvedValue("dummy_hash");
      emailService.sendEmail.mockResolvedValue(true);

      prisma.user.create.mockResolvedValue({ id: "new_u1" });
      prisma.adminInvitation.create.mockResolvedValue({ id: "inv_1" });

      await adminService.inviteAdminUser({
        name: "Admin", email: "admin@ex.com", systemRoleSlug: "ADMIN", functionalRoleIds: ["r1"], inviterId: "inviter_1"
      });

      // Verify Transaction actions
      expect(prisma.adminInvitation.deleteMany).toHaveBeenCalledWith({ where: { email: "admin@ex.com" } });
      expect(prisma.user.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ email: "admin@ex.com", status: "PENDING", isEmailVerified: false })
      }));
      expect(prisma.userFunctionalRole.createMany).toHaveBeenCalled();
      expect(prisma.adminInvitation.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ tokenHash: "hash_tk" })
      }));

      // Verify Email actions
      expect(emailService.sendEmail).toHaveBeenCalledWith(expect.objectContaining({
        to: "admin@ex.com",
        html: expect.stringContaining("raw_tk")
      }));
    });

    it("TC-36: should successfully invite without functional roles", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.systemRole.findUnique.mockResolvedValue({ id: "sys_admin", slug: "ADMIN" });
      prisma.user.create.mockResolvedValue({ id: "new_u1" });
      
      await adminService.inviteAdminUser({ email: "admin@ex.com", systemRoleSlug: "ADMIN", functionalRoleIds: [] });

      expect(prisma.userFunctionalRole.createMany).not.toHaveBeenCalled(); // Skipped
      expect(prisma.adminInvitation.create).toHaveBeenCalled();
    });

    it("TC-40: should NOT rollback if email sending fails, but log error", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.systemRole.findUnique.mockResolvedValue({ id: "sys_admin", slug: "ADMIN" });
      prisma.user.create.mockResolvedValue({ id: "new_u1" });
      prisma.adminInvitation.create.mockResolvedValue({ id: "inv_1" });
      
      emailService.sendEmail.mockRejectedValue(new Error("SMTP down"));

      const result = await adminService.inviteAdminUser({ email: "admin@ex.com", systemRoleSlug: "ADMIN" });
      
      expect(result.id).toBe("inv_1"); // Still resolves
      expect(logger.error).toHaveBeenCalled();
    });
  });

  // getUserDetailedProfile
  describe("getUserDetailedProfile()", () => {
    it("TC-41: should throw 404 if user not found", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(adminService.getUserDetailedProfile("invalid")).rejects.toThrow("User not found");
    });

    it("TC-42 & 43 & 44: should flatten permissions, fetch activity and return composed object", async () => {
      const mockUser = {
        id: "u1",
        functionalRoles: [
          { functionalRole: { permissions: [{ permission: { slug: "view" } }, { permission: { slug: "edit" } }] } },
          { functionalRole: { permissions: [{ permission: { slug: "edit" } }, { permission: { slug: "delete" } }] } } // duplicate 'edit'
        ]
      };
      const mockActivity = [{ id: "act1" }];
      
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.blogRevision.findMany.mockResolvedValue(mockActivity);

      const result = await adminService.getUserDetailedProfile("u1");

      // Verify Set deduplication
      expect(result.permissionsList).toEqual(expect.arrayContaining(["view", "edit", "delete"]));
      expect(result.permissionsList).toHaveLength(3);
      expect(result.recentActivity).toEqual(mockActivity);
      expect(prisma.blogRevision.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { actorId: "u1" }, orderBy: { createdAt: 'desc' }, take: 5
      }));
    });
  });

  // revokeUserSessions
  describe("revokeUserSessions()", () => {
    it("TC-45: should revoke active sessions for a regular user", async () => {
      prisma.user.findUnique.mockResolvedValue({ systemRole: { slug: "USER" } });

      const result = await adminService.revokeUserSessions("u1");

      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { userId: "u1", revokedAt: null },
        data: { revokedAt: expect.any(Date) }
      }));
      expect(result.message).toBe("All active sessions for this user have been terminated.");
    });

    it("TC-46: should fail to revoke sessions for the last active Super Admin", async () => {
      prisma.user.findUnique.mockResolvedValue({ systemRole: { slug: "SUPER_ADMIN" } });
      prisma.user.count.mockResolvedValue(1);

      await expect(adminService.revokeUserSessions("u1")).rejects.toThrow(AppError);
      expect(prisma.refreshToken.updateMany).not.toHaveBeenCalled();
    });
  });

  // cancelInvitation
  describe("cancelInvitation()", () => {
    it("TC-48 & 49: should delete invitation and ONLY pending user safely", async () => {
      await adminService.cancelInvitation("  TeSt@ExAmPle.Com  ");

      expect(prisma.adminInvitation.deleteMany).toHaveBeenCalledWith({ where: { email: "test@example.com" } });
      expect(prisma.user.deleteMany).toHaveBeenCalledWith({
        where: { email: "test@example.com", status: "PENDING" }
      });
    });
  });
});