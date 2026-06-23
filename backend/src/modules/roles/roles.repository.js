import { prisma } from "../../config/db.js";

export const findRoleByNameOrSlug = async (identifier) => {
  return await prisma.functionalRole.findFirst({
    where: {
      OR: [{ name: identifier }, { slug: identifier }]
    }
  });
};

export const createRoleWithPermissions = async (data, permissionIds) => {
  return await prisma.$transaction(async (tx) => {
    const role = await tx.functionalRole.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description
      }
    });

    if (permissionIds.length > 0) {
      const mappings = permissionIds.map(id => ({
        functionalRoleId: role.id,
        permissionId: id
      }));
      await tx.functionalRolePermission.createMany({ data: mappings });
    }

    return role;
  });
};

export const updateRoleWithPermissions = async (roleId, data, permissionIds) => {
  return await prisma.$transaction(async (tx) => {
    const role = await tx.functionalRole.update({
      where: { id: roleId },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description
      }
    });

    if (permissionIds !== undefined) {
      await tx.functionalRolePermission.deleteMany({
        where: { functionalRoleId: roleId }
      });
      if (permissionIds.length > 0) {
        const mappings = permissionIds.map(id => ({
          functionalRoleId: role.id,
          permissionId: id
        }));
        await tx.functionalRolePermission.createMany({ data: mappings });
      }
    }
    return role;
  });
};

export const findRoleById = async (id) => {
  return await prisma.functionalRole.findUnique({
    where: { id },
    include: {
      permissions: { select: { permissionId: true } },
      _count: { select: { users: true } }
    }
  });
};

export const deleteRoleById = async (id) => {
  return await prisma.functionalRole.delete({ where: { id } });
};

export const getAllRolesWithCounts = async () => {
  return await prisma.functionalRole.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { users: true } }
    }
  });
};

export const getAllGroupedPermissions = async () => {
  const rawPermissions = await prisma.permission.findMany({
    orderBy: { module: 'asc' }
  });
  
  return rawPermissions.reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = [];
    acc[perm.module].push(perm);
    return acc;
  }, {});
};