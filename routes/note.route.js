import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { checkNoteOwner } from "../middleware/checkNoteOwner.js";
import {
  createNote,
  createTodo,
  deleteNote,
  getNoteDetails,
  getUserNotes,
  searchNotes,
  toggleArchive,
  togglePin,
  updateNote,
  updateTodo,
} from "../controller/note.controller.js";

const noteRouter = express.Router();

noteRouter.get("/check", (req, res) => {
  res.send("note route");
});

noteRouter.post("/", authMiddleware, createNote);

noteRouter.get("/", authMiddleware, getUserNotes);

noteRouter.get("/:id", authMiddleware, checkNoteOwner, getNoteDetails);

noteRouter.put("/:id", authMiddleware, checkNoteOwner, updateNote);

noteRouter.delete("/:id", authMiddleware, checkNoteOwner, deleteNote);

noteRouter.patch("/:id/pin", authMiddleware, checkNoteOwner, togglePin);

noteRouter.patch("/:id/archive", authMiddleware, checkNoteOwner, toggleArchive);

noteRouter.get("/search", authMiddleware, searchNotes);

noteRouter.post("/todo", authMiddleware, createTodo);

noteRouter.put("/:id/todo", authMiddleware, checkNoteOwner, updateTodo);

export default noteRouter;
