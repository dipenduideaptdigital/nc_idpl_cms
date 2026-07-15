import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/apiResponse.js";
import { getMyProfile, updateMyProfile } from "./users.service.js";

export const getMyProfileController = asyncHandler(async (req, res) => {
  const result = await getMyProfile(req.user.id);

  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Profile fetched successfully",
    data: result,
  });
});

export const updateMyProfileController = asyncHandler(async (req, res) => {
  const result = await updateMyProfile({
    userId: req.user.id,
    payload: req.body,
  });

  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Profile updated successfully",
    data: result,
  });
});