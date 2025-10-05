import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
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
      enum: ["low", "medium", "high"],
      default: "low",
    },
    attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
    subtasks: [{ title: String, done: Boolean }],
  },
  { timestamps: true }
);

export default mongoose.model("Task", TaskSchema);
