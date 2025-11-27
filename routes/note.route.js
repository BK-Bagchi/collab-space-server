import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createNote } from "../controller/note.controller.js";

const noteRouter = express.Router();

noteRouter.get("/check", (req, res) => {
  res.send("note route");
});

noteRouter.post("/", authMiddleware, createNote);

export default noteRouter;
