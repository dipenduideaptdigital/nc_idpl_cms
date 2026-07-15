export const serializeProfile = (user, options = {}) => {
  const serialized = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    status: user.status,
    isEmailVerified: user.isEmailVerified,
    systemRole: user.systemRole,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  // INCLUDE FUNCTIONAL ROLES
  if (options.includeFunctionalRoles && user.functionalRoles) {
    serialized.functionalRoles = user.functionalRoles.map((item) => ({
      id: item.functionalRole.id,
      name: item.functionalRole.name,
      slug: item.functionalRole.slug,
    }));
  }

  return serialized;
};