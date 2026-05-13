import { prisma } from "../config/db.js";
import { logger } from "../config/logger.js";

export const cleanupExpiredTokens =
  async () => {
    try {
      const thirtyDaysAgo =
        new Date(
          Date.now() -
            30 *
              24 *
              60 *
              60 *
              1000
        );

      const result =
        await prisma.refreshToken.deleteMany({
          where: {
            OR: [
              {
                expiresAt: {
                  lt: new Date(),
                },
              },

              {
                revokedAt: {
                  not: null,

                  lt: thirtyDaysAgo,
                },
              },
            ],
          },
        });

      logger.info(
        `Expired refresh tokens cleaned: ${result.count}`
      );
    } catch (error) {
      logger.error(error);
    }
  };