import express from "express";
import rateLimit from "express-rate-limit";
import {
  login,
  oauthLogin,
  signup,
  verifyToken,
} from "../controller/auth.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

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

authRouter.post("/oauth", loginLimiter, oauthLogin);

authRouter.get("/verify", authMiddleware, verifyToken);

export default authRouter;
