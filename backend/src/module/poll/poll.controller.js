import { nanoid } from "nanoid";
import ApiError from "../../common/utility/ApiError.js";
import ApiResponce from "../../common/utility/ApiResponce.js";
import Poll from "./poll.model.js";
import User from "../auth/auth.model.js";
import Question from "./question.model.js";
import { pollSchema } from "./dto/poll.dto.js";

export const createPoll = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized("You are not authorized to create poll");
    }

    const validateReqBody = await pollSchema.parseAsync(req.body);
    const { title, description, requiresAuth, expiresAt, questions } =
      validateReqBody;
    const shareId = nanoid(10);

    const poll = await Poll.create({
      title,
      description,
      createdBy: user._id,
      shareId,
      expiresAt,
      requiresAuth,
    });

    const createQuestion = await Question.insertMany(
      questions.map((q) => ({
        pollId: poll._id,
        question: q.question,
        options: q.options,
        isRequired: q.isRequired || false,
      })),
    );

    return ApiResponce.created(res, "Poll created successfully", {
      poll,
      questions: createQuestion,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const dashboard = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw ApiError.unauthorized("unauthorized");
    }

    const poll = await Poll.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .populate("createdBy");
    if (!poll) {
      throw ApiError.badRequest("Poll not found");
    }
    return ApiResponce.ok(res, "Dashboard featch succefully ", poll);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};
