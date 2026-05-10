import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../../module/auth/auth.model.js";
import { registerSchema, loginSchema } from "./dto/auth.dto.js";
import ApiError from "../../common/utility/ApiError.js";
import ApiResponse from "../../common/utility/ApiResponce.js";
import { sendMail } from "../../common/config/email.js";
import {
  generateResetToken,
  generateRefreshToken,
  generateAccessToken,
} from "../../common/utility/jwt.utility.js";

export const register = async (req, res) => {
  const validateReqBody = await registerSchema.parseAsync(req.body);
  const { name, email, password } = validateReqBody;

  const user = await User.findOne({ email });
  if (user) {
    throw ApiError.conflict("User already exists");
  }
  const newUser = await User.create({ name, email, password });
  if (!newUser) {
    throw ApiError.badRequest("Failed to create user");
  }
  const { rawToken, hashedToken } = generateResetToken();
  newUser.emailVerificationToken = hashedToken;
  newUser.emailVerificationExpires = Date.now() + 3600000; // 1 hour
  await newUser.save();

  const sendVerificationEmail = await sendMail(
    email,
    "Verify your email",
    `<p>Hi ${name},</p><p>Please verify your email by clicking the link below:</p><a href="http://localhost:3000/api/auth/verify-email?token=${rawToken}">Verify Email</a>`,
  );
  console.log("Verification email sent:", sendVerificationEmail);

  return ApiResponse.created(res, "User registered successfully", newUser);
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    throw ApiError.badRequest("Verification token is required");
  }
  const hashedToken = await crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw ApiError.badRequest("Invalid or expired verification token");
  }
  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();
  return ApiResponse.ok(res, "Email verified successfully");
};

export const login = async (req, res) => {
  const { email, password } = await loginSchema.parseAsync(req.body);
  const user = await User.findOne({ email }).select("+password ");
  if (!user) {
    throw ApiError.notFound("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized("Invalid credentials");
  }
  if (!user.isVerified) {
    throw ApiError.unauthorized("Email not verified");
  }
  const refreshToken = generateRefreshToken(user);
  const accessToken = generateAccessToken(user);
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return ApiResponse.ok(res, "Login successful", { accessToken });
};
