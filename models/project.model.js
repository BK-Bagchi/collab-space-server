import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    color: String, // project color for UI
    deadline: Date,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

ProjectSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "project",
});

ProjectSchema.set("toObject", { virtuals: true });
ProjectSchema.set("toJSON", { virtuals: true });

const Project = mongoose.model("Project", ProjectSchema);
export default Project;
