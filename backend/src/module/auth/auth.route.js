import { Router } from "express";
import * as authController from "./auth.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const authRouter = Router();
authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.get("/verify-email", authController.verifyEmail);
authRouter.get("/me", authMiddleware, authController.me);

export default authRouter;
