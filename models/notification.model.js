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
      ],
      required: true,
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    relatedChat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    relatedTask: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    relatedProject: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
