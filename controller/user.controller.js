import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  const { _id } = req.user;
  try {
    // const user = await User.findById(req.user._id);
    const user = await User.findById(_id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
export const updateUserProfile = async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findByIdAndUpdate(_id, req.body).select(
      "-password"
    );
    if (!user) return res.status(404).json({ message: "User not updated" });
    res.status(200).json({ user, message: "User updated successfully" });
  } catch (error) {
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
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
