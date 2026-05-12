import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

const server = http.createServer(app);

const PORT = env.PORT;

server.listen(PORT, () => {
  logger.info(
    `Server running on port ${PORT}`
  );
});

const shutdown = (signal) => {
  logger.info(`${signal} received. Shutting down server...`);

  server.close(() => {
    logger.info("Server closed.");

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