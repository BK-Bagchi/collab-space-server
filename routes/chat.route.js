import express from "express";
import {
  getAllChatsOfProject,
  sendMessageToProject,
  uploadFileToProject,
} from "../controller/chat.controller.js";

const chatRouter = express.Router();

chatRouter.get("/check", (req, res) => {
  res.send("chat route");
});

chatRouter.get("/:id", getAllChatsOfProject);

chatRouter.post("/:id", sendMessageToProject);

chatRouter.post("/:id/attachment", uploadFileToProject);

export default chatRouter;
