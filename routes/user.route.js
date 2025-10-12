import express from "express";
import {
  getUserProfile,
  getUserById,
  updateUserProfile,
  updatePassword,
} from "../controller/user.controller.js";
import {
  deleteUser,
  getAllUsers,
  updateUserRole,
} from "../controller/admin.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const userRouter = express.Router();

userRouter.get("/check", (req, res) => {
  res.send("user route");
});

userRouter.get("/me", authMiddleware, getUserProfile);

userRouter.put("/me", authMiddleware, updateUserProfile);

userRouter.patch("/me", authMiddleware, updatePassword);

userRouter.get("/:id", authMiddleware, getUserById);

userRouter.get("/", authMiddleware, isAdmin, getAllUsers);

userRouter.put("/:id/role", authMiddleware, isAdmin, updateUserRole);

userRouter.delete("/:id", authMiddleware, isAdmin, deleteUser);

export default userRouter;
