import express from "express";
import {
  createNotification,
  getAllNotifications,
  getSingleNotification,
  markAllAsRead,
  markAsRead,
} from "../controller/notification.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const notificationRouter = express.Router();

notificationRouter.get("/check", (req, res) => {
  res.send("notification route");
});

notificationRouter.get("/", authMiddleware, getAllNotifications);

notificationRouter.get("/:id", authMiddleware, getSingleNotification);

notificationRouter.patch("/:id/read", authMiddleware, markAsRead);

notificationRouter.patch("/readAll", authMiddleware, markAllAsRead);

notificationRouter.post("/", authMiddleware, createNotification);

export default notificationRouter;
