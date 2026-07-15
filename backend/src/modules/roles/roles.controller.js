import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/apiResponse.js";
import * as roleService from "./roles.service.js";

export const createRoleController = asyncHandler(async (req, res) => {
  const role = await roleService.createRole(req.body);
  sendResponse({ res, statusCode: StatusCodes.CREATED, message: "Functional role created successfully.", data: role });
});

export const updateRoleController = asyncHandler(async (req, res) => {
  const role = await roleService.updateRole(req.params.id, req.body);
  sendResponse({ res, statusCode: StatusCodes.OK, message: "Functional role updated successfully.", data: role });
});

export const deleteRoleController = asyncHandler(async (req, res) => {
  await roleService.deleteRole(req.params.id);
  sendResponse({ res, statusCode: StatusCodes.OK, message: "Functional role deleted successfully." });
});

export const getAllRolesController = asyncHandler(async (req, res) => {
  const roles = await roleService.getAllRoles();
  sendResponse({ res, statusCode: StatusCodes.OK, message: "Roles retrieved successfully.", data: roles });
});

export const getRoleDetailsController = asyncHandler(async (req, res) => {
  const role = await roleService.getRoleDetails(req.params.id);
  sendResponse({ res, statusCode: StatusCodes.OK, message: "Role details retrieved successfully.", data: role });
});

export const getSystemPermissionsController = asyncHandler(async (req, res) => {
  const permissions = await roleService.getSystemPermissions();
  sendResponse({ res, statusCode: StatusCodes.OK, message: "System permissions retrieved successfully.", data: permissions });
});