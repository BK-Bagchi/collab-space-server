import express from "express";
import {
  searchProjects,
  searchTasks,
  searchMessages,
} from "../controller/search.controller.js";

const searchRouter = express.Router();

searchRouter.get("/check", (req, res) => {
  res.send("search route");
});

searchRouter.get("/projects", searchProjects);

searchRouter.get("/tasks", searchTasks);

searchRouter.get("/messages", searchMessages);

export default searchRouter;
