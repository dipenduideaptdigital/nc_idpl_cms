import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/apiResponse.js";
import { changeUserStatus, changeUserSystemRole } from "./users.admin.service.js";

export const updateUserStatusController = asyncHandler(async (req, res) => {
  const result = await changeUserStatus({
    actorUserId: req.user.id,
    targetUserId: req.params.id,
    newStatus: req.body.status,
  });

  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: `User status updated to ${req.body.status}`,
    data: result,
  });
});

export const updateUserRoleController = asyncHandler(async (req, res) => {
  const result = await changeUserSystemRole({
    actorUserId: req.user.id,
    targetUserId: req.params.id,
    roleSlug: req.body.systemRoleSlug,
  });

  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "User system role updated successfully",
    data: result,
  });
});