import { Router } from "express";
import * as pollController from "./poll.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";
const pollRouter = Router();

pollRouter.post("/create-poll", authMiddleware, pollController.createPoll);
pollRouter.get("/dashboard", authMiddleware, pollController.dashboard);

export default pollRouter;
