import { prisma } from "./config/db.js";
import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { cleanupExpiredTokens } from "./jobs/cleanupExpiredTokens.job.js";

const server = http.createServer(app);

const PORT = env.PORT;

server.listen(PORT, () => {
  logger.info(
    `Server running on port ${PORT}`
  );
});

const shutdown = async (signal) => {
  logger.info(`${signal} received. Shutting down server...`);
  
  server.close(async () => {
    await prisma.$disconnect(); 
    logger.info("Server closed and database disconnected.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("uncaughtException", (error) => {
  logger.error(error);

  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error(reason);

  process.exit(1);
});