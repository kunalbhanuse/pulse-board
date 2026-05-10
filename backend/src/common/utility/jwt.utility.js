import crypto from "crypto";
import jwt from "jsonwebtoken";

const generateRefreshToken = (payload) => {
  return jwt.sign({ id: payload._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

const generateAccessToken = (payload) => {
  return jwt.sign(
    { id: payload._id, role: payload.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

const generateResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  return { rawToken, hashedToken };
};

export {
  generateRefreshToken,
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateResetToken,
};
