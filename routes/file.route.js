import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadFile } from "../controller/file.controller.js";

const fileRouter = express.Router();

fileRouter.get("/check", (req, res) => {
  res.send("file route");
});

fileRouter.post("/", authMiddleware, uploadFile);

export default fileRouter;
