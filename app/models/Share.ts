import mongoose from "mongoose";

const ShareSchema = new mongoose.Schema(
  {
    hash: {
      type: String,
      required: true,
      unique: true,
    },
    shortId: {
      type: String,
      required: true,
    },
    codeContent: {
      type: String,
      required: true,
    },
    explainedCode: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ["fast", "detailed"],
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Share ||
  mongoose.model("Share", ShareSchema, "shares");
