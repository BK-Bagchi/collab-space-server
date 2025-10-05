import express from "express";
import {
  getUserProfile,
  getUserById,
  updateUserProfile,
} from "../controller/user.controller.js";
import {
  deleteUser,
  getAllUsers,
  updateUserRole,
} from "../controller/admin.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/check", (req, res) => {
  res.send("user route");
});

userRouter.get("/me", authMiddleware, getUserProfile);

userRouter.put("/me", authMiddleware, updateUserProfile);

userRouter.get("/user/:id", getUserById);

userRouter.get("/user", getAllUsers);

userRouter.put("/user/:id/role", updateUserRole);

userRouter.delete("/user/:id", deleteUser);

export default userRouter;
