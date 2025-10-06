import express from "express";
import { searchProjects } from "../controller/project.controller.js";

const searchRouter = express.Router();

searchRouter.get("/check", (req, res) => {
  res.send("search route");
});

searchRouter.get("/projects", searchProjects);

export default searchRouter;
