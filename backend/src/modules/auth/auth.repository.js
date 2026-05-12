import { prisma } from "../../config/db.js";

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      role: true,
    },
  });
};

export const createUser = async (data) => {
  return prisma.user.create({
    data,
  });
};

export const createRefreshToken = async (data) => {
  return prisma.refreshToken.create({
    data,
  });
};