import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/db.js";
import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";
import { AppError } from "../../shared/errors/AppError.js";

import {
  findUserByEmail,
  findUserById,
  revokeRefreshToken,
  revokeAllUserTokens,
  findValidRefreshToken,
  createPasswordResetToken,
  findValidPasswordResetToken,
  findRecentPasswordResetToken,
} from "./auth.repository.js";

import { hashPassword, comparePassword } from "../../shared/utils/password.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../shared/utils/jwt.js";

import { hashToken } from "../../shared/utils/tokenHash.js";
import { generateSecureToken, hashSecureToken } from "../../shared/utils/secureToken.js";
import { sanitizeUser } from "../../shared/utils/sanitizeUser.js";
import { normalizeEmail } from "../../shared/utils/normalizeEmail.js";
import { sendEmail } from "../../shared/services/email.service.js";
import { passwordResetTemplate } from "../../shared/templates/passwordReset.template.js";
import {AUTH_BASIC_USER_INCLUDE} from "./auth.constants.js";

const REFRESH_TOKEN_EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000;

const login = async ({ email, password, allowedRoles = [] }) => {
  // Normalize email
  const normalizedEmail = normalizeEmail(email);

  // Find user
  const user = await findUserByEmail(
  normalizedEmail,
  AUTH_BASIC_USER_INCLUDE
);

  // Invalid user
  if (!user) {
    throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
  }

  // Account status checks
  if (user.status === "PENDING") {
    throw new AppError("Account activation pending", StatusCodes.FORBIDDEN);
  }

  if (user.status === "SUSPENDED") {
    throw new AppError("Account suspended", StatusCodes.FORBIDDEN);
  }

  if (user.status === "INACTIVE") {
    throw new AppError("Account inactive", StatusCodes.FORBIDDEN);
  }

  // Password validation
  const isPasswordMatched = await comparePassword(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
  }

  // Role validation
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.systemRole.slug)) {
    throw new AppError("Access denied", StatusCodes.FORBIDDEN);
  }

  // Access token
  const accessToken = generateAccessToken({
    userId: user.id,
    systemRole: user.systemRole.slug,
  });

  // Refresh token
  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  // Hash refresh token
  const refreshTokenHash = hashToken(refreshToken);

  // Transactional session write
  await prisma.$transaction([
    prisma.refreshToken.create({
      data: {
        tokenHash: refreshTokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_MS),
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

  // Sanitize user
  const safeUser = sanitizeUser(user);

  return {
    accessToken,
    refreshToken,
    user: safeUser,
  };
};

// User registration
export const registerUser = async (payload) => {
  const normalizedEmail = normalizeEmail(payload.email);

  // Check existing user
  const existingUser = await findUserByEmail(
  normalizedEmail,
  AUTH_BASIC_USER_INCLUDE
);

  if (existingUser) {
    throw new AppError("Email already exists", StatusCodes.BAD_REQUEST);
  }

  // Find default user role
  const userSystemRole = await prisma.systemRole.findUnique({
    where: {
      slug: "USER",
    },
  });

  if (!userSystemRole) {
    throw new AppError("Default user role not configured", StatusCodes.INTERNAL_SERVER_ERROR);
  }

  // Hash password
  const hashedPassword = await hashPassword(payload.password);

  try {
    // Create user
    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: normalizedEmail,
        password: hashedPassword,
        systemRoleId: userSystemRole.id,
        status: "ACTIVE",
        isEmailVerified: false,
      },
      include: {
        systemRole: true,
      },
    });

    return sanitizeUser(user);
  } catch (error) {
    if (error.code === "P2002") {
      throw new AppError("Email already exists", StatusCodes.BAD_REQUEST);
    }
    throw error;
  }
};

// User login
export const loginUser = async (payload) => {
  return login({
    email: payload.email,
    password: payload.password,
    allowedRoles: [],
  });
};

// Admin login
export const adminLogin = async (payload) => {
  return login({
    email: payload.email,
    password: payload.password,
    allowedRoles: ["SUPER_ADMIN", "ADMIN"],
  });
};

// Refresh access token
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token missing", StatusCodes.UNAUTHORIZED);
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError("Invalid refresh token", StatusCodes.UNAUTHORIZED);
  }

  const tokenHash = hashToken(refreshToken);
  const storedToken = await findValidRefreshToken(tokenHash);

  // Token reuse detection
  if (!storedToken) {
    await revokeAllUserTokens(decoded.userId);
    throw new AppError("Refresh token reuse detected", StatusCodes.UNAUTHORIZED);
  }

  const user = storedToken.user;

  // User validation
  if (!user) {
    throw new AppError("User not found", StatusCodes.UNAUTHORIZED);
  }

  if (user.status !== "ACTIVE") {
    throw new AppError("Account inactive", StatusCodes.FORBIDDEN);
  }

  // Generate new access token
  const accessToken = generateAccessToken({
    userId: user.id,
    systemRole: user.systemRole.slug,
  });

  return {
    accessToken,
  };
};

