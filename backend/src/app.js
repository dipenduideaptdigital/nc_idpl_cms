import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import routes from "./routes/index.js";
import { env } from "./config/env.js";
import { globalErrorHandler } from "./shared/middlewares/error.middleware.js";
import { notFoundHandler } from "./shared/middlewares/notFound.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("trust proxy", 1);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(hpp());
app.use(compression());

// CORS
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));

// Body parsers
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// API routes
app.use("/api", routes);

// Not found handler
app.use(notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

export default app;