import { prisma } from "../../config/db.js";
import crypto from "crypto";

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

export const replaceAndCreatePreviewToken = async (data) => {
  return await prisma.$transaction(async (tx) => {
    await tx.pagePreviewToken.deleteMany({
      where: { pageId: data.pageId }
    });

    return await tx.pagePreviewToken.create({
      data: {
        tokenHash: hashToken(data.token),
        pageId: data.pageId,
        createdById: data.createdById,
        expiresAt: data.expiresAt
      }
    });
  });
};

export const findTokenWithPageContext = async (rawToken) => {
  const tokenHash = hashToken(rawToken);
  return await prisma.pagePreviewToken.findUnique({
    where: { tokenHash },
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

export const incrementTokenUsage = async (tokenId) => {
  return await prisma.pagePreviewToken.update({
    where: { id: tokenId },
    data: { usedCount: { increment: 1 }, lastAccessedAt: new Date() }
  });
};

export const revokePreviewToken = async (pageId) => {
  return await prisma.pagePreviewToken.deleteMany({ where: { pageId } });
};

export const deleteExpiredTokens = async () => {
  return await prisma.pagePreviewToken.deleteMany({
    where: { expiresAt: { lt: new Date() } }
  });
};

export const getPreviewTokenStats = async (pageId) => {
  return await prisma.pagePreviewToken.findUnique({
    where: { pageId },
    select: { 
      expiresAt: true, 
      usedCount: true, 
      lastAccessedAt: true, 
      createdAt: true 
    }
  });
};