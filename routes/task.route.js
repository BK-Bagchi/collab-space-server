import express from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  updateTask,
} from "../controller/task.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const taskRouter = express.Router();

taskRouter.get("/check", (req, res) => {
  res.send("task route");
});

taskRouter.post("/", authMiddleware, createTask);

taskRouter.get("/:id", authMiddleware, getTaskById);

taskRouter.put("/:id", authMiddleware, updateTask);

taskRouter.delete("/:id", authMiddleware, deleteTask);

export default taskRouter;
