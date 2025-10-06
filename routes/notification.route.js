import express from "express";
import {
  createNotification,
  getAllNotifications,
  getSingleNotification,
  markAsRead,
} from "../controller/notification.controller.js";

const notificationRouter = express.Router();

notificationRouter.get("/check", (req, res) => {
  res.send("notification route");
});

notificationRouter.get("/", getAllNotifications);

notificationRouter.get("/:id", getSingleNotification);

notificationRouter.patch("/:id/read", markAsRead);

notificationRouter.post("/", createNotification);

export default notificationRouter;
