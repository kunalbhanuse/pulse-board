import { nanoid } from "nanoid";
import ApiError from "../../common/utility/ApiError.js";
import ApiResponce from "../../common/utility/ApiResponce.js";
import Poll from "./poll.model.js";
import User from "../auth/auth.model.js";
import Question from "./question.model.js";
import { pollSchema } from "./dto/poll.dto.js";
import Vote from "./vote.model.js";
import { io } from "../../../server.js";

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
  // console.log("USER:", req.user);
  // console.log("HEADERS:", req.headers.authorization);
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw ApiError.unauthorized("unauthorized");
    }

    const polls = await Poll.find({
      createdBy: userId,
      $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }],
    })
      .sort({ createdAt: -1 })
      .populate("createdBy");

    return ApiResponce.ok(res, "Dashboard featch succefully ", polls);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getPollByShareId = async (req, res) => {
  try {
    const { shareId } = req.params;
    if (!shareId) {
      throw ApiError.badRequest("Give a valid shared Id");
    }

    const poll = await Poll.findOne({
      shareId,
      expiresAt: { $gt: new Date() },
    });
    if (!poll) {
      throw ApiError.notFound("Poll not found");
    }
    const questions = await Question.find({ pollId: poll._id });
    if (questions.length === 0) {
      throw ApiError.notFound("question not found !");
    }

    return ApiResponce.ok(res, "Poll feached succefully", { poll, questions });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const submitVote = async (req, res) => {
  try {
    const { shareId } = req.params;
    if (!shareId) {
      throw ApiError.badRequest("Provide shared id ");
    }
    const poll = await Poll.findOne({ shareId });
    if (!poll) {
      throw ApiError.notFound("Poll not found");
    }
    // Auth
    if (poll.requiresAuth && !req.user) {
      throw ApiError.unauthorized("Login required to vote on this poll");
    }
    const { answers } = req.body;
    if (!answers || answers.length === 0) {
      throw ApiError.badRequest("Question and answers are missing ");
    }
    for (let answer of answers) {
      const { questionId, optionId } = answer;
      // console.log("questionId:-", questionId);
      // console.log("optionId:-", optionId);

      const question = await Question.findById(questionId);
      if (!question) {
        throw ApiError.badRequest("Provide the valid question ");
      }
      // console.log("question :- ", question);
      const isValidOption = question.options.some(
        (op) => op._id.toString() === optionId,
      );
      // console.log("isValidOption :- ", isValidOption);
      if (!isValidOption) {
        throw ApiError.badRequest("Provide the valid options");
      }
      const vote = await Vote.create({
        pollId: poll._id,
        questionId,
        optionId,
      });

      io.emit("poll-updated");
      console.log("Vote", vote);
    }

    return ApiResponce.ok(res, "All question and aswer are right ", vote);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const result = async (req, res) => {
  //   finds poll
  // finds questions
  // finds votes
  // counts option selections
  // calculates percentages

  const { shareId } = req.params;
  if (!shareId) {
    throw ApiError.badRequest("Provide shared Id");
  }
  const poll = await Poll.findOne({ shareId });
  if (!poll) {
    throw ApiError.notFound("Poll Not found");
  }
  const questions = await Question.find({ pollId: poll._id });
  if (questions.length === 0) {
    throw ApiError.notFound("Questions not found");
  }
  console.log("Questions : -", questions);
  const votes = await Vote.find({ pollId: poll._id });

  // main
  const results = questions.map((question) => {
    const optionResults = question.options.map((option) => {
      const count = votes.filter(
        (vote) =>
          vote.questionId.toString() === question._id.toString() &&
          vote.optionId.toString() === option._id.toString(),
      ).length;

      return {
        option: option.text,
        count,
      };
    });

    return {
      question: question.question,
      options: optionResults,
    };
  });

  return ApiResponce.ok(res, "Result featched succefully", results);
};
