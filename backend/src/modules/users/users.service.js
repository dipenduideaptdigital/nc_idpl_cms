import { StatusCodes } from "http-status-codes";
import { AppError } from "../../shared/errors/AppError.js";
import { findCurrentUserProfile, updateCurrentUserProfile } from "./users.repository.js";
import { USER_PROFILE_INCLUDE } from "./users.constants.js";
import { serializeProfile } from "../../shared/utils/serializeProfile.js";

export const getMyProfile = async (userId) => {
  const user = await findCurrentUserProfile(userId, USER_PROFILE_INCLUDE);
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  if (user.status !== "ACTIVE") {
    throw new AppError("Account inactive", StatusCodes.FORBIDDEN);
  }

  return serializeProfile(user);
};

export const updateMyProfile = async ({ userId, payload }) => {
  const existingUser = await findCurrentUserProfile(userId, USER_PROFILE_INCLUDE);

  if (!existingUser) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  if (existingUser.status !== "ACTIVE") {
    throw new AppError("Account inactive", StatusCodes.FORBIDDEN);
  }

  const updateData = {};

  // Name
  if (payload.name !== undefined) {
    updateData.name = payload.name.trim();
  }

  // Avatar
  if (payload.avatar !== undefined) {
    updateData.avatar = payload.avatar;
  }

  const hasChanges =
    (updateData.name !== undefined && updateData.name !== existingUser.name) ||
    (updateData.avatar !== undefined && updateData.avatar !== existingUser.avatar);

  if (!hasChanges) {
    return serializeProfile(existingUser);
  }

  const updatedUser = await updateCurrentUserProfile({
    userId,
    data: updateData,
    include: USER_PROFILE_INCLUDE,
  });


  return serializeProfile(updatedUser);
};