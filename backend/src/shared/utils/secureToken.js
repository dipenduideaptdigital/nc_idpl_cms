import crypto from "crypto";

// Generate raw token
export const generateSecureToken = (size = 32) => {
  return crypto.randomBytes(size).toString("hex");
};

// Hash token
export const hashSecureToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// Token expiration date
export const generateTokenExpiry = (minutes = 15) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};