import express from "express";

const userRouter = express.Router();

userRouter.get("/check", (req, res) => {
  res.send("user route");
});

export default userRouter;
