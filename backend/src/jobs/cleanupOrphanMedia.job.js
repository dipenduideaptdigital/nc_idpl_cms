import cron from "node-cron";
import { prisma } from "../config/db.js";
import { logger } from "../config/logger.js";
import { deleteFromCloudinary } from "../shared/services/cloudinary.service.js";

const extractMediaReferences = (obj, activeIds, activeUrls) => {
  if (!obj) return;
  
  if (typeof obj === "string") {
    if (obj.startsWith("/uploads/") || obj.startsWith("http")) {
      activeUrls.add(obj);
    }
  } else if (typeof obj === "object" && !Array.isArray(obj)) {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string") {
        if (key.toLowerCase().endsWith("id")) {
          activeIds.add(value);
        } else if (value.startsWith("/uploads/") || value.startsWith("http")) {
          activeUrls.add(value);
        }
      } else if (typeof value === "object") {
        extractMediaReferences(value, activeIds, activeUrls);
      }
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item) => extractMediaReferences(item, activeIds, activeUrls));
  }
};

const scanActiveMedia = async () => {
  const activeIds = new Set();
  const activeUrls = new Set();

  const users = await prisma.user.findMany({
    select: { avatar: true },
    where: { avatar: { not: null } }
  });
  users.forEach((u) => activeUrls.add(u.avatar));

  const settings = await prisma.setting.findMany({
    select: { value: true }
  });
  settings.forEach((s) => extractMediaReferences(s.value, activeIds, activeUrls));

  return { activeIds, activeUrls };
};

export const runOrphanMediaCleanup = async () => {
  logger.info("Starting Two-Phase Media Cleanup Job...");
  try {
    const { activeIds, activeUrls } = await scanActiveMedia();
    
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeMedia = await prisma.media.findMany({
      where: { 
        createdAt: { lt: twentyFourHoursAgo },
        deletedAt: null 
      },
    });

    const newlyOrphanedIds = activeMedia
      .filter((m) => !activeIds.has(m.id) && !activeUrls.has(m.url))
      .map((m) => m.id);

    if (newlyOrphanedIds.length > 0) {
      await prisma.media.updateMany({
        where: { id: { in: newlyOrphanedIds } },
        data: { deletedAt: new Date() }
      });
      logger.info(`Phase 1: Marked ${newlyOrphanedIds.length} media files for soft-delete.`);
    }

    const softDeletedMedia = await prisma.media.findMany({
      where: { deletedAt: { not: null } }
    });

    let hardDeletedCount = 0;
    
    for (const media of softDeletedMedia) {
      try {
        await deleteFromCloudinary(media.filename); 
        const thumbPublicId = media.filename.replace("main/", "thumbs/").replace(".webp", "-thumb.webp");
        await deleteFromCloudinary(thumbPublicId);

        await prisma.media.delete({
          where: { id: media.id }
        });
        
        hardDeletedCount++;
      } catch (error) {
        logger.error(`Phase 2: Failed to hard-delete media ${media.id} from Cloudinary, keeping soft-deleted.`, error);
      }
    }

    if (hardDeletedCount > 0 || newlyOrphanedIds.length > 0) {
      logger.info(`Phase 2: Successfully hard-deleted ${hardDeletedCount} files.`);
    } else {
      logger.info("Media Cleanup Complete: No orphaned files required processing today.");
    }
  } catch (error) {
    logger.error("Error during Media Cleanup Job", error);
  }
};

export const initMediaCleanupJob = () => {
  cron.schedule("0 3 * * *", () => runOrphanMediaCleanup());
};