import cron from "node-cron";
import { publishScheduledBlogs } from "../modules/blogs/blogs.repository.js";
import { logger } from "../config/logger.js";

// Run this every minute
export const initScheduledBlogPublisherJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const result = await publishScheduledBlogs();
      if (result.count > 0) {
        logger.info(`Blog Publisher Job: Automatically activated ${result.count} scheduled blogs.`);
      }
    } catch (err) {
      logger.error("Blog Publisher Job Failed", err);
    }
  });
};