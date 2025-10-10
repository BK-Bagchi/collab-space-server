import express from "express";
import { createTask, getTaskById } from "../controller/task.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const taskRouter = express.Router();

taskRouter.get("/check", (req, res) => {
  res.send("task route");
});

taskRouter.post("/", authMiddleware, createTask);

taskRouter.get("/:id", authMiddleware, getTaskById);

export default taskRouter;
