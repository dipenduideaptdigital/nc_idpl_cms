export const sanitizeUser = (
  user
) => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    status: user.status,
    isEmailVerified:
      user.isEmailVerified,

    systemRole:
      user.systemRole
        ? {
            id: user.systemRole.id,
            name: user.systemRole.name,
            slug: user.systemRole.slug,
          }
        : null,

    functionalRoles:
      user.functionalRoles?.map(
        (role) => ({
          id:
            role.functionalRole.id,
          name:
            role.functionalRole.name,
          slug:
            role.functionalRole.slug,
        })
      ) || [],

    createdAt: user.createdAt,

    updatedAt: user.updatedAt,
  };
};