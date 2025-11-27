import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createNote,
  getNoteDetails,
  getUserNotes,
  updateNote,
} from "../controller/note.controller.js";
import { checkNoteOwner } from "../middleware/checkNoteOwner.js";

const noteRouter = express.Router();

noteRouter.get("/check", (req, res) => {
  res.send("note route");
});

noteRouter.post("/", authMiddleware, createNote);

noteRouter.get("/", authMiddleware, getUserNotes);

noteRouter.get("/:id", authMiddleware, checkNoteOwner, getNoteDetails);

noteRouter.put("/:id", authMiddleware, checkNoteOwner, updateNote);

export default noteRouter;
