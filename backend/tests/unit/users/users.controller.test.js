import { describe, it, expect, vi, beforeEach } from "vitest";
import { getMyProfileController, updateMyProfileController } from "../../../src/modules/users/users.controller.js";
import * as usersService from "../../../src/modules/users/users.service.js";
import * as apiResponse from "../../../src/shared/utils/apiResponse.js";
import { StatusCodes } from "http-status-codes";

// Mocking dependencies
vi.mock("../../../src/modules/users/users.service.js");
vi.mock("../../../src/shared/utils/apiResponse.js");

describe("Users Controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup Express mock objects
    req = {
      user: { id: "user_1" },
      body: {}
    };
    res = {}; // sendResponse handles the actual methods (status, json) in real implementation
    next = vi.fn();
  });

  describe("getMyProfileController()", () => {
    it("TC-1: should call getMyProfile service with correct user ID", async () => {
      usersService.getMyProfile.mockResolvedValue({ id: "user_1", name: "John Doe" });
      
      await getMyProfileController(req, res, next);
      
      expect(usersService.getMyProfile).toHaveBeenCalledWith("user_1");
      expect(usersService.getMyProfile).toHaveBeenCalledTimes(1);
    });

    it("TC-2: should send correct success response with fetched profile data", async () => {
      const mockProfile = { id: "user_1", name: "John Doe" };
      usersService.getMyProfile.mockResolvedValue(mockProfile);
      
      await getMyProfileController(req, res, next);
      
      expect(apiResponse.sendResponse).toHaveBeenCalledWith({
        res,
        statusCode: StatusCodes.OK,
        message: "Profile fetched successfully",
        data: mockProfile
      });
    });

    it("TC-3: should pass service errors to next() for global error handling", async () => {
      const error = new Error("User not found");
      usersService.getMyProfile.mockRejectedValue(error);
      
      await getMyProfileController(req, res, next);
      
      expect(next).toHaveBeenCalledWith(error);
      expect(apiResponse.sendResponse).not.toHaveBeenCalled();
    });
  });

  describe("updateMyProfileController()", () => {
    it("TC-4: should call updateMyProfile service with correct user ID and payload", async () => {
      req.body = { name: "Jane Doe", avatar: "new.jpg" };
      usersService.updateMyProfile.mockResolvedValue({});
      
      await updateMyProfileController(req, res, next);
      
      expect(usersService.updateMyProfile).toHaveBeenCalledWith({
        userId: "user_1",
        payload: { name: "Jane Doe", avatar: "new.jpg" }
      });
      expect(usersService.updateMyProfile).toHaveBeenCalledTimes(1);
    });

    it("TC-5: should send correct success response with updated profile data", async () => {
      const updatedProfile = { id: "user_1", name: "Jane Doe", avatar: "new.jpg" };
      req.body = { name: "Jane Doe", avatar: "new.jpg" };
      usersService.updateMyProfile.mockResolvedValue(updatedProfile);
      
      await updateMyProfileController(req, res, next);
      
      expect(apiResponse.sendResponse).toHaveBeenCalledWith({
        res,
        statusCode: StatusCodes.OK,
        message: "Profile updated successfully",
        data: updatedProfile
      });
    });

    it("TC-6: should pass service errors to next() for global error handling during update", async () => {
      const error = new Error("Database update failed");
      usersService.updateMyProfile.mockRejectedValue(error);
      
      await updateMyProfileController(req, res, next);
      
      expect(next).toHaveBeenCalledWith(error);
      expect(apiResponse.sendResponse).not.toHaveBeenCalled();
    });
  });
});