import crypto from "crypto";

export const generateRequestFingerprint = (req) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "unknown-agent";
  
  //  verification processing signature mapping
  return crypto
    .createHash("sha256")
    .update(`${ip}-${userAgent}`)
    .digest("hex");
};