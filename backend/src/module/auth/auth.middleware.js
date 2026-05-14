import ApiError from "../../common/utility/ApiError.js";
import { verifyAccessToken } from "../../common/utility/jwt.utility.js";
import User from "../../module/auth/auth.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return next(ApiError.unauthorized("Unauthorized"));
    }

    const token = header.split(" ")[1];

    if (!token) {
      return next(ApiError.unauthorized("Unauthorized"));
    }

    const decoded = verifyAccessToken(token);
    // console.log(decoded);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(ApiError.unauthorized("Unauthorized"));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(ApiError.unauthorized("Invalid or expired token"));
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("optional auth:- ", authHeader);
    if (!authHeader?.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded._id).select("-password");
    console.log("optional user:-", user);
    req.user = user;
    return next();
  } catch (error) {
    return next();
  }
};
