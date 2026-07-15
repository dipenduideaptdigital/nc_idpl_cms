import { prisma } from "../../config/db.js";
import {AUTH_BASIC_USER_INCLUDE, AUTH_RBAC_USER_INCLUDE} from "./auth.constants.js";
export const findUserById = async (id, include = AUTH_BASIC_USER_INCLUDE) => {
    return prisma.user.findUnique({
      where: {
        id,
      },
      include,
    });
  };

  export const findUserByEmail =
  async (email,include = AUTH_BASIC_USER_INCLUDE) => {
    return prisma.user.findUnique({
      where: {
        email,
      },

      include,
    });
  };

export const revokeRefreshToken = async (tokenHash) => {
  return prisma.refreshToken.updateMany({
    where: {
      tokenHash,
      revokedAt: null,
    },
    data: { revokedAt: new Date() },
  });
};

export const revokeAllUserTokens = async (userId) => {
  return prisma.refreshToken.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: { revokedAt: new Date() },
  });
};

export const findValidRefreshToken = async (tokenHash) => {
  return prisma.refreshToken.findFirst({
    where: {
      tokenHash,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: {
      user: {
        include: { systemRole: true },
      },
    },
  });
};

export const createPasswordResetToken = async (data) => {
  return prisma.passwordResetToken.create({ data });
};

export const findValidPasswordResetToken = async (tokenHash) => {
  return prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: {
      user: {
        include: { systemRole: true },
      },
    },
  });
};

export const markPasswordResetTokenUsed = async (id) => {
  return prisma.passwordResetToken.update({
    where: { id },
    data: { usedAt: new Date() },
  });
};

export const findRecentPasswordResetToken = async (userId, minutes = 3) => {
  const threshold = new Date(Date.now() - minutes * 60 * 1000);

  return prisma.passwordResetToken.findFirst({
    where: {
      userId,
      createdAt: { gt: threshold },
    },
    orderBy: { createdAt: "desc" },
  });
};
