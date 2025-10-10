import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    name: String,
    url: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    version: Number,
  },
  { timestamps: true }
);

const File = mongoose.model("File", FileSchema);
export default File;
