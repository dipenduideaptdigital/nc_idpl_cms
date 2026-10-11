import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as authService from "../../../src/modules/auth/auth.service.js";
import * as repo from "../../../src/modules/auth/auth.repository.js";
import { prisma } from "../../../src/config/db.js";
import * as passwordUtils from "../../../src/shared/utils/password.js";
import * as jwtUtils from "../../../src/shared/utils/jwt.js";
import * as tokenHashUtils from "../../../src/shared/utils/tokenHash.js";
import * as secureTokenUtils from "../../../src/shared/utils/secureToken.js";
import * as recaptchaService from "../../../src/shared/services/recaptcha.service.js";
import * as emailService from "../../../src/shared/services/email.service.js";
import { AppError } from "../../../src/shared/errors/AppError.js";

vi.mock("../../../src/modules/auth/auth.repository.js");
vi.mock("../../../src/shared/utils/password.js");
vi.mock("../../../src/shared/utils/jwt.js");
vi.mock("../../../src/shared/utils/tokenHash.js");
vi.mock("../../../src/shared/utils/secureToken.js");
vi.mock("../../../src/shared/services/recaptcha.service.js");
vi.mock("../../../src/shared/services/email.service.js");
vi.mock("../../../src/config/logger.js", () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() }
}));
vi.mock("../../../src/config/db.js", () => ({
  prisma: {
    $transaction: vi.fn((arg) => (Array.isArray(arg) ? Promise.all(arg) : arg(prisma))),
    user: { update: vi.fn(), create: vi.fn() },
    refreshToken: { create: vi.fn(), updateMany: vi.fn() },
    systemRole: { findUnique: vi.fn() },
    userFunctionalRole: { findMany: vi.fn() },
    passwordResetToken: { updateMany: vi.fn() },
    adminInvitation: { findUnique: vi.fn(), delete: vi.fn() }
  }
}));

