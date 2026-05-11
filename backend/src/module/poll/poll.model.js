import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shareId: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    requiresAuth: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Poll", pollSchema);
