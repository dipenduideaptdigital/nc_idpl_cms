import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/db.js";
import { AppError } from "../../shared/errors/AppError.js";

import {
  findUserByEmail,
  revokeRefreshToken,
  revokeAllUserTokens,
  findValidRefreshToken,
} from "./auth.repository.js";

import {
  hashPassword,
  comparePassword,
} from "../../shared/utils/password.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../shared/utils/jwt.js";

import { hashToken } from "../../shared/utils/tokenHash.js";
import { sanitizeUser } from "../../shared/utils/sanitizeUser.js";
import { normalizeEmail } from "../../shared/utils/normalizeEmail.js";

const REFRESH_TOKEN_EXPIRES_IN_MS =
  7 * 24 * 60 * 60 * 1000;

const login = async ({
  email,
  password,
  allowedRoles = [],
}) => {
  // NORMALIZE EMAIL
  const normalizedEmail =
    normalizeEmail(email);

  // FIND USER
  const user =
    await findUserByEmail(
      normalizedEmail
    );

  // INVALID USER
  if (!user) {
    throw new AppError(
      "Invalid credentials",
      StatusCodes.UNAUTHORIZED
    );
  }

  // ACCOUNT STATUS CHECKS
  if (user.status === "PENDING") {
    throw new AppError(
      "Account activation pending",
      StatusCodes.FORBIDDEN
    );
  }

  if (user.status === "SUSPENDED") {
    throw new AppError(
      "Account suspended",
      StatusCodes.FORBIDDEN
    );
  }

  if (user.status === "INACTIVE") {
    throw new AppError(
      "Account inactive",
      StatusCodes.FORBIDDEN
    );
  }

  // PASSWORD VALIDATION
  const isPasswordMatched =
    await comparePassword(
      password,
      user.password
    );

  if (!isPasswordMatched) {
    throw new AppError(
      "Invalid credentials",
      StatusCodes.UNAUTHORIZED
    );
  }

  // ROLE VALIDATION
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(
      user.systemRole.slug
    )
  ) {
    throw new AppError(
      "Access denied",
      StatusCodes.FORBIDDEN
    );
  }

  // ACCESS TOKEN
  const accessToken =
    generateAccessToken({
      userId: user.id,

      systemRole:
        user.systemRole.slug,
    });

  // REFRESH TOKEN
  const refreshToken =
    generateRefreshToken({
      userId: user.id,
    });

  // HASH REFRESH TOKEN
  const refreshTokenHash =
    hashToken(refreshToken);

  // TRANSACTIONAL SESSION WRITE
  await prisma.$transaction([
    prisma.refreshToken.create({
      data: {
        tokenHash:
          refreshTokenHash,

        userId: user.id,
        expiresAt: new Date(
          Date.now() +
            REFRESH_TOKEN_EXPIRES_IN_MS
        ),
      },
    }),

    prisma.user.update({
      where: {
        id: user.id,
      },

      data: {
        lastLoginAt: new Date(),
      },
    }),
  ]);

  // SANITIZE USER
  const safeUser =
    sanitizeUser(user);

  return {
    accessToken,
    refreshToken,
    user: safeUser,
  };
};

export const registerUser = async (
  payload
) => {
  // NORMALIZE EMAIL
  const normalizedEmail =
    normalizeEmail(payload.email);

  // CHECK EXISTING USER
  const existingUser =
    await findUserByEmail(
      normalizedEmail
    );

  if (existingUser) {
    throw new AppError(
      "Email already exists",
      StatusCodes.BAD_REQUEST
    );
  }

  // FIND DEFAULT USER ROLE
  const userSystemRole =
    await prisma.systemRole.findUnique({
      where: {
        slug: "USER",
      },
    });

  if (!userSystemRole) {
    throw new AppError(
      "Default user role not configured",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  // HASH PASSWORD
  const hashedPassword =
    await hashPassword(
      payload.password
    );

  // CREATE USER
  const user =
    await prisma.user.create({
      data: {
        name: payload.name,
        email: normalizedEmail,
        password: hashedPassword,
        systemRoleId:
          userSystemRole.id,

        status: "ACTIVE",
        isEmailVerified: false,
      },

      include: {
        systemRole: true,
      },
    });

  // SANITIZE USER
  const safeUser =
    sanitizeUser(user);

  return safeUser;
};

export const loginUser = async (
  payload
) => {
  return login({
    email: payload.email,
    password: payload.password,
    allowedRoles: [],
  });
};

export const adminLogin = async (
  payload
) => {
  return login({
    email: payload.email,
    password: payload.password,
    allowedRoles: [
      "SUPER_ADMIN",
      "ADMIN",
    ],
  });
};

export const refreshAccessToken =
  async (refreshToken) => {
    // MISSING TOKEN

    if (!refreshToken) {
      throw new AppError(
        "Refresh token missing",
        StatusCodes.UNAUTHORIZED
      );
    }

    let decoded;

    // VERIFY TOKEN

    try {
      decoded =
        verifyRefreshToken(
          refreshToken
        );
    } catch {
      throw new AppError(
        "Invalid refresh token",
        StatusCodes.UNAUTHORIZED
      );
    }

    // HASH TOKEN
    const tokenHash =
      hashToken(refreshToken);

    // FIND VALID TOKEN
    const storedToken =
      await findValidRefreshToken(
        tokenHash
      );

    // TOKEN REUSE DETECTION
    if (!storedToken) {
      await revokeAllUserTokens(
        decoded.userId
      );

      throw new AppError(
        "Refresh token reuse detected",
        StatusCodes.UNAUTHORIZED
      );
    }

    const user = storedToken.user;

    // USER VALIDATION
    if (!user) {
      throw new AppError(
        "User not found",
        StatusCodes.UNAUTHORIZED
      );
    }

    if (user.status !== "ACTIVE") {
      throw new AppError(
        "Account inactive",
        StatusCodes.FORBIDDEN
      );
    }

    // GENERATE NEW ACCESS TOKEN
    const accessToken =
      generateAccessToken({
        userId: user.id,

        systemRole:
          user.systemRole.slug,
      });

    return {
      accessToken,
    };
  };

export const logoutUser = async (
  refreshToken
) => {
  if (!refreshToken) {
    return;
  }

  const tokenHash =
    hashToken(refreshToken);

  await revokeRefreshToken(
    tokenHash
  );
};

export const logoutAllDevices =
  async (userId) => {
    await revokeAllUserTokens(
      userId
    );
  };