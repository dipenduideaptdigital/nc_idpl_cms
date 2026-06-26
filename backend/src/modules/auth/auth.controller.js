import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/apiResponse.js";

import {
  registerUser,
  loginUser,
  adminLogin,
  refreshAccessToken,
  logoutUser,
  logoutAllDevices,
  forgotPassword,
  resetPassword,
  changePassword,
  setupAdminAccount,
  getMe
} from "./auth.service.js";

import {
  REFRESH_COOKIE_OPTIONS,
  CLEAR_COOKIE_OPTIONS,
} from "../../config/cookies.js";

// User registration
export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);

  sendResponse({
    res,
    statusCode: StatusCodes.CREATED,
    message: "User registered successfully",
    data: result,
  });
});

// User login
export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);

  res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS);

  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Login successful",
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
});

// Admin login
export const adminLoginController = asyncHandler(async (req, res) => {
  const result = await adminLogin(req.body);

  res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS);

  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Admin login successful",
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
});

// Refresh access token
export const refreshTokenController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  const result = await refreshAccessToken(refreshToken);

  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Access token refreshed",
    data: {
      accessToken: result.accessToken,
    },
  });
});

// Forgot password
export const forgotPasswordController = asyncHandler(async (req, res) => {
  await forgotPassword(req.body.email);
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "If an account exists with this email, a password reset link has been sent.",
  });
});

// Reset password
export const resetPasswordController = asyncHandler(async (req, res) => {
  await resetPassword({
    token: req.body.token,
    password: req.body.password,
  });

  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Password reset successful. Please login again.",
  });
});

// Change password
export const changePasswordController = asyncHandler(async (req, res) => {
  await changePassword({
    userId: req.user.id,
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword,
  });

  res.clearCookie("refreshToken", CLEAR_COOKIE_OPTIONS);

  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Password changed successfully. Please login again.",
  });
});

export const logoutController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  await logoutUser(refreshToken);

  res.clearCookie("refreshToken", CLEAR_COOKIE_OPTIONS);

  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Logged out successfully",
  });
});

// Logout all devices
export const logoutAllDevicesController = asyncHandler(async (req, res) => {
  await logoutAllDevices(req.user.id);

  res.clearCookie("refreshToken", CLEAR_COOKIE_OPTIONS);

  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Logged out from all devices",
  });
});

export const setupAdminAccountController = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Token and new password are required."
    });
  }

  await setupAdminAccount({ token, password });

  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Account setup successful! You can now log in.",
  });
});

export const meController = asyncHandler(async (req, res) => {
  const userData = await getMe(req.user.id);

  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Current user fetched successfully",
    data: userData,
  });
});