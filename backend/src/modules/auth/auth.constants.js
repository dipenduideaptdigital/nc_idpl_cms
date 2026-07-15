// LIGHTWEIGHT AUTH INCLUDE
// Used for:
// - login
// - refresh token
// - forgot password
// - reset password
// - change password

export const AUTH_BASIC_USER_INCLUDE =
  {
    systemRole: true,
  };

// FULL RBAC INCLUDE
// Used ONLY for:
// - authorization
// - admin panel
// - permission checks
// - role management

export const AUTH_RBAC_USER_INCLUDE =
  {
    systemRole: true,

    functionalRoles: {
      include: {
        functionalRole: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    },
  };

// PROFILE INCLUDE
// Used for:
// - current profile
// - user profile APIs

export const AUTH_PROFILE_INCLUDE =
  {
    systemRole: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
  };