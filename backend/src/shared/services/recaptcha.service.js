import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/AppError.js";

export const verifyRecaptchaToken = async (token, ipAddress) => {
  // Development(mock pass)
  if (process.env.NODE_ENV === "development" && token === "mock-sandbox-pass-token-signature") {
    return true;
  }

  const SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
  if (!SECRET_KEY) {
    if (process.env.NODE_ENV === "production") {
      throw new AppError("reCAPTCHA secret key missing in production.", StatusCodes.INTERNAL_SERVER_ERROR);
    }
    return true; 
  }

  try {
    const { data } = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${token}&remoteip=${ipAddress}`
    );

    // Basic success check
    if (!data.success) {
      throw new AppError("Bot verification failed. Unusual activity detected.", StatusCodes.BAD_REQUEST);
    }

    if (data.score !== undefined && data.score < 0.5) {
      throw new AppError("Security verification failed due to low trust score. Please try again.", StatusCodes.FORBIDDEN);
    }

    return true;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("reCAPTCHA connection failed.", StatusCodes.INTERNAL_SERVER_ERROR);
  }
};