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
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../shared/utils/jwt.js";
import { hashToken } from "../../shared/utils/tokenHash.js";
import { generateSecureToken, hashSecureToken } from "../../shared/utils/secureToken.js";
import { sanitizeUser } from "../../shared/utils/sanitizeUser.js";
import { normalizeEmail } from "../../shared/utils/normalizeEmail.js";
import { sendEmail } from "../../shared/services/email.service.js";
import { passwordResetTemplate } from "../../shared/templates/passwordReset.template.js";
import { AUTH_BASIC_USER_INCLUDE } from "./auth.constants.js";
import { verifyRecaptchaToken } from "../../shared/services/recaptcha.service.js";

const REFRESH_TOKEN_EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000;

const getUserPermissions = async (userId) => {
  const userRoles = await prisma.userFunctionalRole.findMany({
    where: { userId },
    include: {
      functionalRole: {
        include: {
          permissions: {
            include: { permission: true }
          }
        }
      }
    }
  });

  return Array.from(new Set(
    userRoles.flatMap(ufr => 
      ufr.functionalRole.permissions.map(p => p.permission.slug)
    )
  ));
};

const login = async ({ email, password, recaptchaToken, clientIp, allowedRoles = [] }) => {
  
  // if (recaptchaToken) {
  //   await verifyRecaptchaToken(recaptchaToken, clientIp);
  // }

  const normalizedEmail = normalizeEmail(email);

  const user = await findUserByEmail(normalizedEmail, AUTH_BASIC_USER_INCLUDE);

  if (!user) {
    throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
  }

  // Account status checks
  if (user.status === "PENDING") throw new AppError("Account activation pending", StatusCodes.FORBIDDEN);
  if (user.status === "SUSPENDED") throw new AppError("Account suspended", StatusCodes.FORBIDDEN);
  if (user.status === "INACTIVE") throw new AppError("Account inactive", StatusCodes.FORBIDDEN);

  const isPasswordMatched = await comparePassword(password, user.password);
  if (!isPasswordMatched) {
    throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.systemRole.slug)) {
    if (["SUPER_ADMIN", "ADMIN"].includes(user.systemRole.slug)) {
      throw new AppError("Access denied. Admins must use the dedicated Admin Portal to sign in.", StatusCodes.FORBIDDEN);
    }
    throw new AppError("Access denied. Invalid role for this portal.", StatusCodes.FORBIDDEN);
  }

  const userPermissionsArray = await getUserPermissions(user.id);

  const accessToken = generateAccessToken({ 
    userId: user.id, 
    systemRole: user.systemRole.slug,
    permissions: userPermissionsArray 
  });
  
  const refreshToken = generateRefreshToken({ userId: user.id });
  const refreshTokenHash = hashToken(refreshToken);

  await prisma.$transaction([
    prisma.refreshToken.create({
      data: {
        tokenHash: refreshTokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_MS),
      },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    }),
  ]);

  return {
    accessToken,
    refreshToken,
    user: {
      ...sanitizeUser(user),
      permissions: userPermissionsArray
    },
  };
};

export const registerUser = async (payload, clientIp) => {
  // if (payload.recaptchaToken) {
  //   await verifyRecaptchaToken(payload.recaptchaToken, clientIp);
  // }

  const normalizedEmail = normalizeEmail(payload.email);

  const existingUser = await findUserByEmail(normalizedEmail, AUTH_BASIC_USER_INCLUDE);
  if (existingUser) {
    throw new AppError("Email already exists", StatusCodes.BAD_REQUEST);
  }

  const userSystemRole = await prisma.systemRole.findUnique({ where: { slug: "USER" } });
  if (!userSystemRole) {
    throw new AppError("Default user role not configured", StatusCodes.INTERNAL_SERVER_ERROR);
  }

  const hashedPassword = await hashPassword(payload.password);

  try {
    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: normalizedEmail,
        password: hashedPassword,
        systemRoleId: userSystemRole.id,
        status: "ACTIVE",
        isEmailVerified: false,
      },
      include: { systemRole: true },
    });

    return sanitizeUser(user);
  } catch (error) {
    if (error.code === "P2002") {
      throw new AppError("Email already exists", StatusCodes.BAD_REQUEST);
    }
    throw error;
  }
};

export const loginUser = async (payload, clientIp) => {
  return login({ 
    email: payload.email, 
    password: payload.password, 
    recaptchaToken: payload.recaptchaToken,
    clientIp,
    allowedRoles: ["USER"] 
  });
};

export const adminLogin = async (payload, clientIp) => {
  return login({ 
    email: payload.email, 
    password: payload.password, 
    recaptchaToken: payload.recaptchaToken,
    clientIp,
    allowedRoles: ["SUPER_ADMIN", "ADMIN"] 
  });
};

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

  if (!user) throw new AppError("User not found", StatusCodes.UNAUTHORIZED);
  if (user.status !== "ACTIVE") throw new AppError("Account inactive", StatusCodes.FORBIDDEN);

  const userPermissionsArray = await getUserPermissions(user.id);

  const accessToken = generateAccessToken({ 
    userId: user.id, 
    systemRole: user.systemRole.slug,
    permissions: userPermissionsArray 
  });

  return { accessToken };
};

