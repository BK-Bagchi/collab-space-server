import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: String,
    attachments: [String],
    type: { type: String, enum: ["TEXT", "FILE"], default: "TEXT" },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", ChatSchema);
