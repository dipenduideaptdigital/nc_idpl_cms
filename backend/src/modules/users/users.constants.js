export const USER_PROFILE_INCLUDE = {
  systemRole: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
};

export const USER_PROFILE_RBAC_INCLUDE = {
  systemRole: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  functionalRoles: {
    include: {
      functionalRole: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  },
};