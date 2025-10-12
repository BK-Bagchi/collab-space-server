import express from "express";
import {
  getOverdueTaskOfUser,
  getProjectStats,
  getTeamProductivity,
} from "../controller/dashboard.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/check", (req, res) => {
  res.send("dashboard route");
});

dashboardRouter.get("/project/:projectId", authMiddleware, getProjectStats);

dashboardRouter.get("/team", authMiddleware, getTeamProductivity);

dashboardRouter.get("/overdue-tasks", authMiddleware, getOverdueTaskOfUser);

export default dashboardRouter;
