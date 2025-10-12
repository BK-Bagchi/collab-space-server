import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("getUserProfile error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
export const updateUserProfile = async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not updated" });
    res.status(200).json({ user, message: "User updated successfully" });
  } catch (error) {
    console.error("updateUserProfile error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updatePassword = async (req, res) => {
  const { _id } = req.user;
  const { currentPassword, newPassword, confirmPassword } = req.body;
  try {
    const user = await User.findById(_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const validatePassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!validatePassword)
      return res.status(401).json({ message: "Invalid password" });
    if (newPassword !== confirmPassword)
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("updatePassword error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("getUserById error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
