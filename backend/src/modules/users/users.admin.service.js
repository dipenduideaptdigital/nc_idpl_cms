import { StatusCodes } from "http-status-codes";
import { AppError } from "../../shared/errors/AppError.js";
import { prisma } from "../../config/db.js";
import { canManageUser, canAssignRole } from "../../shared/utils/accessControl.js";

export const changeUserStatus = async ({ actorUserId, targetUserId, newStatus }) => {
  // Prevent self-lockout
  if (actorUserId === targetUserId) {
    throw new AppError("You cannot modify your own status", StatusCodes.FORBIDDEN);
  }

  const actor = await prisma.user.findUnique({ where: { id: actorUserId }, include: { systemRole: true } });
  const target = await prisma.user.findUnique({ where: { id: targetUserId }, include: { systemRole: true } });

  if (!target || !actor) throw new AppError("User not found", StatusCodes.NOT_FOUND);

  // Hierarchy Check
  if (!canManageUser(actor.systemRole.slug, target.systemRole.slug)) {
    throw new AppError("Insufficient privileges to modify this user", StatusCodes.FORBIDDEN);
  }

  // TODO: Add audit log (actorUserId, targetUserId, newStatus)

  const transactions = [];

  // Update User
  const userUpdate = prisma.user.update({
    where: { id: targetUserId },
    data: { status: newStatus },
    select: { id: true, name: true, email: true, status: true },
  });

  // Security: Revoke tokens if account is suspended/deactivated
  if (newStatus !== "ACTIVE") {
    const revokeTokens = prisma.refreshToken.updateMany({
      where: { userId: targetUserId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    transactions.push(revokeTokens);
  }

  transactions.push(userUpdate);

  // Execute safely
  const result = await prisma.$transaction(transactions);
  
  return newStatus !== "ACTIVE" ? result[1] : result[0];
};

export const changeUserSystemRole = async ({ actorUserId, targetUserId, roleSlug }) => {
  if (actorUserId === targetUserId) {
    throw new AppError("You cannot modify your own role", StatusCodes.FORBIDDEN);
  }

  const actor = await prisma.user.findUnique({ where: { id: actorUserId }, include: { systemRole: true } });
  const target = await prisma.user.findUnique({ where: { id: targetUserId }, include: { systemRole: true } });

  if (!target || !actor) throw new AppError("User not found", StatusCodes.NOT_FOUND);

  // Hierarchy Check (Target user level)
  if (!canManageUser(actor.systemRole.slug, target.systemRole.slug)) {
    throw new AppError("Insufficient privileges to modify this user", StatusCodes.FORBIDDEN);
  }

  // Role Assignment Check (Action level)
  if (!canAssignRole(actor.systemRole.slug, roleSlug)) {
    throw new AppError("Insufficient privileges to assign this role", StatusCodes.FORBIDDEN);
  }

  const newRole = await prisma.systemRole.findUnique({ where: { slug: roleSlug } });
  if (!newRole) throw new AppError("System role not found", StatusCodes.NOT_FOUND);

  // TODO: Add audit log

  // Security: Always revoke tokens when role changes to force a re-login with new permissions
  const transactions = [
    prisma.refreshToken.updateMany({
      where: { userId: targetUserId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: targetUserId },
      data: { systemRoleId: newRole.id },
      select: { id: true, name: true, email: true, systemRole: true },
    })
  ];

  const result = await prisma.$transaction(transactions);
  return result[1];
};