import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["TEXT", "TODO"],
      default: "TEXT",
      required: true,
    },
    content: String,
    todos: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        text: { type: String, required: true },
        done: { type: Boolean, default: false },
      },
    ],
    pinned: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    tags: { type: [String] },
    color: { type: String, default: "#2979ff" },
    visibility: {
      type: String,
      enum: ["PRIVATE", "PROJECT"],
      default: "PRIVATE",
    },
    relatedTask: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    relatedProject: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  },
  { timestamps: true }
);

NoteSchema.index({ title: "text", content: "text", tags: "text" });

const Note = mongoose.model("Note", NoteSchema);
export default Note;
