import { StatusCodes } from "http-status-codes";

import { AppError } from "../../shared/errors/AppError.js";

import {
  findUserByEmail,
  createUser,
  createRefreshToken,
} from "./auth.repository.js";

import {
  hashPassword,
  comparePassword,
} from "../../shared/utils/password.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../shared/utils/jwt.js";

export const registerUser = async (payload) => {
  const existingUser = await findUserByEmail(
    payload.email
  );

  if (existingUser) {
    throw new AppError(
      "Email already exists",
      StatusCodes.BAD_REQUEST
    );
  }

  const hashedPassword = await hashPassword(
    payload.password
  );

  const user = await createUser({
    ...payload,
    password: hashedPassword,

    role: {
      connect: {
        slug: "user",
      },
    },
  });

  return user;
};

export const loginUser = async (payload) => {
  const user = await findUserByEmail(
    payload.email
  );

  if (!user) {
    throw new AppError(
      "Invalid credentials",
      StatusCodes.UNAUTHORIZED
    );
  }

  const isPasswordMatched =
    await comparePassword(
      payload.password,
      user.password
    );

  if (!isPasswordMatched) {
    throw new AppError(
      "Invalid credentials",
      StatusCodes.UNAUTHORIZED
    );
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role.slug,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  await createRefreshToken({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ),
  });

  return {
    accessToken,
    refreshToken,
    user,
  };
};