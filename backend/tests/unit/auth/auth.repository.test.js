import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";

import { prisma } from "../../../src/config/db.js";

import {
  AUTH_BASIC_USER_INCLUDE,
} from "../../../src/modules/auth/auth.constants.js";

import {
  findUserById,
  findUserByEmail,
  revokeRefreshToken,
  revokeAllUserTokens,
  findValidRefreshToken,
  createPasswordResetToken,
  findValidPasswordResetToken,
  markPasswordResetTokenUsed,
  findRecentPasswordResetToken,
} from "../../../src/modules/auth/auth.repository.js";

vi.mock("../../../src/config/db.js", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    refreshToken: {
      updateMany: vi.fn(),
      findFirst: vi.fn(),
    },
    passwordResetToken: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("Auth Repository", () => {
  const fixedNow = new Date("2026-10-01T12:00:00.000Z");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // findUserById()

  describe("findUserById()", () => {
    it("should find a user by ID using the default auth include", async () => {
      const mockUser = {
        id: "user_1",
        email: "user@example.com",
        systemRole: {
          id: "role_1",
          slug: "USER",
        },
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await findUserById("user_1");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: "user_1",
        },
        include: AUTH_BASIC_USER_INCLUDE,
      });

      expect(result).toEqual(mockUser);
    });

    it("should use a custom include when one is provided", async () => {
      const customInclude = {
        systemRole: true,
        functionalRoles: true,
      };

      prisma.user.findUnique.mockResolvedValue(null);

      const result = await findUserById(
        "user_2",
        customInclude,
      );

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: "user_2",
        },
        include: customInclude,
      });

      expect(result).toBeNull();
    });
  });

  // findUserByEmail()

  describe("findUserByEmail()", () => {
    it("should find a user by email using the default auth include", async () => {
      const mockUser = {
        id: "user_1",
        email: "user@example.com",
        systemRole: {
          slug: "USER",
        },
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await findUserByEmail(
        "user@example.com",
      );

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: "user@example.com",
        },
        include: AUTH_BASIC_USER_INCLUDE,
      });

      expect(result).toEqual(mockUser);
    });

    it("should use a custom include when one is provided", async () => {
      const customInclude = {
        systemRole: true,
        functionalRoles: true,
      };

      prisma.user.findUnique.mockResolvedValue(null);

      const result = await findUserByEmail(
        "admin@example.com",
        customInclude,
      );

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: "admin@example.com",
        },
        include: customInclude,
      });

      expect(result).toBeNull();
    });
  });

  // revokeRefreshToken()

  describe("revokeRefreshToken()", () => {
    it("should revoke only the matching token that has not already been revoked", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(fixedNow);

      const mockResult = {
        count: 1,
      };

      prisma.refreshToken.updateMany.mockResolvedValue(
        mockResult,
      );

      const result = await revokeRefreshToken(
        "hashed_refresh_token",
      );

      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: {
          tokenHash: "hashed_refresh_token",
          revokedAt: null,
        },
        data: {
          revokedAt: fixedNow,
        },
      });

      expect(result).toEqual(mockResult);
    });
  });

  // revokeAllUserTokens()

  describe("revokeAllUserTokens()", () => {
    it("should revoke every active refresh token belonging to the user", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(fixedNow);

      const mockResult = {
        count: 3,
      };

      prisma.refreshToken.updateMany.mockResolvedValue(
        mockResult,
      );

      const result = await revokeAllUserTokens("user_1");

      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: {
          userId: "user_1",
          revokedAt: null,
        },
        data: {
          revokedAt: fixedNow,
        },
      });

      expect(result).toEqual(mockResult);
    });
  });

  // findValidRefreshToken()

  describe("findValidRefreshToken()", () => {
    it("should find an unrevoked, unexpired token and include its user and system role", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(fixedNow);

      const mockToken = {
        id: "refresh_1",
        tokenHash: "hashed_refresh_token",
        revokedAt: null,
        expiresAt: new Date("2026-10-02T12:00:00.000Z"),
        user: {
          id: "user_1",
          status: "ACTIVE",
          systemRole: {
            id: "role_1",
            slug: "USER",
          },
        },
      };

      prisma.refreshToken.findFirst.mockResolvedValue(
        mockToken,
      );

      const result = await findValidRefreshToken(
        "hashed_refresh_token",
      );

      expect(prisma.refreshToken.findFirst).toHaveBeenCalledWith({
        where: {
          tokenHash: "hashed_refresh_token",
          revokedAt: null,
          expiresAt: {
            gt: fixedNow,
          },
        },
        include: {
          user: {
            include: {
              systemRole: true,
            },
          },
        },
      });

      expect(result).toEqual(mockToken);
    });

    it("should return null when no valid refresh token is found", async () => {
      prisma.refreshToken.findFirst.mockResolvedValue(null);

      const result = await findValidRefreshToken(
        "unknown_token_hash",
      );

      expect(result).toBeNull();

      expect(prisma.refreshToken.findFirst).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  // createPasswordResetToken()

  describe("createPasswordResetToken()", () => {
    it("should persist the supplied password-reset token data", async () => {
      const tokenData = {
        userId: "user_1",
        tokenHash: "hashed_reset_token",
        expiresAt: new Date("2026-10-01T13:00:00.000Z"),
      };

      const createdToken = {
        id: "reset_1",
        ...tokenData,
        usedAt: null,
      };

      prisma.passwordResetToken.create.mockResolvedValue(
        createdToken,
      );

      const result = await createPasswordResetToken(
        tokenData,
      );

      expect(prisma.passwordResetToken.create).toHaveBeenCalledWith({
        data: tokenData,
      });

      expect(result).toEqual(createdToken);

      expect(tokenData).not.toHaveProperty("token");
    });
  });

  // findValidPasswordResetToken()

  describe("findValidPasswordResetToken()", () => {
    it("should find an unused, unexpired reset token with its user and system role", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(fixedNow);

      const mockResetToken = {
        id: "reset_1",
        userId: "user_1",
        tokenHash: "hashed_reset_token",
        usedAt: null,
        expiresAt: new Date("2026-10-01T13:00:00.000Z"),
        user: {
          id: "user_1",
          status: "ACTIVE",
          systemRole: {
            slug: "USER",
          },
        },
      };

      prisma.passwordResetToken.findFirst.mockResolvedValue(
        mockResetToken,
      );

      const result = await findValidPasswordResetToken(
        "hashed_reset_token",
      );

      expect(prisma.passwordResetToken.findFirst).toHaveBeenCalledWith({
        where: {
          tokenHash: "hashed_reset_token",
          usedAt: null,
          expiresAt: {
            gt: fixedNow,
          },
        },
        include: {
          user: {
            include: {
              systemRole: true,
            },
          },
        },
      });

      expect(result).toEqual(mockResetToken);
    });

    it("should return null when no valid password-reset token is found", async () => {
      prisma.passwordResetToken.findFirst.mockResolvedValue(null);

      const result = await findValidPasswordResetToken(
        "invalid_reset_hash",
      );

      expect(result).toBeNull();
    });
  });

  // markPasswordResetTokenUsed()

  describe("markPasswordResetTokenUsed()", () => {
    it("should mark the specified reset token as used", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(fixedNow);

      const updatedToken = {
        id: "reset_1",
        usedAt: fixedNow,
      };

      prisma.passwordResetToken.update.mockResolvedValue(
        updatedToken,
      );

      const result = await markPasswordResetTokenUsed(
        "reset_1",
      );

      expect(prisma.passwordResetToken.update).toHaveBeenCalledWith({
        where: {
          id: "reset_1",
        },
        data: {
          usedAt: fixedNow,
        },
      });

      expect(result).toEqual(updatedToken);
    });
  });

  // findRecentPasswordResetToken()

  describe("findRecentPasswordResetToken()", () => {
    it("should use a three-minute window by default and sort newest first", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(fixedNow);

      const mockRecentToken = {
        id: "reset_recent",
        userId: "user_1",
        createdAt: new Date(
          "2026-10-01T11:59:00.000Z",
        ),
      };

      prisma.passwordResetToken.findFirst.mockResolvedValue(
        mockRecentToken,
      );

      const result = await findRecentPasswordResetToken(
        "user_1",
      );

      const expectedThreshold = new Date(
        fixedNow.getTime() - 3 * 60 * 1000,
      );

      expect(prisma.passwordResetToken.findFirst).toHaveBeenCalledWith({
        where: {
          userId: "user_1",
          createdAt: {
            gt: expectedThreshold,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      expect(result).toEqual(mockRecentToken);
    });

    it("should respect a custom rate-limit window", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(fixedNow);

      prisma.passwordResetToken.findFirst.mockResolvedValue(
        null,
      );

      await findRecentPasswordResetToken("user_1", 10);

      const expectedThreshold = new Date(
        fixedNow.getTime() - 10 * 60 * 1000,
      );

      expect(prisma.passwordResetToken.findFirst).toHaveBeenCalledWith({
        where: {
          userId: "user_1",
          createdAt: {
            gt: expectedThreshold,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    });
  });
});