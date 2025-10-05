import express from "express";

const projectRouter = express.Router();

projectRouter.get("/check", (req, res) => {
  res.send("Project route");
});

export default projectRouter;
