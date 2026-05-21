import { StatusCodes } from "http-status-codes";
import { verifyAccessToken } from "../utils/jwt.js";
import { extractBearerToken } from "../utils/extractToken.js";
import { AppError } from "../errors/AppError.js";
import { findUserById } from "../../modules/auth/auth.repository.js";

export const authenticate = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const accessToken = extractBearerToken(authorizationHeader);

    if (!accessToken) {
      throw new AppError("Access token missing", StatusCodes.UNAUTHORIZED);
    }

    let decoded;

    try {
      decoded = verifyAccessToken(accessToken);
    } catch {
      throw new AppError("Invalid or expired token", StatusCodes.UNAUTHORIZED);
    }

    const user = await findUserById(decoded.userId);

    if (!user) {
      throw new AppError("User no longer exists", StatusCodes.UNAUTHORIZED);
    }

    // Account status checks
    if (user.status !== "ACTIVE") {
      throw new AppError("Account is not active", StatusCodes.FORBIDDEN);
    }

    // Attach user
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};