// Logout current device
export const logoutUser = async (refreshToken) => {
  if (!refreshToken) return;
  const tokenHash = hashToken(refreshToken);
  await revokeRefreshToken(tokenHash);
};

// Logout all devices
export const logoutAllDevices = async (userId) => {
  await revokeAllUserTokens(userId);
};

export const forgotPassword = async (email, recaptchaToken, clientIp) => {
  // if (recaptchaToken) {
  //   await verifyRecaptchaToken(recaptchaToken, clientIp);
  // }

  const normalizedEmail = normalizeEmail(email);
  const user = await findUserByEmail(normalizedEmail, AUTH_BASIC_USER_INCLUDE);

  if (!user) return;

  const recentResetRequest = await findRecentPasswordResetToken(user.id);
  if (recentResetRequest) return;

  // Generate tokens
  const rawToken = generateSecureToken();
  const tokenHash = hashSecureToken(rawToken);
  const expiresAt = new Date(Date.now() + Number(env.PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES) * 60 * 1000);

  // Invalidate old tokens but keep history
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  // Store reset token
  await createPasswordResetToken({ tokenHash, userId: user.id, expiresAt });

  // Reset URL
  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${rawToken}`;
  const html = passwordResetTemplate({ resetUrl, expiresInMinutes: env.PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES });

  void sendEmail({ to: user.email, subject: "Password Reset Request", html }).catch((error) => {
    logger.error({ message: "Password reset email failed", email: user.email, error: error.message });
  });
};

// Reset password
export const resetPassword = async ({ token, password }) => {
  const tokenHash = hashSecureToken(token);
  const storedToken = await findValidPasswordResetToken(tokenHash);

  if (!storedToken) throw new AppError("Invalid or expired reset token", StatusCodes.BAD_REQUEST);

  const user = storedToken.user;
  if (!user) throw new AppError("User not found", StatusCodes.NOT_FOUND);
  if (user.status !== "ACTIVE") throw new AppError("Account inactive", StatusCodes.FORBIDDEN);

  const isSamePassword = await comparePassword(password, user.password);
  if (isSamePassword) {
    throw new AppError("New password must be different from current password", StatusCodes.BAD_REQUEST);
  }

  const hashedPassword = await hashPassword(password);
  const now = new Date();

  // Transactional reset flow
  await prisma.$transaction([
    prisma.user.update({
      where: { id: storedToken.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.updateMany({
      where: { userId: storedToken.userId, usedAt: null },
      data: { usedAt: now },
    }),
    prisma.refreshToken.updateMany({
      where: { userId: storedToken.userId, revokedAt: null },
      data: { revokedAt: now },
    }),
  ]);
};

// Change password
export const changePassword = async ({ userId, currentPassword, newPassword }) => {
  const user = await findUserById(userId, AUTH_BASIC_USER_INCLUDE);

  if (!user) throw new AppError("User not found", StatusCodes.NOT_FOUND);
  if (user.status !== "ACTIVE") throw new AppError("Account inactive", StatusCodes.FORBIDDEN);

  const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
  if (!isCurrentPasswordValid) throw new AppError("Current password is incorrect", StatusCodes.BAD_REQUEST);

  const isSamePassword = await comparePassword(newPassword, user.password);
  if (isSamePassword) {
    throw new AppError("New password must be different from current password", StatusCodes.BAD_REQUEST);
  }

  const hashedPassword = await hashPassword(newPassword);
  const now = new Date();

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    }),
    prisma.refreshToken.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: now },
    }),
    prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: now },
    }),
  ]);

  return true;
};

export const setupAdminAccount = async ({ token, password }) => {
  const tokenHash = hashSecureToken(token);

  const invitation = await prisma.adminInvitation.findUnique({
    where: { tokenHash },
  });

  if (!invitation) {
    throw new AppError("Invalid or corrupted invitation link.", StatusCodes.BAD_REQUEST);
  }

  if (new Date() > invitation.expiresAt) {
    throw new AppError("This invitation link has expired. Please ask the admin to resend it.", StatusCodes.GONE);
  }

  const hashedPassword = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({
      where: { email: invitation.email },
      data: {
        password: hashedPassword,
        status: "ACTIVE",      
        isEmailVerified: true,   
      },
    }),
    prisma.adminInvitation.delete({
      where: { id: invitation.id },
    }),
  ]);

  return true;
};

export const getMe = async (userId) => {
  const user = await findUserById(userId, AUTH_BASIC_USER_INCLUDE);
  
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  if (user.status !== "ACTIVE") {
    throw new AppError("Account is inactive or suspended", StatusCodes.FORBIDDEN);
  }

  const freshPermissions = await getUserPermissions(userId);

  const sanitizedUser = sanitizeUser(user);
  
  return {
    ...sanitizedUser,
    permissions: freshPermissions
  };
};