import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  deleteFile,
  getFileById,
  uploadFile,
} from "../controller/file.controller.js";

const fileRouter = express.Router();

fileRouter.get("/check", (req, res) => {
  res.send("file route");
});

fileRouter.post("/", authMiddleware, uploadFile);

fileRouter.get("/:id", authMiddleware, getFileById);

fileRouter.delete("/:id", authMiddleware, deleteFile);

export default fileRouter;
