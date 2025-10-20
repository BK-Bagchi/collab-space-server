import express from "express";
import {
  assignedTasks,
  createTask,
  deleteTask,
  getFilesOfTask,
  getTaskById,
  updateSubTask,
  updateTask,
  updateTaskStatus,
  uploadTaskAttachment,
} from "../controller/task.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { isManager } from "../middleware/isManager.js";

const taskRouter = express.Router();

taskRouter.get("/check", (req, res) => {
  res.send("task route");
});

taskRouter.post("/", authMiddleware, isManager, createTask);

taskRouter.get("/user", authMiddleware, assignedTasks);

taskRouter.get("/:id", authMiddleware, getTaskById);

taskRouter.put("/:id", authMiddleware, updateTask);

taskRouter.delete("/:id", authMiddleware, deleteTask);

taskRouter.patch("/:id/subtask", authMiddleware, updateSubTask);

taskRouter.patch("/:id/status", authMiddleware, updateTaskStatus);

taskRouter.post("/:id/attachment", authMiddleware, uploadTaskAttachment);

taskRouter.get("/:taskId/files", authMiddleware, getFilesOfTask);

export default taskRouter;
