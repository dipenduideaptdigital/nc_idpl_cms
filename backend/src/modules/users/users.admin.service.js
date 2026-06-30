import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../shared/errors/AppError.js";
import { prisma } from "../../config/db.js";
import { generateSecureToken, hashSecureToken } from "../../shared/utils/secureToken.js";
import { hashPassword } from "../../shared/utils/password.js";
import { sendEmail } from "../../shared/services/email.service.js";
import { normalizeEmail } from "../../shared/utils/normalizeEmail.js";

const checkLastSuperAdmin = async (targetUserId) => {
  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId }, include: { systemRole: true } });
  if (targetUser?.systemRole.slug === "SUPER_ADMIN") {
    const superAdminCount = await prisma.user.count({
      where: { systemRole: { slug: "SUPER_ADMIN" }, status: "ACTIVE" }
    });
    if (superAdminCount <= 1) {
      throw new AppError(" Cannot modify or suspend the last active Super Admin. System would be locked out.", StatusCodes.FORBIDDEN);
    }
  }
};

export const changeUserStatus = async ({ actorUserId, targetUserId, newStatus }) => {
  if (actorUserId === targetUserId) throw new AppError("You cannot modify your own status", StatusCodes.FORBIDDEN);

  if (newStatus !== "ACTIVE") {
    await checkLastSuperAdmin(targetUserId);
  }

  const transactions = [];

  const userUpdate = prisma.user.update({
    where: { id: targetUserId },
    data: { status: newStatus },
    select: { id: true, name: true, email: true, status: true },
  });

  if (newStatus !== "ACTIVE") {
    transactions.push(prisma.refreshToken.updateMany({
      where: { userId: targetUserId, revokedAt: null },
      data: { revokedAt: new Date() },
    }));
  }

  transactions.push(userUpdate);
  const result = await prisma.$transaction(transactions);
  return newStatus !== "ACTIVE" ? result[1] : result[0];
};

