import { describe, it, expect, vi, beforeEach } from "vitest";
import { StatusCodes } from "http-status-codes";
import * as adminController from "../../../src/modules/users/users.admin.controller.js";
import * as adminService from "../../../src/modules/users/users.admin.service.js";
import * as apiResponse from "../../../src/shared/utils/apiResponse.js";
import { AppError } from "../../../src/shared/errors/AppError.js";

// Mocking dependencies
vi.mock("../../../src/modules/users/users.admin.service.js");
vi.mock("../../../src/shared/utils/apiResponse.js");

describe("Users Admin Controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup generic mock Express objects
    req = {
      user: { id: "admin_1" },
      params: {},
      body: {},
      query: {}
    };
    res = {}; // sendResponse takes care of actual response methods
    next = vi.fn();
  });

  describe("updateUserStatusController()", () => {
    it("TC-1: should call changeUserStatus service with correct arguments", async () => {
      req.params.id = "user_1";
      req.body.status = "INACTIVE";
      adminService.changeUserStatus.mockResolvedValue({ id: "user_1", status: "INACTIVE" });

      await adminController.updateUserStatusController(req, res, next);

      expect(adminService.changeUserStatus).toHaveBeenCalledWith({
        actorUserId: "admin_1",
        targetUserId: "user_1",
        newStatus: "INACTIVE",
      });
    });

    it("TC-2: should send correct success response with dynamic message", async () => {
      req.params.id = "user_1";
      req.body.status = "INACTIVE";
      const mockResult = { id: "user_1", status: "INACTIVE" };
      adminService.changeUserStatus.mockResolvedValue(mockResult);

      await adminController.updateUserStatusController(req, res, next);

      expect(apiResponse.sendResponse).toHaveBeenCalledWith({
        res,
        statusCode: StatusCodes.OK,
        message: "User status updated to INACTIVE",
        data: mockResult,
      });
    });
  });

  describe("updateUserRoleController()", () => {
    it("TC-3: should call changeUserSystemRole service with correct arguments", async () => {
      req.params.id = "user_1";
      req.body.systemRoleSlug = "ADMIN";
      
      await adminController.updateUserRoleController(req, res, next);

      expect(adminService.changeUserSystemRole).toHaveBeenCalledWith({
        actorUserId: "admin_1",
        targetUserId: "user_1",
        roleSlug: "ADMIN",
      });
    });

    it("TC-4: should send correct success response for system role update", async () => {
      const mockResult = { id: "user_1", systemRole: "ADMIN" };
      adminService.changeUserSystemRole.mockResolvedValue(mockResult);

      await adminController.updateUserRoleController(req, res, next);

      expect(apiResponse.sendResponse).toHaveBeenCalledWith({
        res,
        statusCode: StatusCodes.OK,
        message: "User system role updated successfully",
        data: mockResult,
      });
    });
  });

  describe("assignUserFunctionalRolesController()", () => {
    it("TC-5: should call assignFunctionalRolesToUser with correct arguments", async () => {
      req.params.id = "user_1";
      req.body.functionalRoleIds = ["role_1", "role_2"];

      await adminController.assignUserFunctionalRolesController(req, res, next);

      expect(adminService.assignFunctionalRolesToUser).toHaveBeenCalledWith({
        actorUserId: "admin_1",
        targetUserId: "user_1",
        functionalRoleIds: ["role_1", "role_2"],
      });
    });

    it("TC-6: should send correct exact success message without data payload", async () => {
      await adminController.assignUserFunctionalRolesController(req, res, next);

      expect(apiResponse.sendResponse).toHaveBeenCalledWith({
        res,
        statusCode: StatusCodes.OK,
        message: "Functional roles updated successfully. User tokens revoked to apply new permissions.",
      });
    });
  });

  describe("getUserFunctionalRolesController()", () => {
    it("TC-7: should call getUserFunctionalRoles service with correct target user ID", async () => {
      req.params.id = "user_1";
      
      await adminController.getUserFunctionalRolesController(req, res, next);

      expect(adminService.getUserFunctionalRoles).toHaveBeenCalledWith("user_1");
    });

    it("TC-8: should send correct response without message", async () => {
      const mockRoles = [{ id: "role_1", name: "Editor" }];
      adminService.getUserFunctionalRoles.mockResolvedValue(mockRoles);

      await adminController.getUserFunctionalRolesController(req, res, next);

      expect(apiResponse.sendResponse).toHaveBeenCalledWith({
        res,
        statusCode: StatusCodes.OK,
        data: mockRoles,
      });
    });
  });

  describe("getAllUsersController()", () => {
    it("TC-9: should pass exact query object to getAllUsersPaginated service", async () => {
      req.query = { page: 2, limit: 15, status: "ACTIVE" };
      adminService.getAllUsersPaginated.mockResolvedValue({ users: [], total: 0, page: 2, limit: 15, totalPages: 0 });

      await adminController.getAllUsersController(req, res, next);

      expect(adminService.getAllUsersPaginated).toHaveBeenCalledWith(req.query);
    });

    it("TC-10: should correctly map users and pagination data into API response structure", async () => {
      const serviceResult = {
        users: [{ id: "u1" }, { id: "u2" }],
        total: 25,
        page: 2,
        limit: 10,
        totalPages: 3,
      };
      adminService.getAllUsersPaginated.mockResolvedValue(serviceResult);

      await adminController.getAllUsersController(req, res, next);

      expect(apiResponse.sendResponse).toHaveBeenCalledWith({
        res,
        statusCode: StatusCodes.OK,
        message: "Users retrieved successfully",
        data: serviceResult.users,
        meta: {
          total: 25,
          page: 2,
          limit: 10,
          totalPages: 3,
        },
      });
    });
  });

  describe("inviteAdminController()", () => {
    it("TC-11: should correctly map body payload and inviterId for admin invitation", async () => {
      req.body = {
        name: "New Admin",
        email: "admin@example.com",
        systemRoleSlug: "ADMIN",
        functionalRoleIds: ["role_1"],
      };

      await adminController.inviteAdminController(req, res, next);

      expect(adminService.inviteAdminUser).toHaveBeenCalledWith({
        name: "New Admin",
        email: "admin@example.com",
        systemRoleSlug: "ADMIN",
        functionalRoleIds: ["role_1"],
        inviterId: "admin_1", // From req.user.id
      });
    });

    it("TC-12: should return 201 CREATED status with proper message", async () => {
      await adminController.inviteAdminController(req, res, next);

      expect(apiResponse.sendResponse).toHaveBeenCalledWith({
        res,
        statusCode: StatusCodes.CREATED,
        message: "Invitation sent successfully.",
      });
    });
  });

  describe("getUserDetailsController()", () => {
    it("TC-13: should call getUserDetailedProfile with correct user ID", async () => {
      req.params.id = "user_1";
      await adminController.getUserDetailsController(req, res, next);

      expect(adminService.getUserDetailedProfile).toHaveBeenCalledWith("user_1");
    });

    it("TC-14: should return correct response without extra message", async () => {
      const mockDetails = { id: "user_1", name: "John Doe", permissionsList: [] };
      adminService.getUserDetailedProfile.mockResolvedValue(mockDetails);

      await adminController.getUserDetailsController(req, res, next);

      expect(apiResponse.sendResponse).toHaveBeenCalledWith({
        res,
        statusCode: StatusCodes.OK,
        data: mockDetails,
      });
    });
  });

  describe("revokeSessionsController()", () => {
    it("TC-15: should call revokeUserSessions with correct user ID", async () => {
      req.params.id = "user_1";
      adminService.revokeUserSessions.mockResolvedValue({ message: "Terminated" });

      await adminController.revokeSessionsController(req, res, next);

      expect(adminService.revokeUserSessions).toHaveBeenCalledWith("user_1");
    });

    it("TC-16: should use the message returned from the service in the response", async () => {
      const serviceMessage = "All active sessions for this user have been terminated.";
      adminService.revokeUserSessions.mockResolvedValue({ message: serviceMessage });

      await adminController.revokeSessionsController(req, res, next);

      expect(apiResponse.sendResponse).toHaveBeenCalledWith({
        res,
        statusCode: StatusCodes.OK,
        message: serviceMessage,
      });
    });
  });

  describe("cancelInviteController()", () => {
    it("TC-17: should throw 400 AppError if email is missing in request body", async () => {
      req.body = {}; // Email is missing
      
      await adminController.cancelInviteController(req, res, next);

      // Verify that asyncHandler catches the explicitly thrown AppError and calls next(error)
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const errorArg = next.mock.calls[0][0];
      expect(errorArg.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(errorArg.message).toBe("Email is required to cancel an invitation.");
      
      expect(adminService.cancelInvitation).not.toHaveBeenCalled();
      expect(apiResponse.sendResponse).not.toHaveBeenCalled();
    });

    it("TC-18: should call cancelInvitation service with correct email", async () => {
      req.body = { email: "john@example.com" };
      adminService.cancelInvitation.mockResolvedValue({ message: "Cancelled" });

      await adminController.cancelInviteController(req, res, next);

      expect(adminService.cancelInvitation).toHaveBeenCalledWith("john@example.com");
    });

    it("TC-19: should return success response using message from service result", async () => {
      req.body = { email: "john@example.com" };
      const serviceMessage = "Invitation cancelled and pending account removed successfully.";
      adminService.cancelInvitation.mockResolvedValue({ message: serviceMessage });

      await adminController.cancelInviteController(req, res, next);

      expect(apiResponse.sendResponse).toHaveBeenCalledWith({
        res,
        statusCode: StatusCodes.OK,
        message: serviceMessage,
      });
    });
  });
});