import dotenv from "dotenv";

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: process.env.PORT || 5000,

  DATABASE_URL: process.env.DATABASE_URL,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,

  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

  ACCESS_TOKEN_EXPIRES_IN:
    process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",

  REFRESH_TOKEN_EXPIRES_IN:
    process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",

  CLIENT_URL: process.env.CLIENT_URL,

  SUPER_ADMIN_NAME:
  process.env.SUPER_ADMIN_NAME,

SUPER_ADMIN_EMAIL:
  process.env.SUPER_ADMIN_EMAIL,

SUPER_ADMIN_PASSWORD:
  process.env.SUPER_ADMIN_PASSWORD,
};