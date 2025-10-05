import express from "express";
import { getMe, putMe } from "../controller/user.controller.js";
import {
  deleteUser,
  getAllUsers,
  updateUserRole,
} from "../controller/admin.controller.js";

const userRouter = express.Router();

userRouter.get("/check", (req, res) => {
  res.send("user route");
});

userRouter.get("/me", getMe);

userRouter.put("/me", putMe);

userRouter.get("/user", getAllUsers);

userRouter.put("/user/:id/role", updateUserRole);

userRouter.delete("/user/:id", deleteUser);

export default userRouter;
