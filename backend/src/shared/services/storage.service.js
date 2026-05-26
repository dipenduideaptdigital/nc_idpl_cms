import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "../../config/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, "../../../public");

// Ensure directories exist
const UPLOAD_DIR = path.join(PUBLIC_DIR, "uploads");
const THUMB_DIR = path.join(PUBLIC_DIR, "uploads/thumbs");

// Synchronous check on boot
import { existsSync, mkdirSync } from "fs";
if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });
if (!existsSync(THUMB_DIR)) mkdirSync(THUMB_DIR, { recursive: true });


export const saveBufferToStorage = async (buffer, relativePath) => {
  const fullPath = path.join(PUBLIC_DIR, relativePath);
  try {
    await fs.writeFile(fullPath, buffer);
    return relativePath;
  } catch (error) {
    logger.error(`StorageService: Failed to write buffer to ${relativePath}`, error);
    throw error;
  }
};

export const deleteMediaFile = async (fileUrl) => {
  if (!fileUrl) return;
  try {
    await fs.unlink(path.join(PUBLIC_DIR, fileUrl));
    logger.info(`StorageService: Deleted ${fileUrl}`);
  } catch (error) {
    if (error.code !== "ENOENT") logger.error(`StorageService: Delete failed ${fileUrl}`, error);
  }
};