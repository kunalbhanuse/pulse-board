import { Router } from "express";
import * as pollController from "./poll.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";
const pollRouter = Router();

pollRouter.post("/create-poll", authMiddleware, pollController.createPoll);
pollRouter.get("/dashboard", authMiddleware, pollController.dashboard);
pollRouter.get("/shareId/:shareId", pollController.getPollByShareId);
pollRouter.post("/shareId/:shareId/vote", pollController.submitVote);
pollRouter.get("/shareId/:shareId/result", pollController.result);

export default pollRouter;
