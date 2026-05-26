import { prisma } from "./config/db.js";
import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { cleanupExpiredTokens } from "./jobs/cleanupExpiredTokens.job.js";
import { initMediaCleanupJob } from "./jobs/cleanupOrphanMedia.job.js"; 

const server = http.createServer(app);

const PORT = env.PORT;

const startServer = async () => {
  try {
    // Initialize background cron jobs before starting the server
    cleanupExpiredTokens();
    initMediaCleanupJob(); 

    server.listen(PORT, () => {
      logger.info(`Server running in ${env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown logic
const shutdown = async (signal) => {
  logger.info(`${signal} received. Shutting down server...`);
  
  server.close(async () => {
    await prisma.$disconnect(); 
    logger.info("Server closed and database disconnected.");
    process.exit(0);
  });
};

// Handle termination signals
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Catch unexpected runtime errors
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
  process.exit(1);
});