import express from "express";
import { createTask } from "../controller/task.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const taskRouter = express.Router();

taskRouter.get("/check", (req, res) => {
  res.send("task route");
});

taskRouter.post("/", authMiddleware, createTask);

export default taskRouter;
