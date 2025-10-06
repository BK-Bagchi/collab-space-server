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
    attachment: String,
    type: { type: String, enum: ["TEXT", "FILE"], default: "TEXT" },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;
