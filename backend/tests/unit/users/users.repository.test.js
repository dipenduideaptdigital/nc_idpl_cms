// tests/unit/users/users.repository.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as usersRepo from "../../../src/modules/users/users.repository.js";
import { prisma } from "../../../src/config/db.js";

// Mock Prisma
vi.mock("../../../src/config/db.js", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("Users Repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findCurrentUserProfile()", () => {
    it("UR-01: should call prisma.user.findUnique with correct ID and include config", async () => {
      const mockUser = { id: "user_123", name: "Test User" };
      const mockInclude = { systemRole: true };
      
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await usersRepo.findCurrentUserProfile("user_123", mockInclude);

      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user_123" },
        include: mockInclude,
      });
      expect(result).toEqual(mockUser);
    });

    it("UR-02: should return null if the user is not found in database", async () => {
      // Mocking missing user
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await usersRepo.findCurrentUserProfile("invalid_id", {});

      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it("UR-03: should propagate database errors to the caller (reject)", async () => {
      const dbError = new Error("Database connection lost");
      prisma.user.findUnique.mockRejectedValue(dbError);

      await expect(usersRepo.findCurrentUserProfile("user_123", {}))
        .rejects.toThrow("Database connection lost");
    });
  });

  describe("updateCurrentUserProfile()", () => {
    it("UR-04: should call prisma.user.update with correct userId, data, and include config", async () => {
      const mockUpdatedUser = { id: "user_123", name: "Updated Name" };
      const mockData = { name: "Updated Name" };
      const mockInclude = { systemRole: true };
      
      prisma.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await usersRepo.updateCurrentUserProfile({
        userId: "user_123",
        data: mockData,
        include: mockInclude,
      });

      expect(prisma.user.update).toHaveBeenCalledTimes(1);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user_123" },
        data: mockData,
        include: mockInclude,
      });
      expect(result).toEqual(mockUpdatedUser);
    });

    it("UR-05: should propagate database update errors to the caller (reject)", async () => {
      const dbError = new Error("Unique constraint failed");
      prisma.user.update.mockRejectedValue(dbError);

      await expect(
        usersRepo.updateCurrentUserProfile({
          userId: "user_123",
          data: { name: "New Name" },
          include: {},
        })
      ).rejects.toThrow("Unique constraint failed");
    });
  });
});