import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "DONE"],
      default: "TODO",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dueDate: Date,
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW",
    },
    attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
    subtasks: [
      {
        title: { type: String, required: true },
        done: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);
export default Task;
