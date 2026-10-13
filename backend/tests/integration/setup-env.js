import dotenv from "dotenv";

dotenv.config({
  path: ".env.test",
  override: true,
});

process.env.NODE_ENV = "test";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from .env.test");
}

const databaseUrl = new URL(process.env.DATABASE_URL);
const databaseName = databaseUrl.pathname.replace(/^\/+/, "");

if (databaseName !== "interior_cms_test") {
  throw new Error(
    `Integration tests must use interior_cms_test, not "${databaseName}".`
  );
}