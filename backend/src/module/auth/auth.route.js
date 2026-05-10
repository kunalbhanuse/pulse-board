import { Router } from "express";
import * as authController from "./auth.controller.js";

const authRouter = Router();
authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.get("/verify-email", authController.verifyEmail);

export default authRouter;
