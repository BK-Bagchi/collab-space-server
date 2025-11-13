import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    content: String,
    attachment: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
    type: { type: String, enum: ["TEXT", "FILE"], default: "TEXT" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ChatSchema.pre("validate", function (next) {
  if (!this.receiver && !this.project)
    return next(
      new Error("Either 'receiver' or 'project' must be provided in chat.")
    );

  if (this.receiver && this.project)
    return next(
      new Error("Both 'receiver' and 'project' cannot be provided in chat.")
    );
  next();
});

const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;
