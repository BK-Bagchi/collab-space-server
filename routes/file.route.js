import express from "express";

const fileRouter = express.Router();

fileRouter.get("/check", (req, res) => {
  res.send("file route");
});

export default fileRouter;
