import express from "express";
import { searchProjects } from "../controller/project.controller.js";
import { searchTasks } from "../controller/task.controller.js";
import { searchMessages } from "../controller/chat.controller.js";

const searchRouter = express.Router();

searchRouter.get("/check", (req, res) => {
  res.send("search route");
});

searchRouter.get("/projects", searchProjects);

searchRouter.get("/tasks", searchTasks);

searchRouter.get("/messages", searchMessages);

export default searchRouter;
