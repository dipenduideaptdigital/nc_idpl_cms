export const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: {
      id,
    },

    include: {
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
    },
  });
};

export const findRefreshToken = async (
  token
) => {
  return prisma.refreshToken.findFirst({
    where: {
      token,
      revokedAt: null,
    },
  });
};

export const revokeRefreshToken =
  async (tokenHash) => {
    return prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },

      data: {
        revokedAt: new Date(),
      },
    });
  };

export const revokeAllUserTokens =
  async (userId) => {
    return prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },

      data: {
        revokedAt: new Date(),
      },
    });
  };

export const findValidRefreshToken =
  async (tokenHash) => {
    return prisma.refreshToken.findFirst({
      where: {
        tokenHash,

        revokedAt: null,

        expiresAt: {
          gt: new Date(),
        },
      },

      include: {
        user: {
          include: {
            systemRole: true,
          },
        },
      },
    });
  };