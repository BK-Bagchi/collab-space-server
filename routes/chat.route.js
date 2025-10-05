import express from "express";

const chatRouter = express.Router();

chatRouter.get("/check", (req, res) => {
  res.send("chat route");
});

export default chatRouter;
