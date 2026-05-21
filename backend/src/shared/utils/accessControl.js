export const canManageUser = (actorRoleSlug, targetRoleSlug) => {
  if (targetRoleSlug === "SUPER_ADMIN") return false; // No one modifies SUPER_ADMIN
  if (actorRoleSlug === "ADMIN" && targetRoleSlug === "ADMIN") return false; // ADMIN cannot modify ADMIN
  return true; // SUPER_ADMIN can modify ADMIN/USER, ADMIN can modify USER
};

export const canAssignRole = (actorRoleSlug, newRoleSlug) => {
  if (newRoleSlug === "SUPER_ADMIN") return false; // No one assigns SUPER_ADMIN dynamically
  if (actorRoleSlug !== "SUPER_ADMIN") return false; // Only SUPER_ADMIN can change roles
  return true;
};