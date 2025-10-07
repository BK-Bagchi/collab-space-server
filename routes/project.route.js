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
import authMiddleware from "../middleware/authMiddleware.js";

const projectRouter = express.Router();

projectRouter.get("/check", (req, res) => {
  res.send("Project route");
});

projectRouter.post("/", authMiddleware, createProject);

projectRouter.get("/user", authMiddleware, getUserProjects);

projectRouter.get("/:id", authMiddleware, getProjectDetails);

projectRouter.put("/:id", authMiddleware, updateProject);

projectRouter.delete("/:id", authMiddleware, deleteProject);

projectRouter.post("/:id/invite", authMiddleware, inviteMember);

projectRouter.get("/:id/members", authMiddleware, getProjectMembers);

export default projectRouter;
