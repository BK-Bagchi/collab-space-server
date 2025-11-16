import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getUserActivity } from "../controller/activity.controller.js";

const activityRouter = express.Router();

activityRouter.get("/check", (req, res) => {
  res.send("activity route");
});

activityRouter.get("/user", authMiddleware, getUserActivity);

export default activityRouter;
