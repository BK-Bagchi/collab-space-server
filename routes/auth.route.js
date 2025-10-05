import express from "express";

const authRouter = express.Router();

authRouter.get("/check", (req, res) => {
  res.send("Auth route");
});

export default authRouter;
