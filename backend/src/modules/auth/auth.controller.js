import { StatusCodes } from "http-status-codes";

import { asyncHandler } from "../../shared/utils/asyncHandler.js";

import { sendResponse } from "../../shared/utils/apiResponse.js";

import {
  registerUser,
  loginUser,
} from "./auth.service.js";

export const register = asyncHandler(
  async (req, res) => {
    const result = await registerUser(req.body);

    sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "User registered successfully",
      data: result,
    });
  }
);

export const login = asyncHandler(
  async (req, res) => {
    const result = await loginUser(req.body);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "Login successful",
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  }
);