import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authController from "../../../src/modules/auth/auth.controller.js";
import * as authService from "../../../src/modules/auth/auth.service.js";
import { REFRESH_COOKIE_OPTIONS, CLEAR_COOKIE_OPTIONS } from "../../../src/config/cookies.js";

vi.mock("../../../src/modules/auth/auth.service.js");

describe("Auth Controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {
      body: {},
      cookies: {},
      headers: {},
      socket: { remoteAddress: "127.0.0.1" },
      user: {},
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      cookie: vi.fn().mockReturnThis(),
      clearCookie: vi.fn().mockReturnThis(),
    };

    next = vi.fn();
  });

  // register
  describe("register", () => {
    it("REG-CTRL-01, 02, 03: Delegates to service and returns 201 with correct payload", async () => {
      req.body = { name: "Test", email: "test@test.com", password: "pwd" };
      const mockServiceResult = { id: "1", name: "Test", email: "test@test.com" };
      authService.registerUser.mockResolvedValue(mockServiceResult);

      await authController.register(req, res, next);

      expect(authService.registerUser).toHaveBeenCalledWith(req.body, "127.0.0.1");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "User registered successfully",
          data: mockServiceResult,
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("REG-CTRL-04: Forwards service rejection to error handler", async () => {
      const error = new Error("Service failed");
      authService.registerUser.mockRejectedValue(error);

      await authController.register(req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // login
  describe("login", () => {
    it("LOGIN-CTRL-01, 02, 03, 04: Sets refresh cookie, excludes refresh token from JSON, returns 200", async () => {
      req.body = { email: "test@test.com", password: "pwd" };
      const mockServiceResult = {
        accessToken: "access_jwt",
        refreshToken: "refresh_jwt",
        user: { id: "1", name: "Test" },
      };
      authService.loginUser.mockResolvedValue(mockServiceResult);

      await authController.login(req, res, next);

      expect(authService.loginUser).toHaveBeenCalledWith(req.body, "127.0.0.1");
      expect(res.cookie).toHaveBeenCalledWith("refreshToken", "refresh_jwt", REFRESH_COOKIE_OPTIONS);
      expect(res.status).toHaveBeenCalledWith(200);
      
      // Asserts that the refresh token is NOT in the JSON payload
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: {
            accessToken: "access_jwt",
            user: mockServiceResult.user,
          },
        })
      );
      expect(res.json.mock.calls[0][0].data).not.toHaveProperty("refreshToken");
    });

    it("LOGIN-CTRL-05: Service failure forwards error, no cookie set", async () => {
      const error = new Error("Invalid credentials");
      authService.loginUser.mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(res.cookie).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // adminLoginController
  describe("adminLoginController", () => {
    it("ADMIN-LOGIN-CTRL-01, 02, 03: Delegates correctly and sets cookie", async () => {
      req.body = { email: "admin@test.com", password: "pwd" };
      const mockServiceResult = {
        accessToken: "admin_access",
        refreshToken: "admin_refresh",
        user: { id: "1", name: "Admin" },
      };
      authService.adminLogin.mockResolvedValue(mockServiceResult);

      await authController.adminLoginController(req, res, next);

      expect(authService.adminLogin).toHaveBeenCalledWith(req.body, "127.0.0.1");
      expect(res.cookie).toHaveBeenCalledWith("refreshToken", "admin_refresh", REFRESH_COOKIE_OPTIONS);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Admin login successful" })
      );
    });
  });

  // refreshTokenController
  describe("refreshTokenController", () => {
    it("REFRESH-CTRL-01, 04: Reads cookie, delegates, returns access token without setting new cookie", async () => {
      req.cookies = { refreshToken: "existing_refresh_token" };
      authService.refreshAccessToken.mockResolvedValue({ accessToken: "new_access_token" });

      await authController.refreshTokenController(req, res, next);

      expect(authService.refreshAccessToken).toHaveBeenCalledWith("existing_refresh_token");
      expect(res.cookie).not.toHaveBeenCalled(); // Contract says no new cookie set here
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { accessToken: "new_access_token" },
        })
      );
    });

    it("REFRESH-CTRL-02, 03: Safely handles missing cookie object or token", async () => {
      req.cookies = undefined; // Missing cookies object
      authService.refreshAccessToken.mockRejectedValue(new Error("Missing token"));

      await authController.refreshTokenController(req, res, next);

      expect(authService.refreshAccessToken).toHaveBeenCalledWith(undefined);
      expect(next).toHaveBeenCalled();
    });
  });

  // forgotPasswordController
  describe("forgotPasswordController", () => {
    it("FORGOT-CTRL-01, 02: Calls service and returns generic response", async () => {
      req.body = { email: "test@test.com", recaptchaToken: "token" };
      authService.forgotPassword.mockResolvedValue(undefined);

      await authController.forgotPasswordController(req, res, next);

      expect(authService.forgotPassword).toHaveBeenCalledWith("test@test.com", "token", "127.0.0.1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "If an account exists with this email, a password reset link has been sent.",
        })
      );
    });

    it("FORGOT-CTRL-03: Unknown email resolves identically", async () => {
      req.body = { email: "unknown@test.com" };
      authService.forgotPassword.mockResolvedValue(undefined);

      await authController.forgotPasswordController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "If an account exists with this email, a password reset link has been sent.",
        })
      );
    });
  });

  // resetPasswordController
  describe("resetPasswordController", () => {
    it("RESET-CTRL-01, 02: Passes token and password, returns success", async () => {
      req.body = { token: "secure_token", password: "new_password" };
      authService.resetPassword.mockResolvedValue(undefined);

      await authController.resetPasswordController(req, res, next);

      expect(authService.resetPassword).toHaveBeenCalledWith({ token: "secure_token", password: "new_password" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Password reset successful. Please login again." })
      );
    });
  });

  // changePasswordController
  describe("changePasswordController", () => {
    it("CHANGE-CTRL-01, 02, 03, 04: Uses authenticated user ID, clears cookie, returns 200", async () => {
      req.user = { id: "usr_1" };
      req.body = { currentPassword: "old", newPassword: "new" };
      authService.changePassword.mockResolvedValue(true);

      await authController.changePasswordController(req, res, next);

      expect(authService.changePassword).toHaveBeenCalledWith({
        userId: "usr_1",
        currentPassword: "old",
        newPassword: "new",
      });
      expect(res.clearCookie).toHaveBeenCalledWith("refreshToken", CLEAR_COOKIE_OPTIONS);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("CHANGE-CTRL-05: Does not clear cookie if service fails", async () => {
      req.user = { id: "usr_1" };
      const error = new Error("Wrong current password");
      authService.changePassword.mockRejectedValue(error);

      await authController.changePasswordController(req, res, next);

      expect(res.clearCookie).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // logoutController
  describe("logoutController", () => {
    it("LOGOUT-CTRL-01, 03: Clears cookie after successful service call", async () => {
      req.cookies = { refreshToken: "existing_token" };
      authService.logoutUser.mockResolvedValue();

      await authController.logoutController(req, res, next);

      expect(authService.logoutUser).toHaveBeenCalledWith("existing_token");
      expect(res.clearCookie).toHaveBeenCalledWith("refreshToken", CLEAR_COOKIE_OPTIONS);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // logoutAllDevicesController
  describe("logoutAllDevicesController", () => {
    it("LOGOUT-ALL-CTRL-01, 02: Uses authenticated user ID and clears cookie", async () => {
      req.user = { id: "usr_1" };
      authService.logoutAllDevices.mockResolvedValue();

      await authController.logoutAllDevicesController(req, res, next);

      expect(authService.logoutAllDevices).toHaveBeenCalledWith("usr_1");
      expect(res.clearCookie).toHaveBeenCalledWith("refreshToken", CLEAR_COOKIE_OPTIONS);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // setupAdminAccountController
  describe("setupAdminAccountController", () => {
    it("SETUP-ADMIN-CTRL-01, 02, 03: Missing fields return 400 without service call", async () => {
      // Test missing password
      req.body = { token: "valid_token" };
      await authController.setupAdminAccountController(req, res, next);
      expect(authService.setupAdminAccount).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));

      res.status.mockClear();
      res.json.mockClear();

      // Test missing token
      req.body = { password: "new_password" };
      await authController.setupAdminAccountController(req, res, next);
      expect(authService.setupAdminAccount).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("SETUP-ADMIN-CTRL-04, 05: Valid request delegates to service and returns 200", async () => {
      req.body = { token: "valid_token", password: "new_password" };
      authService.setupAdminAccount.mockResolvedValue(true);

      await authController.setupAdminAccountController(req, res, next);

      expect(authService.setupAdminAccount).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Account setup successful! You can now log in." })
      );
    });
  });
});