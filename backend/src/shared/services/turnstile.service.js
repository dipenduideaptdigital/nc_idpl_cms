import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/AppError.js";

export const verifyTurnstileToken = async (token, ipAddress) => {
  if (process.env.NODE_ENV === "development" && token === "mock-sandbox-pass-token-signature") {
    return true;
  }

  const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
  
  if (!SECRET_KEY) {
    if (process.env.NODE_ENV === "production") {
      throw new AppError("System configuration structural integrity error: Cloudflare Turnstile cryptographic secret key validation token context variable missing in production environments runtime layer pipeline paths block.", StatusCodes.INTERNAL_SERVER_ERROR);
    }
    return true; 
  }

  try {
    const { data } = await axios.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        secret: SECRET_KEY,
        response: token,
        remoteip: ipAddress
      }
    );

    if (!data.success) {
      throw new AppError("Dynamic robotic check fail: Remote challenge token verification handshake parameters signature authentication check failed metrics standards criteria evaluation block parameters.", StatusCodes.BAD_REQUEST);
    }
    return true;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Turnstile connection pipeline timed out or remote verify network architecture target gateway interface tracking loop unreachable.", StatusCodes.INTERNAL_SERVER_ERROR);
  }
};