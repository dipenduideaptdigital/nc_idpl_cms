import { prisma } from "../../config/db.js";

// Check if an active token already exists to prevent DB bloat
export const findActiveTokenByPageId = async (pageId) => {
  return await prisma.pagePreviewToken.findFirst({
    where: {
      pageId,
      expiresAt: { gt: new Date() } // Strictly check if it's still alive
    }
  });
};

export const createNewPreviewToken = async (data) => {
  return await prisma.pagePreviewToken.create({ data });
};

// Fetch token and eagerly load the exact relation structures needed for the Page renderer
export const findTokenWithPageContext = async (token) => {
  return await prisma.pagePreviewToken.findUnique({
    where: { token },
    include: {
      page: {
        include: {
          author: { select: { name: true } },
          featuredImage: { select: { url: true, thumbnailUrl: true } }
        }
      }
    }
  });
};

// Fire-and-forget audit tracking
export const incrementTokenUsage = async (tokenId) => {
  return await prisma.pagePreviewToken.update({
    where: { id: tokenId },
    data: {
      usedCount: { increment: 1 },
      lastAccessedAt: new Date()
    }
  });
};