describe("Auth Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // registerUser()
  describe("registerUser()", () => {
    it("REG-01 & REG-02 & REG-09: Valid registration normalizes email and returns sanitized user", async () => {
      repo.findUserByEmail.mockResolvedValue(null);
      prisma.systemRole.findUnique.mockResolvedValue({ id: "role_user_id" });
      passwordUtils.hashPassword.mockResolvedValue("hashed_pwd");
      
      const mockCreatedUser = { 
        id: "usr_1", name: "Test User", email: "test@example.com", password: "hashed_pwd", status: "ACTIVE" 
      };
      prisma.user.create.mockResolvedValue(mockCreatedUser);

      const result = await authService.registerUser(
        { name: "Test User", email: " TEST@Example.com ", password: "Password1!" }, 
        "127.0.0.1"
      );

      // Normalization check
      expect(repo.findUserByEmail).toHaveBeenCalledWith("test@example.com", expect.any(Object));
      expect(passwordUtils.hashPassword).toHaveBeenCalledWith("Password1!");
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: "test@example.com",
            password: "hashed_pwd",
            systemRoleId: "role_user_id",
            status: "ACTIVE",
            isEmailVerified: false
          })
        })
      );
      // Sanitization check (password removed)
      expect(result).not.toHaveProperty("password");
      expect(result.email).toBe("test@example.com");
    });

    it("REG-03: Throws 400 if email already exists", async () => {
      repo.findUserByEmail.mockResolvedValue({ id: "existing" });
      await expect(
        authService.registerUser({ name: "User", email: "test@test.com", password: "pwd" }, "ip")
      ).rejects.toThrow(AppError);
    });

    it("REG-05 & REG-06: Verifies reCAPTCHA and stops on failure", async () => {
      recaptchaService.verifyRecaptchaToken.mockRejectedValueOnce(new AppError("Bot detected", 400));
      
      await expect(
        authService.registerUser({ name: "User", email: "test@test.com", password: "pwd", recaptchaToken: "bad-token" }, "ip")
      ).rejects.toThrow("Bot detected");
      
      expect(recaptchaService.verifyRecaptchaToken).toHaveBeenCalledWith("bad-token", "ip");
      expect(repo.findUserByEmail).not.toHaveBeenCalled();
    });

    it("REG-07: Converts Prisma P2002 to AppError", async () => {
      repo.findUserByEmail.mockResolvedValue(null);
      prisma.systemRole.findUnique.mockResolvedValue({ id: "role" });
      passwordUtils.hashPassword.mockResolvedValue("hash");
      prisma.user.create.mockRejectedValue({ code: "P2002" }); // Prisma Unique Constraint Error

      await expect(
        authService.registerUser({ name: "U", email: "u@u.com", password: "p" }, "ip")
      ).rejects.toThrow("Email already exists");
    });
  });

  // loginUser() & adminLogin()
  describe("Login Flows (loginUser & adminLogin)", () => {
    beforeEach(() => {
      recaptchaService.verifyRecaptchaToken.mockResolvedValue(true);
      passwordUtils.comparePassword.mockResolvedValue(true);
      prisma.userFunctionalRole.findMany.mockResolvedValue([]); // No functional roles by default
      jwtUtils.generateAccessToken.mockReturnValue("access_token");
      jwtUtils.generateRefreshToken.mockReturnValue("refresh_token");
      tokenHashUtils.hashToken.mockReturnValue("hashed_refresh_token");
    });

    it("LOG-01 & LOG-15: Valid user login issues tokens and logs login time", async () => {
      const mockUser = { id: "usr_1", email: "test@test.com", status: "ACTIVE", systemRole: { slug: "USER" } };
      repo.findUserByEmail.mockResolvedValue(mockUser);

      const result = await authService.loginUser({ email: "test@test.com", password: "pwd" }, "ip");

      expect(result.accessToken).toBe("access_token");
      expect(result.refreshToken).toBe("refresh_token");
      expect(prisma.refreshToken.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ tokenHash: "hashed_refresh_token" }) })
      );
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { lastLoginAt: expect.any(Date) } })
      );
    });

    it("LOG-04: Throws 401 on wrong password", async () => {
      repo.findUserByEmail.mockResolvedValue({ id: "1", status: "ACTIVE", systemRole: { slug: "USER" } });
      passwordUtils.comparePassword.mockResolvedValueOnce(false);

      await expect(authService.loginUser({ email: "t@t.com", password: "wrong" }, "ip")).rejects.toThrow(AppError);
    });

    it("LOG-05, LOG-06, LOG-07: Rejects non-ACTIVE account statuses", async () => {
      repo.findUserByEmail.mockResolvedValueOnce({ status: "PENDING" });
      await expect(authService.loginUser({ email: "t@t.com", password: "pwd" }, "ip")).rejects.toThrow(/pending/i);

      repo.findUserByEmail.mockResolvedValueOnce({ status: "SUSPENDED" });
      await expect(authService.loginUser({ email: "t@t.com", password: "pwd" }, "ip")).rejects.toThrow(/suspended/i);

      repo.findUserByEmail.mockResolvedValueOnce({ status: "INACTIVE" });
      await expect(authService.loginUser({ email: "t@t.com", password: "pwd" }, "ip")).rejects.toThrow(/inactive/i);
    });

    it("LOG-08: Normal user attempts admin login throws 403", async () => {
      repo.findUserByEmail.mockResolvedValue({ id: "1", status: "ACTIVE", systemRole: { slug: "USER" } });
      
      await expect(authService.adminLogin({ email: "user@test.com", password: "pwd" }, "ip")).rejects.toThrow(/Invalid role/i);
    });

    it("LOG-09: Admin attempts normal user login throws 403", async () => {
      repo.findUserByEmail.mockResolvedValue({ id: "1", status: "ACTIVE", systemRole: { slug: "ADMIN" } });
      
      await expect(authService.loginUser({ email: "admin@test.com", password: "pwd" }, "ip")).rejects.toThrow(/dedicated Admin Portal/i);
    });

    it("LOG-10 & LOG-11: Admin login works for ADMIN and SUPER_ADMIN roles", async () => {
      repo.findUserByEmail.mockResolvedValueOnce({ id: "1", status: "ACTIVE", systemRole: { slug: "ADMIN" } });
      await expect(authService.adminLogin({ email: "admin@t.com", password: "p" }, "ip")).resolves.toBeDefined();

      repo.findUserByEmail.mockResolvedValueOnce({ id: "2", status: "ACTIVE", systemRole: { slug: "SUPER_ADMIN" } });
      await expect(authService.adminLogin({ email: "super@t.com", password: "p" }, "ip")).resolves.toBeDefined();
    });

    it("LOG-14: Duplicate permissions are deduplicated correctly", async () => {
      repo.findUserByEmail.mockResolvedValue({ id: "1", status: "ACTIVE", systemRole: { slug: "ADMIN" } });
      
      // Mock user having overlapping permissions from multiple functional roles
      prisma.userFunctionalRole.findMany.mockResolvedValue([
        { functionalRole: { permissions: [{ permission: { slug: "page.edit" } }, { permission: { slug: "blog.view" } }] } },
        { functionalRole: { permissions: [{ permission: { slug: "page.edit" } }, { permission: { slug: "user.create" } }] } }
      ]);

      const result = await authService.adminLogin({ email: "admin@test.com", password: "p" }, "ip");
      
      expect(result.user.permissions).toHaveLength(3);
      expect(result.user.permissions).toEqual(expect.arrayContaining(["page.edit", "blog.view", "user.create"]));
    });
  });

  // refreshAccessToken()
  describe("refreshAccessToken()", () => {
    it("REF-01: Missing token throws 401", async () => {
      await expect(authService.refreshAccessToken(null)).rejects.toThrow(/missing/i);
    });

    it("REF-02: Invalid JWT throws 401", async () => {
      jwtUtils.verifyRefreshToken.mockImplementation(() => { throw new Error("Invalid"); });
      await expect(authService.refreshAccessToken("bad-token")).rejects.toThrow(/Invalid/i);
    });

    it("REF-03: Valid JWT but no stored token (Reuse Detection)", async () => {
      jwtUtils.verifyRefreshToken.mockReturnValue({ userId: "compromised_user_id" });
      tokenHashUtils.hashToken.mockReturnValue("hash");
      repo.findValidRefreshToken.mockResolvedValue(null); // Token not in DB

      await expect(authService.refreshAccessToken("reused-token")).rejects.toThrow(/reuse detected/i);
      expect(repo.revokeAllUserTokens).toHaveBeenCalledWith("compromised_user_id"); // Security trigger!
    });

    it("REF-05: User is not ACTIVE throws 403", async () => {
      jwtUtils.verifyRefreshToken.mockReturnValue({ userId: "usr_1" });
      repo.findValidRefreshToken.mockResolvedValue({ user: { status: "SUSPENDED" } });

      await expect(authService.refreshAccessToken("token")).rejects.toThrow(AppError);
    });

    it("REF-06 & REF-07: Valid stored token returns new access token with fresh permissions", async () => {
      jwtUtils.verifyRefreshToken.mockReturnValue({ userId: "usr_1" });
      repo.findValidRefreshToken.mockResolvedValue({ user: { id: "usr_1", status: "ACTIVE", systemRole: { slug: "USER" } } });
      prisma.userFunctionalRole.findMany.mockResolvedValue([{ functionalRole: { permissions: [{ permission: { slug: "page.view" } }] } }]);
      jwtUtils.generateAccessToken.mockReturnValue("new_access_token");

      const result = await authService.refreshAccessToken("valid-token");

      expect(jwtUtils.generateAccessToken).toHaveBeenCalledWith(
        expect.objectContaining({ permissions: ["page.view"] })
      );
      expect(result.accessToken).toBe("new_access_token");
    });
  });

  // logoutUser() & logoutAllDevices()
  describe("Logout Flows", () => {
    it("OUT-01: Logout without token returns silently", async () => {
      await authService.logoutUser(null);
      expect(tokenHashUtils.hashToken).not.toHaveBeenCalled();
      expect(repo.revokeRefreshToken).not.toHaveBeenCalled();
    });

    it("OUT-02: Logout hashes token and revokes it", async () => {
      tokenHashUtils.hashToken.mockReturnValue("hashed_token");
      await authService.logoutUser("raw-refresh-token");
      
      expect(tokenHashUtils.hashToken).toHaveBeenCalledWith("raw-refresh-token");
      expect(repo.revokeRefreshToken).toHaveBeenCalledWith("hashed_token");
    });

    it("OUT-04: Logout all devices revokes all tokens for user", async () => {
      await authService.logoutAllDevices("usr_1");
      expect(repo.revokeAllUserTokens).toHaveBeenCalledWith("usr_1");
    });
  });

  // forgotPassword()
  describe("forgotPassword()", () => {
    it("FP-01: Unknown email returns silently (Anti-enumeration)", async () => {
      repo.findUserByEmail.mockResolvedValue(null);
      await authService.forgotPassword("unknown@test.com", null, "ip");
      expect(secureTokenUtils.generateSecureToken).not.toHaveBeenCalled();
    });

    it("FP-02: Prevents spamming if a recent token exists", async () => {
      repo.findUserByEmail.mockResolvedValue({ id: "usr_1" });
      repo.findRecentPasswordResetToken.mockResolvedValue({ id: "recent_token_id" });

      await authService.forgotPassword("test@test.com", null, "ip");
      expect(secureTokenUtils.generateSecureToken).not.toHaveBeenCalled();
    });

    it("FP-03 & FP-05 & FP-06: Eligible user flow, generates token, invalidates old, sends fire-and-forget email", async () => {
      repo.findUserByEmail.mockResolvedValue({ id: "usr_1", email: "test@test.com" });
      repo.findRecentPasswordResetToken.mockResolvedValue(null);
      
      secureTokenUtils.generateSecureToken.mockReturnValue("raw-reset-token");
      secureTokenUtils.hashSecureToken.mockReturnValue("hashed-reset-token");
      emailService.sendEmail.mockResolvedValue("sent");

      await authService.forgotPassword("test@test.com", null, "ip");

      // Invalidate old tokens
      expect(prisma.passwordResetToken.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: "usr_1", usedAt: null } })
      );
      
      // Create new token with hash, NEVER raw token
      expect(repo.createPasswordResetToken).toHaveBeenCalledWith(
        expect.objectContaining({ tokenHash: "hashed-reset-token" })
      );

      // Email sent with raw token
      expect(emailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({ html: expect.stringContaining("raw-reset-token") })
      );
    });
  });

  // resetPassword()
  describe("resetPassword()", () => {
    it("RP-01: Invalid token throws 400", async () => {
      repo.findValidPasswordResetToken.mockResolvedValue(null);
      await expect(authService.resetPassword({ token: "bad", password: "pwd" })).rejects.toThrow(AppError);
    });

    it("RP-04: Throws 400 if new password equals current password", async () => {
      repo.findValidPasswordResetToken.mockResolvedValue({ user: { id: "1", status: "ACTIVE", password: "old_hash" } });
      passwordUtils.comparePassword.mockResolvedValue(true); // Same as old!

      await expect(authService.resetPassword({ token: "token", password: "same-password" })).rejects.toThrow(/different/i);
    });

    it("RP-05, RP-06, RP-07: Valid reset updates password, marks tokens used, and revokes sessions", async () => {
      const mockUser = { id: "usr_1", status: "ACTIVE", password: "old_hash" };
      repo.findValidPasswordResetToken.mockResolvedValue({ userId: "usr_1", user: mockUser });
      passwordUtils.comparePassword.mockResolvedValue(false);
      passwordUtils.hashPassword.mockResolvedValue("new_hash");

      await authService.resetPassword({ token: "valid-token", password: "new-password" });

      expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({ data: { password: "new_hash" } }));
      expect(prisma.passwordResetToken.updateMany).toHaveBeenCalled();
      expect(prisma.refreshToken.updateMany).toHaveBeenCalled();
    });
  });

  // changePassword()
  describe("changePassword()", () => {
    it("CP-03: Throws 400 for wrong current password", async () => {
      repo.findUserById.mockResolvedValue({ id: "1", status: "ACTIVE", password: "old_hash" });
      passwordUtils.comparePassword.mockResolvedValue(false); // Wrong current pwd

      await expect(
        authService.changePassword({ userId: "1", currentPassword: "wrong", newPassword: "new" })
      ).rejects.toThrow(/incorrect/i);
    });

    it("CP-05, CP-06, CP-07: Valid change executes full transaction", async () => {
      repo.findUserById.mockResolvedValue({ id: "usr_1", status: "ACTIVE", password: "old_hash" });
      // First compare (current pwd check) -> true, Second compare (same pwd check) -> false
      passwordUtils.comparePassword
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);
      passwordUtils.hashPassword.mockResolvedValue("new_hash");

      const result = await authService.changePassword({ userId: "usr_1", currentPassword: "old", newPassword: "new" });

      expect(result).toBe(true);
      expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({ data: { password: "new_hash" } }));
      expect(prisma.refreshToken.updateMany).toHaveBeenCalled();
      expect(prisma.passwordResetToken.updateMany).toHaveBeenCalled();
    });
  });

  // setupAdminAccount()
  describe("setupAdminAccount()", () => {
    it("ADM-02: Throws 410 if invitation has expired", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-05-10T12:00:00.000Z"));

      prisma.adminInvitation.findUnique.mockResolvedValue({
        id: "inv_1", expiresAt: new Date("2026-05-09T12:00:00.000Z") // Expired yesterday
      });

      await expect(authService.setupAdminAccount({ token: "token", password: "pwd" })).rejects.toThrow(/expired/i);
    });

    it("ADM-03, ADM-04, ADM-05: Valid setup updates password, verifies email, deletes invitation", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-05-01T12:00:00.000Z"));

      prisma.adminInvitation.findUnique.mockResolvedValue({
        id: "inv_1", email: "admin@test.com", expiresAt: new Date("2026-05-10T12:00:00.000Z") // Valid
      });
      passwordUtils.hashPassword.mockResolvedValue("new_hash");

      await authService.setupAdminAccount({ token: "valid", password: "pwd" });

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { email: "admin@test.com" },
          data: expect.objectContaining({ password: "new_hash", status: "ACTIVE", isEmailVerified: true })
        })
      );
      expect(prisma.adminInvitation.delete).toHaveBeenCalledWith({ where: { id: "inv_1" } });
    });
  });

  //  getMe()
  describe("getMe()", () => {
    it("ME-01 & ME-02: Validates user existence and ACTIVE status", async () => {
      repo.findUserById.mockResolvedValue(null);
      await expect(authService.getMe("1")).rejects.toThrow(/not found/i);

      repo.findUserById.mockResolvedValue({ status: "SUSPENDED" });
      await expect(authService.getMe("2")).rejects.toThrow(AppError);
    });

    it("ME-03 & ME-04: Returns sanitized user with deduplicated permissions", async () => {
      repo.findUserById.mockResolvedValue({ id: "usr_1", email: "test@test.com", status: "ACTIVE" });
      prisma.userFunctionalRole.findMany.mockResolvedValue([
        { functionalRole: { permissions: [{ permission: { slug: "page.view" } }] } }
      ]);

      const result = await authService.getMe("usr_1");

      expect(result.email).toBe("test@test.com");
      expect(result).not.toHaveProperty("password");
      expect(result.permissions).toEqual(["page.view"]);
    });
  });
});