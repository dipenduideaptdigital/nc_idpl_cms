import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/apiResponse.js";
import * as adminService from "./users.admin.service.js";

export const updateUserStatusController = asyncHandler(async (req, res) => {
  const result = await adminService.changeUserStatus({
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
  const result = await adminService.changeUserSystemRole({
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

export const assignUserFunctionalRolesController = asyncHandler(async (req, res) => {
  await adminService.assignFunctionalRolesToUser({
    actorUserId: req.user.id,
    targetUserId: req.params.id,
    functionalRoleIds: req.body.functionalRoleIds,
  });

  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Functional roles updated successfully. User tokens revoked to apply new permissions.",
  });
});

export const getUserFunctionalRolesController = asyncHandler(async (req, res) => {
  const roles = await adminService.getUserFunctionalRoles(req.params.id);
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    data: roles
  });
});

export const getAllUsersController = asyncHandler(async (req, res) => {
  const result = await adminService.getAllUsersPaginated(req.query);
  sendResponse({ res, statusCode: StatusCodes.OK, message: "Users retrieved successfully", data: result.users, meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages } });
});

export const inviteAdminController = asyncHandler(async (req, res) => {
  await adminService.inviteAdminUser({
    name: req.body.name,
    email: req.body.email,
    systemRoleSlug: req.body.systemRoleSlug,
    functionalRoleIds: req.body.functionalRoleIds, 
    inviterId: req.user.id
  });
  sendResponse({ res, statusCode: StatusCodes.CREATED, message: "Invitation sent successfully." });
});