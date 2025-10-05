import express from "express";
import { getMe, putMe } from "../controller/user.controller.js";

const userRouter = express.Router();

userRouter.get("/check", (req, res) => {
  res.send("user route");
});

userRouter.get("/me", getMe);

userRouter.put("/me", putMe);

export default userRouter;
