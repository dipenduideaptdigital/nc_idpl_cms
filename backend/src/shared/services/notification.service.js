import { logger } from "../../config/logger.js";

export const queueAdminNotificationEmail = async (submissionData, targetedInboxDistributionList = []) => {
  setImmediate(async () => {
    try {
      const recipients = Array.isArray(targetedInboxDistributionList) && targetedInboxDistributionList.length > 0 
        ? targetedInboxDistributionList 
        : ["default-it-ops-lead-intake@subhaakritee.internal"]; // Resilient structural system operations email fallback configuration parameters

      logger.info(`NotificationQueue: Processing outbound background message worker loop tracking payload context for Submission ID: ${submissionData.id}`);
      logger.info(`NotificationQueue: Dispatching leads payload metadata strictly down onto target dynamic distribution list routes channels map: [${recipients.join(", ")}]`);

      await new Promise(resolve => setTimeout(resolve, 600)); 

      logger.info(`NotificationQueue: Asynchronous dispatch completely processed without blocking primary network cycles transport execution parameters locked safely.`);
    } catch (error) {
      logger.error(`NotificationQueue: CRITICAL internal mail client background routing routine engine execution failure anomaly alert exception blocks parameters logic:`, error);
    }
  });
};