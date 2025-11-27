import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "CREATE_PROJECT",
        "UPDATE_PROJECT",
        "DELETE_PROJECT",
        "ADD_TASK",
        "UPDATE_TASK",
        "COMPLETE_TASK",
        "DELETE_TASK",
        "ADD_MEMBER",
        "REMOVE_MEMBER",
        "SEND_MESSAGE",
        "UPLOAD_FILE",
        "CREATE_NOTE",
        "UPDATE_NOTE",
        "DELETE_NOTE",
        "ADD_TODO",
        "UPDATE_TODO",
        "DELETE_TODO",
      ],
      required: true,
    },
    message: { type: String, required: true },
    relatedChat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    relatedNote: { type: mongoose.Schema.Types.ObjectId, ref: "Note" },
    relatedTask: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    relatedProject: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", ActivitySchema);
export default Activity;
