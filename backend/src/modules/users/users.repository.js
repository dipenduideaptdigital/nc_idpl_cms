import { prisma } from "../../config/db.js";

export const findCurrentUserProfile = async (id, include) => {
  return prisma.user.findUnique({
    where: { id },
    include,
  });
};

export const updateCurrentUserProfile = async ({ userId, data, include }) => {
  return prisma.user.update({
    where: { id: userId },
    data,
    include,
  });
};