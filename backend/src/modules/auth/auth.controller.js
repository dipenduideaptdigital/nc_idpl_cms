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
} from "./auth.service.js";

import {
  REFRESH_COOKIE_OPTIONS,
  CLEAR_COOKIE_OPTIONS,
} from "../../config/cookies.js";

// USER REGISTRATION

export const register = asyncHandler(
  async (req, res) => {
    const result = await registerUser(
      req.body
    );

    sendResponse({
      res,

      statusCode:
        StatusCodes.CREATED,

      message:
        "User registered successfully",

      data: result,
    });
  }
);

// USER LOGIN

export const login = asyncHandler(
  async (req, res) => {
    const result = await loginUser(
      req.body
    );

    res.cookie(
      "refreshToken",
      result.refreshToken,
      REFRESH_COOKIE_OPTIONS
    );

    sendResponse({
      res,

      statusCode: StatusCodes.OK,

      message: "Login successful",

      data: {
        accessToken:
          result.accessToken,

        user: result.user,
      },
    });
  }
);

// ADMIN LOGIN

export const adminLoginController =
  asyncHandler(async (req, res) => {
    const result =
      await adminLogin(req.body);

    res.cookie(
      "refreshToken",
      result.refreshToken,
      REFRESH_COOKIE_OPTIONS
    );

    sendResponse({
      res,

      statusCode: StatusCodes.OK,

      message:
        "Admin login successful",

      data: {
        accessToken:
          result.accessToken,

        user: result.user,
      },
    });
  });

// REFRESH ACCESS TOKEN

export const refreshTokenController =
  asyncHandler(async (req, res) => {
    const refreshToken =
      req.cookies?.refreshToken;

    const result =
      await refreshAccessToken(
        refreshToken
      );

    sendResponse({
      res,

      statusCode: StatusCodes.OK,

      message:
        "Access token refreshed",

      data: {
        accessToken:
          result.accessToken,
      },
    });
  });

// LOGOUT CURRENT DEVICE

export const logoutController =
  asyncHandler(async (req, res) => {
    const refreshToken =
      req.cookies?.refreshToken;

    await logoutUser(refreshToken);

    res.clearCookie(
      "refreshToken",
      CLEAR_COOKIE_OPTIONS
    );

    sendResponse({
      res,

      statusCode: StatusCodes.OK,

      message:
        "Logged out successfully",
    });
  });

// LOGOUT ALL DEVICES

export const logoutAllDevicesController =
  asyncHandler(async (req, res) => {
    await logoutAllDevices(
      req.user.id
    );

    res.clearCookie(
      "refreshToken",
      CLEAR_COOKIE_OPTIONS
    );

    sendResponse({
      res,

      statusCode: StatusCodes.OK,

      message:
        "Logged out from all devices",
    });
  });