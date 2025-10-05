import express from "express";

const notificationRouter = express.Router();

notificationRouter.get("/check", (req, res) => {
  res.send("notification route");
});

export default notificationRouter;
