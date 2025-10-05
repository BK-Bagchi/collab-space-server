import express from "express";
import { login, signup } from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.get("/check", (req, res) => {
  res.send("Auth route");
});

authRouter.post("/signup", signup);

authRouter.post("/login", login);

export default authRouter;
