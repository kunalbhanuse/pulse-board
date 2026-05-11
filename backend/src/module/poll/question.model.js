import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    isRequired: {
      type: Boolean,
      default: false,
    },

    options: [
      {
        text: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Question", questionSchema);
