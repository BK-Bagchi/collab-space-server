import express from "express";

const dashboardRouter = express.Router();

dashboardRouter.get("/check", (req, res) => {
  res.send("dashboard route");
});

export default dashboardRouter;
