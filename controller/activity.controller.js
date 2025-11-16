import Activity from "../models/activity.model.js";

export const getUserActivity = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id })
      .populate("user", "-password")
      .sort({ createdAt: -1 });
    if (!activities)
      return res.status(404).json({ message: "No activities found" });

    res
      .status(200)
      .json({ activities, message: `Found ${activities.length} activities` });
  } catch (error) {
    console.error("getUserActivity error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
