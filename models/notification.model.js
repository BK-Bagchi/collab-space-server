import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "TASK_ASSIGNED",
        "TASK_UPDATED",
        "MENTION",
        "PROJECT_INVITE",
        "ROLE_UPDATE",
        "REMOVED_FROM_PROJECT",
        "NOTE_CREATED",
        "TODO_CREATED",
      ],
      required: true,
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    relatedChat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    relatedNote: { type: mongoose.Schema.Types.ObjectId, ref: "Note" },
    relatedTask: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    relatedProject: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
