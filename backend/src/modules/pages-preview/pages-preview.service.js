import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../shared/errors/AppError.js";
import { findPageById } from "../pages/pages.repository.js";
import { serializePage } from "../../shared/utils/serializePage.js";
import * as previewRepo from "./pages-preview.repository.js";

export const generatePreviewLink = async (pageId, userId, baseUrl) => {
  const page = await findPageById(pageId);
  if (!page) throw new AppError("Page not found", StatusCodes.NOT_FOUND);

  const rawToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); 

  await previewRepo.replaceAndCreatePreviewToken({
    token: rawToken, 
    pageId,
    createdById: userId,
    expiresAt
  });

  return { previewUrl: `${baseUrl}/preview/${rawToken}` };
};

export const revokePreviewLink = async (pageId) => {
  return await previewRepo.revokePreviewToken(pageId);
};

export const resolvePreviewToken = async (tokenString) => {
  const tokenRecord = await previewRepo.findTokenWithPageContext(tokenString);

  if (!tokenRecord) throw new AppError("Invalid preview token.", StatusCodes.NOT_FOUND);
  if (new Date() > tokenRecord.expiresAt) throw new AppError("Preview expired.", StatusCodes.GONE);
  if (tokenRecord.page.deletedAt) throw new AppError("Page deleted.", StatusCodes.NOT_FOUND);

  // Background Analytics (Fire-and-forget) - Doesn't block the response
  previewRepo.incrementTokenUsage(tokenRecord.id).catch((err) => {
    console.error("Preview audit tracking failed:", err);
  });

  return {
    preview: {
      enabled: true,
      expiresAt: tokenRecord.expiresAt
    },
    page: serializePage(tokenRecord.page, "public")
  };
};

export const getPreviewLinkStatus = async (pageId) => {
  const stats = await previewRepo.getPreviewTokenStats(pageId);
  
  if (!stats) {
    return { isActive: false };
  }

  const isExpired = new Date() > stats.expiresAt;
  if (isExpired) {
    return { isActive: false, isExpired: true };
  }

  return {
    isActive: true,
    expiresAt: stats.expiresAt,
    usedCount: stats.usedCount,
    lastAccessedAt: stats.lastAccessedAt,
    createdAt: stats.createdAt
    // We cannot return the URL here because we only store the hash!
  };
};