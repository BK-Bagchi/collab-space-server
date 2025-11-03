import express from "express";
import {
  getAllChats,
  getAllChatsOfProject,
  sendMessageToProject,
  uploadFileToProject,
} from "../controller/chat.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const chatRouter = express.Router();

chatRouter.get("/check", (req, res) => {
  res.send("chat route");
});

chatRouter.get("/", authMiddleware, getAllChats);

chatRouter.get("/:id", authMiddleware, getAllChatsOfProject);

chatRouter.post("/:id", authMiddleware, sendMessageToProject);

chatRouter.post("/:id/attachment", authMiddleware, uploadFileToProject);

export default chatRouter;
