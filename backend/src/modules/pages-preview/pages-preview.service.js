import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../shared/errors/AppError.js";
import { findPageById } from "../pages/pages.repository.js";
import { serializePage } from "../../shared/utils/serializePage.js";
import * as previewRepo from "./pages-preview.repository.js";

export const generatePreviewLink = async (pageId, userId, baseUrl) => {
  // 1. Verify page exists and is NOT soft-deleted
  const page = await findPageById(pageId);
  if (!page) throw new AppError("Target page does not exist or has been deleted.", StatusCodes.NOT_FOUND);

  // 2. Reuse Active Token Strategy (Option B)
  const existingToken = await previewRepo.findActiveTokenByPageId(pageId);
  let secureTokenString;

  if (existingToken) {
    secureTokenString = existingToken.token;
  } else {
    // 3. Generate a high-entropy cryptographically secure token (Better than JWT/Cuid for URLs)
    secureTokenString = crypto.randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 Hours absolute TTL

    await previewRepo.createNewPreviewToken({
      token: secureTokenString,
      pageId: pageId,
      createdById: userId,
      expiresAt
    });
  }

  return {
    previewUrl: `${baseUrl}/preview/${secureTokenString}`,
    token: secureTokenString,
    expiresAt: existingToken ? existingToken.expiresAt : new Date(Date.now() + 24 * 60 * 60 * 1000)
  };
};

export const resolvePreviewToken = async (tokenString) => {
  const tokenRecord = await previewRepo.findTokenWithPageContext(tokenString);

  // Strict Evaluation Gates
  if (!tokenRecord) throw new AppError("Invalid or corrupted preview token.", StatusCodes.NOT_FOUND);
  if (new Date() > tokenRecord.expiresAt) throw new AppError("This preview link has expired.", StatusCodes.GONE);
  
  // SOFT DELETE PROTECTION: (Drafts/Archived are allowed, deletedAt is explicitly blocked)
  if (tokenRecord.page.deletedAt) throw new AppError("This page has been permanently deleted.", StatusCodes.NOT_FOUND);

  // Asynchronous Audit Logging (Non-blocking)
  previewRepo.incrementTokenUsage(tokenRecord.id).catch(err => console.error("Audit log failed", err));

  // Return the exact LATEST LIVE DRAFT using our shared serializer!
  return serializePage(tokenRecord.page, "public");
};