import express from "express";
import {
  createProject,
  deleteProject,
  getProjectDetails,
  getProjectMembers,
  getUserProjects,
  inviteMember,
  updateProject,
} from "../controller/project.controller.js";

const projectRouter = express.Router();

projectRouter.get("/check", (req, res) => {
  res.send("Project route");
});

projectRouter.post("/", createProject);

projectRouter.get("/user", getUserProjects);

projectRouter.get("/:id", getProjectDetails);

projectRouter.put("/:id", updateProject);

projectRouter.delete("/:id", deleteProject);

projectRouter.post("/:id/invite", inviteMember);

projectRouter.get("/:id/members", getProjectMembers);

export default projectRouter;
