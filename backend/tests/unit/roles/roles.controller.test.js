import { describe, it, expect, vi, beforeEach } from "vitest";
import * as controller from "../../../src/modules/roles/roles.controller.js";
import * as roleService from "../../../src/modules/roles/roles.service.js";

// Mock the service layer explicitly
vi.mock("../../../src/modules/roles/roles.service.js", () => ({
  createRole: vi.fn(),
  updateRole: vi.fn(),
  deleteRole: vi.fn(),
  getAllRoles: vi.fn(),
  getRoleDetails: vi.fn(),
  getSystemPermissions: vi.fn(),
}));

// Helper to wait for the microtask queue to clear
// because asyncHandler does not return the promise chain directly
const flushPromises = () => new Promise(setImmediate);

const mockResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body = {}, params = {}, query = {}) => ({
  body,
  params,
  query,
});

const mockNext = () => vi.fn();

describe("Roles Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createRoleController", () => {
    it("TC-01: should create a role successfully", async () => {
      const mockRole = { id: "role_1", name: "Admin" };
      roleService.createRole.mockResolvedValue(mockRole);

      const req = mockRequest({ name: "Admin" });
      const res = mockResponse();
      const next = mockNext();

      controller.createRoleController(req, res, next);
      await flushPromises();

      expect(roleService.createRole).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201); // 201 Created
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Functional role created successfully.",
        data: mockRole,
        meta: null,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("TC-02: should forward a service error to next", async () => {
      const error = new Error("Service Error");
      roleService.createRole.mockRejectedValue(error);

      const req = mockRequest({ name: "Admin" });
      const res = mockResponse();
      const next = mockNext();

      controller.createRoleController(req, res, next);
      await flushPromises();

      expect(roleService.createRole).toHaveBeenCalledWith(req.body);
      expect(next).toHaveBeenCalledWith(error); // Error forwarded to globalErrorHandler
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("updateRoleController", () => {
    it("TC-03: should update a role successfully", async () => {
      const mockRole = { id: "role_1", name: "Updated Admin" };
      roleService.updateRole.mockResolvedValue(mockRole);

      const req = mockRequest({ name: "Updated Admin" }, { id: "role_1" });
      const res = mockResponse();
      const next = mockNext();

      controller.updateRoleController(req, res, next);
      await flushPromises();

      expect(roleService.updateRole).toHaveBeenCalledWith("role_1", req.body);
      expect(res.status).toHaveBeenCalledWith(200); // 200 OK
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Functional role updated successfully.",
        data: mockRole,
        meta: null,
      });
    });
  });

  describe("deleteRoleController", () => {
    it("TC-04: should delete a role successfully", async () => {
      roleService.deleteRole.mockResolvedValue(undefined);

      const req = mockRequest({}, { id: "role_1" });
      const res = mockResponse();
      const next = mockNext();

      controller.deleteRoleController(req, res, next);
      await flushPromises();

      expect(roleService.deleteRole).toHaveBeenCalledWith("role_1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Functional role deleted successfully.",
        data: null, // sendResponse defaults data to null
        meta: null,
      });
    });
  });

  describe("getAllRolesController", () => {
    it("TC-05: should retrieve all roles", async () => {
      const mockRoles = [{ id: "role_1" }, { id: "role_2" }];
      roleService.getAllRoles.mockResolvedValue(mockRoles);

      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext();

      controller.getAllRolesController(req, res, next);
      await flushPromises();

      expect(roleService.getAllRoles).toHaveBeenCalledWith(); // Called without arguments
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Roles retrieved successfully.",
        data: mockRoles,
        meta: null,
      });
    });
  });

  describe("getRoleDetailsController", () => {
    it("TC-06: should retrieve one role's details", async () => {
      const mockRole = { id: "role_1", permissions: ["perm_1"] };
      roleService.getRoleDetails.mockResolvedValue(mockRole);

      const req = mockRequest({}, { id: "role_1" });
      const res = mockResponse();
      const next = mockNext();

      controller.getRoleDetailsController(req, res, next);
      await flushPromises();

      expect(roleService.getRoleDetails).toHaveBeenCalledWith("role_1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Role details retrieved successfully.",
        data: mockRole,
        meta: null,
      });
    });
  });

  describe("getSystemPermissionsController", () => {
    it("TC-07: should retrieve system permissions", async () => {
      const mockPermissions = { USERS: [{ id: "perm_1" }] };
      roleService.getSystemPermissions.mockResolvedValue(mockPermissions);

      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext();

      controller.getSystemPermissionsController(req, res, next);
      await flushPromises();

      expect(roleService.getSystemPermissions).toHaveBeenCalledWith(); // Called without arguments
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "System permissions retrieved successfully.",
        data: mockPermissions,
        meta: null,
      });
    });
  });
});