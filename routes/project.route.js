import express from "express";
import {
  createProject,
  deleteProject,
  getFilesOfProject,
  getProjectDetails,
  getProjectMembers,
  getTasksOfProject,
  getUserProjects,
  inviteMember,
  updateProject,
} from "../controller/project.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { checkProjectPermission } from "../middleware/checkProjectPermission.js";
import { isManager } from "../middleware/isManager.js";

const projectRouter = express.Router();

projectRouter.get("/check", (req, res) => {
  res.send("Project route");
});

projectRouter.post("/", authMiddleware, isManager, createProject);

projectRouter.get("/user", authMiddleware, getUserProjects);

projectRouter.get("/:id", authMiddleware, getProjectDetails);

// prettier-ignore
projectRouter.put(
  "/:id", authMiddleware, checkProjectPermission, updateProject
);

// prettier-ignore
projectRouter.delete(
  "/:id", authMiddleware, checkProjectPermission, deleteProject
);

projectRouter.post("/:id/invite", authMiddleware, inviteMember);

projectRouter.get("/:id/members", authMiddleware, getProjectMembers);

projectRouter.get("/:projectId/tasks", authMiddleware, getTasksOfProject);

projectRouter.get("/:projectId/files", authMiddleware, getFilesOfProject);

export default projectRouter;
