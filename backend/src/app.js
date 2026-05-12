import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import hpp from "hpp";

import routes from "./routes/index.js";
import { env } from "./config/env.js";
import { globalErrorHandler } from "./shared/middlewares/error.middleware.js";
import { notFoundHandler } from "./shared/middlewares/notFound.middleware.js";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.use(helmet());
app.use(hpp());
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;