import { describe, it, expect, vi, beforeEach } from "vitest";
import { getMyProfile, updateMyProfile } from "../../../src/modules/users/users.service.js";
import * as repository from "../../../src/modules/users/users.repository.js";
import { AppError } from "../../../src/shared/errors/AppError.js";
import { USER_PROFILE_INCLUDE } from "../../../src/modules/users/users.constants.js";

// Sudhumatro repository mock kora hochhe, serializeProfile real thakbe
vi.mock("../../../src/modules/users/users.repository.js");

describe("Users Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Reusable mock user data
  const mockActiveUser = {
    id: "user_1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "old.jpg",
    status: "ACTIVE",
    isEmailVerified: true,
    systemRole: { id: "role_1", name: "User", slug: "USER" },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("getMyProfile()", () => {
    it("TC-1: should return serialized profile for an active user", async () => {
      repository.findCurrentUserProfile.mockResolvedValue(mockActiveUser);
      
      const result = await getMyProfile("user_1");
      
      expect(repository.findCurrentUserProfile).toHaveBeenCalledWith("user_1", USER_PROFILE_INCLUDE);
      expect(result.id).toBe("user_1");
      expect(result.name).toBe("John Doe");
      expect(result.status).toBe("ACTIVE");
    });

    it("TC-2: should throw 404 AppError if user does not exist", async () => {
      repository.findCurrentUserProfile.mockResolvedValue(null);
      
      await expect(getMyProfile("invalid_id")).rejects.toThrow(AppError);
      await expect(getMyProfile("invalid_id")).rejects.toMatchObject({ 
        statusCode: 404, 
        message: "User not found" 
      });
    });

    it("TC-3: should throw 403 AppError if user account is not active", async () => {
      repository.findCurrentUserProfile.mockResolvedValue({ ...mockActiveUser, status: "SUSPENDED" });
      
      await expect(getMyProfile("user_1")).rejects.toThrow(AppError);
      await expect(getMyProfile("user_1")).rejects.toMatchObject({ 
        statusCode: 403, 
        message: "Account inactive" 
      });
    });
  });

  describe("updateMyProfile()", () => {
    it("TC-4: should update and trim name successfully", async () => {
      repository.findCurrentUserProfile.mockResolvedValue(mockActiveUser);
      repository.updateCurrentUserProfile.mockResolvedValue({ ...mockActiveUser, name: "Jane Doe" });

      const result = await updateMyProfile({ 
        userId: "user_1", 
        payload: { name: "  Jane Doe  " } 
      });

      expect(repository.updateCurrentUserProfile).toHaveBeenCalledWith({
        userId: "user_1",
        data: { name: "Jane Doe" },
        include: USER_PROFILE_INCLUDE,
      });
      expect(result.name).toBe("Jane Doe");
    });

    it("TC-5: should update avatar successfully", async () => {
      repository.findCurrentUserProfile.mockResolvedValue(mockActiveUser);
      repository.updateCurrentUserProfile.mockResolvedValue({ ...mockActiveUser, avatar: "new.jpg" });

      await updateMyProfile({ 
        userId: "user_1", 
        payload: { avatar: "new.jpg" } 
      });

      expect(repository.updateCurrentUserProfile).toHaveBeenCalledWith({
        userId: "user_1",
        data: { avatar: "new.jpg" },
        include: USER_PROFILE_INCLUDE,
      });
    });

    it("TC-6: should update both name and avatar successfully", async () => {
      repository.findCurrentUserProfile.mockResolvedValue(mockActiveUser);
      repository.updateCurrentUserProfile.mockResolvedValue({ 
        ...mockActiveUser, 
        name: "Jane Doe", 
        avatar: "new.jpg" 
      });

      const result = await updateMyProfile({ 
        userId: "user_1", 
        payload: { name: "Jane Doe", avatar: "new.jpg" } 
      });

      expect(repository.updateCurrentUserProfile).toHaveBeenCalledWith({
        userId: "user_1",
        data: { name: "Jane Doe", avatar: "new.jpg" },
        include: USER_PROFILE_INCLUDE,
      });
      expect(result.name).toBe("Jane Doe");
      expect(result.avatar).toBe("new.jpg");
    });

    it("TC-7: should throw 404 if user does not exist during update", async () => {
      repository.findCurrentUserProfile.mockResolvedValue(null);
      
      await expect(updateMyProfile({ userId: "user_1", payload: { name: "Jane" } })).rejects.toThrow(AppError);
      expect(repository.updateCurrentUserProfile).not.toHaveBeenCalled();
    });

    it("TC-8: should throw 403 if user is inactive during update", async () => {
      repository.findCurrentUserProfile.mockResolvedValue({ ...mockActiveUser, status: "INACTIVE" });
      
      await expect(updateMyProfile({ userId: "user_1", payload: { name: "Jane" } })).rejects.toThrow(AppError);
      expect(repository.updateCurrentUserProfile).not.toHaveBeenCalled();
    });

    it("TC-9 & TC-11: should return existing profile without DB update if there are no actual changes", async () => {
      repository.findCurrentUserProfile.mockResolvedValue(mockActiveUser);
      
      const result = await updateMyProfile({ 
        userId: "user_1", 
        payload: { name: "John Doe", avatar: "old.jpg" } // existing datari exact copy
      });

      expect(repository.updateCurrentUserProfile).not.toHaveBeenCalled(); // DB call save hocche
      expect(result.name).toBe("John Doe");
      expect(result.avatar).toBe("old.jpg");
    });

    it("TC-12: should successfully set avatar to null", async () => {
      repository.findCurrentUserProfile.mockResolvedValue(mockActiveUser);
      repository.updateCurrentUserProfile.mockResolvedValue({ ...mockActiveUser, avatar: null });

      const result = await updateMyProfile({ userId: "user_1", payload: { avatar: null } });

      expect(repository.updateCurrentUserProfile).toHaveBeenCalledWith(
        expect.objectContaining({ data: { avatar: null } })
      );
      expect(result.avatar).toBeNull();
    });

    it("TC-14: should propagate repository update errors", async () => {
      repository.findCurrentUserProfile.mockResolvedValue(mockActiveUser);
      repository.updateCurrentUserProfile.mockRejectedValue(new Error("Database connection lost"));

      await expect(
        updateMyProfile({ userId: "user_1", payload: { name: "Jane" } })
      ).rejects.toThrow("Database connection lost");
    });
  });
});