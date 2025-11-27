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

export const getUserNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id })
      .populate("relatedTask")
      .populate("relatedProject")
      .sort({ pinned: -1, updatedAt: -1 });

    if (!notes || notes.length === 0)
      return res.status(404).json({ message: "No notes found" });

    res.status(200).json({ notes, message: `Found ${notes.length} notes` });
  } catch (error) {
    console.error("getAllNotes error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getNoteDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findById(id)
      .populate("relatedTask")
      .populate("relatedProject");
    if (!note) return res.status(404).json({ message: "Note not found" });

    res
      .status(200)
      .json({ note, message: "Note details fetched successfully" });
  } catch (error) {
    console.error("getNoteById error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateNote = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findByIdAndUpdate(id, req.body, { new: true })
      .populate("relatedTask")
      .populate("relatedProject");
    if (!note)
      return res.status(404).json({ message: "Note not found and updated" });

    await Activity.create({
      user: req.user._id,
      type: "UPDATE_NOTE",
      message: `You have updated the note "${note.title}"`,
      relatedNote: note._id,
    });

    res.status(200).json({ note, message: "Note updated successfully" });
  } catch (error) {
    console.error("updateNote error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findByIdAndDelete(id)
      .populate("relatedTask")
      .populate("relatedProject");

    if (!note) return res.status(404).json({ message: "Note not found" });

    await Activity.create({
      user: req.user._id,
      type: "DELETE_NOTE",
      message: `You have deleted the note "${note.title}"`,
      relatedNote: note._id,
    });

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("deleteNote error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const togglePin = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findByIdAndUpdate(
      id,
      [{ $set: { pinned: { $not: "$pinned" } } }],
      { new: true }
    )
      .populate("relatedTask")
      .populate("relatedProject");

    if (!note) return res.status(404).json({ message: "Note not found" });
    res
      .status(200)
      .json({ note, message: `Note ${note.pinned ? "pinned" : "unpinned"}` });
  } catch (error) {
    console.error("togglePin error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const toggleArchive = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findByIdAndUpdate(
      id,
      [{ $set: { archived: { $not: "$archived" } } }],
      { new: true }
    )
      .populate("relatedTask")
      .populate("relatedProject");

    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json({
      note,
      message: `Note ${
        note.archived ? "added to archive" : "removed from archive"
      }`,
    });
  } catch (error) {
    console.error("toggleArchive error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const searchNotes = async (req, res) => {
  const { q } = req.query;
  try {
    if (!q || q.trim() === "")
      return res.status(400).json({ message: "Search query is required" });

    const notes = await Note.find({
      user: req.user._id,
      $text: { $search: q },
    })
      .populate("relatedTask")
      .populate("relatedProject")
      .sort({ pinned: -1, updatedAt: -1 });

    res.status(200).json({ notes, message: `Found ${notes.length} notes` });
  } catch (error) {
    console.error("searchNotes error:", error);
    res.status(500).json({ message: error.message });
  }
};