export const changeUserSystemRole = async ({ actorUserId, targetUserId, roleSlug }) => {
  if (actorUserId === targetUserId) {
    throw new AppError("Self-Protection Rule: You cannot modify or demote your own system role.", StatusCodes.FORBIDDEN);
  }

  const target = await prisma.user.findUnique({ where: { id: targetUserId }, include: { systemRole: true } });
  if (!target) throw new AppError("User not found", StatusCodes.NOT_FOUND);

  if (target.systemRole.slug === "SUPER_ADMIN" && roleSlug !== "SUPER_ADMIN") {
    await checkLastSuperAdmin(targetUserId);
  }

  const newRole = await prisma.systemRole.findUnique({ where: { slug: roleSlug } });
  if (!newRole) throw new AppError("System role not found", StatusCodes.NOT_FOUND);

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

export const assignFunctionalRolesToUser = async ({ actorUserId, targetUserId, functionalRoleIds }) => {
  if (actorUserId === targetUserId) {
    throw new AppError("You cannot modify your own functional roles.", StatusCodes.FORBIDDEN);
  }

  // Validate roles exist
  if (functionalRoleIds.length > 0) {
    const roleCount = await prisma.functionalRole.count({ where: { id: { in: functionalRoleIds } } });
    if (roleCount !== functionalRoleIds.length) {
      throw new AppError("One or more functional role IDs are invalid.", StatusCodes.BAD_REQUEST);
    }
  }

  return await prisma.$transaction(async (tx) => {
    await tx.userFunctionalRole.deleteMany({
      where: { userId: targetUserId }
    });

    if (functionalRoleIds.length > 0) {
      const mappings = functionalRoleIds.map(roleId => ({
        userId: targetUserId,
        functionalRoleId: roleId
      }));
      await tx.userFunctionalRole.createMany({ data: mappings });
    }
    await tx.refreshToken.updateMany({
      where: { userId: targetUserId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return true;
  });
};

export const getUserFunctionalRoles = async (userId) => {
  const userRoles = await prisma.userFunctionalRole.findMany({
    where: { userId },
    include: { functionalRole: { select: { id: true, name: true, slug: true } } }
  });
  return userRoles.map(ur => ur.functionalRole);
};

export const getAllUsersPaginated = async (queryMatrix) => {
  const { page = 1, limit = 10, search, status, systemRole } = queryMatrix;
  const skip = (page - 1) * limit;

  const where = {};
  if (status) where.status = status;
  if (systemRole) where.systemRole = { slug: systemRole };
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, 
        name: true, 
        email: true, 
        status: true, 
        lastLoginAt: true, 
        createdAt: true,
        isEmailVerified: true,
        systemRole: { select: { name: true, slug: true } },
        functionalRoles: { select: { functionalRole: { select: { name: true, slug: true } } } }
      }
    }),
    prisma.user.count({ where })
  ]);

  return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const inviteAdminUser = async ({ name, email, systemRoleSlug, functionalRoleIds = [], inviterId }) => {
  const normalizedEmail = normalizeEmail(email);

  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existingUser) {
    if (existingUser.status === "PENDING") {
      throw new AppError("A pending invitation already exists for this email.", StatusCodes.CONFLICT);
    }
    throw new AppError("A user with this email already exists.", StatusCodes.CONFLICT);
  }

  const systemRole = await prisma.systemRole.findUnique({ where: { slug: systemRoleSlug } });
  if (!systemRole || !["ADMIN", "SUPER_ADMIN"].includes(systemRoleSlug)) {
    throw new AppError("Invalid system role for invitation.", StatusCodes.BAD_REQUEST);
  }

  if (functionalRoleIds.length > 0) {
    const validRolesCount = await prisma.functionalRole.count({ where: { id: { in: functionalRoleIds } } });
    if (validRolesCount !== functionalRoleIds.length) {
      throw new AppError("One or more functional role IDs are invalid.", StatusCodes.BAD_REQUEST);
    }
  }

  const rawToken = generateSecureToken();
  const tokenHash = hashSecureToken(rawToken);
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

  const dummyPassword = await hashPassword(crypto.randomBytes(20).toString("hex"));

  const invitation = await prisma.$transaction(async (tx) => {
    await tx.adminInvitation.deleteMany({ where: { email: normalizedEmail } });

    // Create Pending User
    const newUser = await tx.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: dummyPassword,
        systemRoleId: systemRole.id,
        status: "PENDING", 
        isEmailVerified: false,
      }
    });

    if (functionalRoleIds && functionalRoleIds.length > 0) {
      const roleMappings = functionalRoleIds.map(rId => ({
        userId: newUser.id,
        functionalRoleId: rId
      }));
      await tx.userFunctionalRole.createMany({ data: roleMappings });
    }

    return await tx.adminInvitation.create({
      data: {
        email: normalizedEmail,
        tokenHash,
        systemRoleId: systemRole.id,
        invitedById: inviterId,
        expiresAt
      }
    });
  }); 

  const setupUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/admin-setup?token=${rawToken}&email=${encodeURIComponent(normalizedEmail)}`;
  
  sendEmail({
    to: normalizedEmail,
    subject: "Invitation to Subhaakritee Admin Portal",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #2563eb;">Welcome to Subhaakritee!</h2>
        <p>Hi ${name}, you have been invited to join as a Staff Member.</p>
        <p>Your access permissions have already been configured by the admin. Please click the button below to set up your secure password and activate your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${setupUrl}" style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Setup My Account
          </a>
        </div>
        <p style="font-size: 12px; color: #888;">This secure link is valid for 48 hours.</p>
      </div>
    `
  }).catch(err => logger.error({ message: "Invite email failed", error: err.message }));

  return invitation;
};

export const getUserDetailedProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      systemRole: true,
      functionalRoles: {
        include: {
          functionalRole: {
            include: {
              permissions: {
                include: { permission: true }
              }
            }
          }
        }
      }
    }
  });

  if (!user) throw new AppError("User not found", StatusCodes.NOT_FOUND);

  const permissionsSet = new Set();
  user.functionalRoles.forEach(fr => {
    fr.functionalRole.permissions.forEach(p => {
      permissionsSet.add(p.permission.slug);
    });
  });

  // We expand this later to include PageRevisions or ContactLogs
  const recentActivity = await prisma.blogRevision.findMany({
    where: { actorId: userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { blog: { select: { title: true } } }
  });

  return {
    ...user,
    permissionsList: Array.from(permissionsSet),
    recentActivity
  };
};

export const revokeUserSessions = async (targetUserId) => {
  await checkLastSuperAdmin(targetUserId); 
  
  await prisma.refreshToken.updateMany({
    where: { userId: targetUserId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  
  return { message: "All active sessions for this user have been terminated." };
};

export const cancelInvitation = async (email) => {
  const normalizedEmail = normalizeEmail(email);
  
  return await prisma.$transaction(async (tx) => {
    await tx.adminInvitation.deleteMany({ where: { email: normalizedEmail } });
    await tx.user.deleteMany({ where: { email: normalizedEmail, status: "PENDING" } });
    
    return { message: "Invitation cancelled and pending account removed successfully." };
  });
};