// Logout current device
export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  const tokenHash = hashToken(refreshToken);
  await revokeRefreshToken(tokenHash);
};

// Logout all devices
export const logoutAllDevices = async (userId) => {
  await revokeAllUserTokens(userId);
};

// Forgot password
export const forgotPassword = async (email) => {
  // Normalize email
  const normalizedEmail = normalizeEmail(email);

  // Find user
  const user = await findUserByEmail(
  normalizedEmail,
  AUTH_BASIC_USER_INCLUDE
);

  // Silent success to prevent email enumeration
  if (!user) {
    return;
  }

  // Email-based cooldown to prevent reset flooding
  const recentResetRequest = await findRecentPasswordResetToken(user.id);

  if (recentResetRequest) {
    return;
  }

  // Generate raw token
  const rawToken = generateSecureToken();

  // Hash token
  const tokenHash = hashSecureToken(rawToken);

  // Expiration
  const expiresAt = new Date(
    Date.now() + Number(env.PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES) * 60 * 1000
  );

  // Invalidate old tokens but keep history
  await prisma.passwordResetToken.updateMany({
    where: {
      userId: user.id,
      usedAt: null,
    },
    data: {
      usedAt: new Date(),
    },
  });

  // Store reset token
  await createPasswordResetToken({
    tokenHash,
    userId: user.id,
    expiresAt,
  });

  // Reset URL
  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${rawToken}`;

  // Template
  const html = passwordResetTemplate({
    resetUrl,
    expiresInMinutes: env.PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES,
  });

  // Send email (non-blocking)
  void sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    html,
  }).catch((error) => {
    logger.error({
      message: "Password reset email failed",
      email: user.email,
      error: error.message,
    });
  });
};

// Reset password
export const resetPassword = async ({ token, password }) => {
  const tokenHash = hashSecureToken(token);
  const storedToken = await findValidPasswordResetToken(tokenHash);

  if (!storedToken) {
    throw new AppError("Invalid or expired reset token", StatusCodes.BAD_REQUEST);
  }

  const user = storedToken.user;

  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  if (user.status !== "ACTIVE") {
    throw new AppError("Account inactive", StatusCodes.FORBIDDEN);
  }

  const isSamePassword = await comparePassword(password, user.password);

  if (isSamePassword) { 
    throw new AppError(
    "New password must be different from current password",
    StatusCodes.BAD_REQUEST
  );
}

  const hashedPassword = await hashPassword(password);

  const now = new Date();

  // Transactional reset flow
  await prisma.$transaction([
    // Update password
    prisma.user.update({
      where: { id: storedToken.userId },
      data: { password: hashedPassword },
    }),

    // Invalidate all active reset tokens
    prisma.passwordResetToken.updateMany({
      where: {
        userId: storedToken.userId,
        usedAt: null,
      },
      data: { usedAt: now },
    }),

    // Revoke all active sessions
    prisma.refreshToken.updateMany({
      where: {
        userId: storedToken.userId,
        revokedAt: null,
      },
      data: { revokedAt: now },
    }),
  ]);
};

export const changePassword = async ({ userId, currentPassword, newPassword }) => {
  // Find user
  const user = await findUserById(userId, AUTH_BASIC_USER_INCLUDE);

  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  // Account status validation
  if (user.status !== "ACTIVE") {
    throw new AppError("Account inactive", StatusCodes.FORBIDDEN);
  }

  // Verify current password
  const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);

  if (!isCurrentPasswordValid) {
    throw new AppError("Current password is incorrect", StatusCodes.BAD_REQUEST);
  }

  // Prevent password reuse
  const isSamePassword = await comparePassword(newPassword, user.password);

  if (isSamePassword) {
    throw new AppError(
      "New password must be different from current password",
      StatusCodes.BAD_REQUEST
    );
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  const now = new Date();

  // Transactional security update
  await prisma.$transaction([
    // Update password
    prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    }),

    // Revoke all active sessions
    prisma.refreshToken.updateMany({
      where: {
        userId: user.id,
        revokedAt: null,
      },
      data: { revokedAt: now },
    }),

    // Invalidate active password reset tokens
    prisma.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        usedAt: null,
      },
      data: { usedAt: now },
    }),
  ]);

  return true;
};