import { StatusCodes } from "http-status-codes";
import { AppError } from "../../shared/errors/AppError.js";
import { findCurrentUserProfile, updateCurrentUserProfile } from "./users.repository.js";
import { USER_PROFILE_INCLUDE } from "./users.constants.js";
import { serializeProfile } from "../../shared/utils/serializeProfile.js";

export const getMyProfile = async (userId) => {
  // Find current user
  const user = await findCurrentUserProfile(userId, USER_PROFILE_INCLUDE);

  // User not found
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  // Account status validation
  if (user.status !== "ACTIVE") {
    throw new AppError("Account inactive", StatusCodes.FORBIDDEN);
  }

  // Serialize safe profile
  return serializeProfile(user);
};

export const updateMyProfile = async ({ userId, payload }) => {
  // Find existing user
  const existingUser = await findCurrentUserProfile(userId, USER_PROFILE_INCLUDE);

  // User not found
  if (!existingUser) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  // Account status validation
  if (existingUser.status !== "ACTIVE") {
    throw new AppError("Account inactive", StatusCodes.FORBIDDEN);
  }

  // Allow-list update fields
  const updateData = {};

  // Name
  if (payload.name !== undefined) {
    updateData.name = payload.name.trim();
  }

  // Avatar
  if (payload.avatar !== undefined) {
    updateData.avatar = payload.avatar;
  }

  // Check if any actual change exists
  const hasChanges =
    (updateData.name !== undefined && updateData.name !== existingUser.name) ||
    (updateData.avatar !== undefined && updateData.avatar !== existingUser.avatar);

  // No changes
  if (!hasChanges) {
    return serializeProfile(existingUser);
  }

  // Update profile
  const updatedUser = await updateCurrentUserProfile({
    userId,
    data: updateData,
    include: USER_PROFILE_INCLUDE,
  });

  // TODO: Create audit log entry for profile update

  // Serialize safe profile
  return serializeProfile(updatedUser);
};