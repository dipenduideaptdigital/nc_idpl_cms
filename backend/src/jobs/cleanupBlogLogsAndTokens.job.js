import cron from "node-cron";
import { deleteOldViewLogs, deleteExpiredPreviewTokens, publishScheduledBlogs } from "../modules/blogs/blogs.repository.js";
import { logger } from "../config/logger.js";

export const initBlogHousekeepingWorkers = () => {
  cron.schedule("0 3 * * *", async () => {
    logger.info("HousekeepingWorker: Starting systemic blog data clean pruning cycles...");
    
    try {
      const slidingRetentionThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const autoPublishResult = await publishScheduledBlogs();
      const logPruneResult = await deleteOldViewLogs(slidingRetentionThreshold);
      const tokenPruneResult = await deleteExpiredPreviewTokens();

      logger.info(`HousekeepingWorker: Released ${autoPublishResult.count || 0} scheduled calendar post entities directly into active status.`);
      logger.info(`HousekeepingWorker: Dropped ${logPruneResult.count} old footprint view tracking signature logs safely.`);
      logger.info(`HousekeepingWorker: Cleared ${tokenPruneResult.count} dead expired authorization preview records.`);
    } catch (error) {
      logger.error("HousekeepingWorker: Automated records retention pruning task pipeline faulted:", error);
    }
  });
};