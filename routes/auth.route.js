import express from "express";
import rateLimit from "express-rate-limit";
import { login, signup } from "../controller/auth.controller.js";

const authRouter = express.Router();

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Try again after 10 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

authRouter.get("/check", (req, res) => {
  res.send("Auth route");
});

authRouter.post("/signup", signup);

authRouter.post("/login", loginLimiter, login);

export default authRouter;
