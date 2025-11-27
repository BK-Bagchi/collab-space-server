import Activity from "../models/activity.model.js";
import Note from "../models/note.model.js";
import Notification from "../models/notification.model.js";
import { sendNotification } from "../socket/notification.socket.js";

export const createNote = async (req, res) => {
  const { type, title, content, todos } = req.body;
  req.body.user = req.user._id;

  try {
    if (!title) return res.status(400).json({ message: "Title is required" });
    if (type === "TEXT" && !content)
      return res
        .status(400)
        .json({ message: "Content is required for text notes" });

    if (type === "TODO" && (!todos || todos.length === 0))
      return res.status(400).json({ message: "Todos required for TODO notes" });

    const note = await Note.create(req.body);
    if (!note) return res.status(404).json({ message: "Note not created" });

    await Activity.create({
      user: req.user._id,
      type: "CREATE_NOTE",
      message: `You have created a new note "${note.title}"`,
      relatedNote: note._id,
    });

    const io = req.app.get("io");
    const notification = await Notification.create({
      user: req.user._id,
      type: "NOTE_CREATED",
      message: `You have created a new note "${note.title}"`,
      relatedNote: note._id,
    });
    sendNotification(io, [req.user._id], [notification]);

    res.status(201).json({ note, message: "Note created successfully" });
  } catch (error) {
    console.error("createNote error:", error);
    res.status(500).json({ message: error.message });
  }
};
