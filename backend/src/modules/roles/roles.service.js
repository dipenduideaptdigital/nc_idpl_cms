import { StatusCodes } from "http-status-codes";
import { AppError } from "../../shared/errors/AppError.js";
import { generateSlug } from "../../shared/utils/slugify.js";
import { prisma } from "../../config/db.js";
import * as repo from "./roles.repository.js";

const validatePermissionIds = async (permissionIds) => {
  if (!permissionIds || permissionIds.length === 0) return;
  const count = await prisma.permission.count({
    where: { id: { in: permissionIds } }
  });
  if (count !== permissionIds.length) {
    throw new AppError("One or more provided permission IDs are invalid or do not exist.", StatusCodes.BAD_REQUEST);
  }
};

export const createRole = async (payload) => {
  const slug = generateSlug(payload.name);
  
  const existingRole = await repo.findRoleByNameOrSlug(slug);
  if (existingRole) {
    throw new AppError("A functional role with this name already exists.", StatusCodes.CONFLICT);
  }

  await validatePermissionIds(payload.permissionIds);

  return await repo.createRoleWithPermissions({
    name: payload.name,
    slug: slug,
    description: payload.description
  }, payload.permissionIds || []);
};

export const updateRole = async (id, payload) => {
  const role = await repo.findRoleById(id);
  if (!role) throw new AppError("Role not found.", StatusCodes.NOT_FOUND);

  let slug = role.slug;
  if (payload.name && payload.name !== role.name) {
    slug = generateSlug(payload.name);
    const existingRole = await repo.findRoleByNameOrSlug(slug);
    if (existingRole && existingRole.id !== id) {
      throw new AppError("A functional role with this name already exists.", StatusCodes.CONFLICT);
    }
  }

  if (payload.permissionIds) {
    await validatePermissionIds(payload.permissionIds);
  }

  return await repo.updateRoleWithPermissions(
    id, 
    { name: payload.name, slug, description: payload.description }, 
    payload.permissionIds
  );
};

export const deleteRole = async (id) => {
  const role = await repo.findRoleById(id);
  if (!role) throw new AppError("Role not found.", StatusCodes.NOT_FOUND);

  if (role._count.users > 0) {
    throw new AppError(
      `Cannot delete role. There are ${role._count.users} user(s) currently assigned to this role. Please reassign them first.`, 
      StatusCodes.CONFLICT
    );
  }

  return await repo.deleteRoleById(id);
};

export const getAllRoles = async () => {
  return await repo.getAllRolesWithCounts();
};

export const getRoleDetails = async (id) => {
  const role = await repo.findRoleById(id);
  if (!role) throw new AppError("Role not found.", StatusCodes.NOT_FOUND);
  
  const permissionIds = role.permissions.map(p => p.permissionId);
  return { ...role, permissions: permissionIds };
};

export const getSystemPermissions = async () => {
  return await repo.getAllGroupedPermissions();
};