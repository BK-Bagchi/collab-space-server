import Notification from "../models/notification.model";

export const getAllNotifications = async (req, res) => {
  const { _id } = req.user;
  try {
    const notifications = await Notification.find({ user: _id })
      .populate("user", "-password")
      .populate("relatedProject")
      .populate("relatedTask")
      .sort({ createdAt: -1 });

    if (!notifications || notifications.length === 0)
      return res.status(404).json({ message: "Notification not found" });
    res
      .status(200)
      .json({ notifications, message: "Notifications fetched successfully" });
  } catch (error) {
    console.log("getAllNotifications error", error);
    res.status(500).json({ message: error.message });
  }
};
