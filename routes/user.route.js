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

userRouter.get("/:id", getUserById);

userRouter.get("/", getAllUsers);

userRouter.put("/:id/role", updateUserRole);

userRouter.delete("/:id", deleteUser);

export default userRouter;
