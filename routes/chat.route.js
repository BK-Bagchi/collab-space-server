import express from "express";
import {
  getAllChatsOfProject,
  sendMessage,
  uploadFile,
} from "../controller/chat.controller.js";

const chatRouter = express.Router();

chatRouter.get("/check", (req, res) => {
  res.send("chat route");
});

chatRouter.get("/:id", getAllChatsOfProject);

chatRouter.post("/:id", sendMessage);

chatRouter.post("/:id/attachment", uploadFile);

export default chatRouter;
