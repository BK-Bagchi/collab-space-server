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

export const getSingleNotification = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findById(id)
      .populate("user", "-password")
      .populate("relatedProject")
      .populate("relatedTask");

    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res
      .status(200)
      .json({ notification, message: "Notification fetched successfully" });
  } catch (error) {
    console.log("getSingleNotifications error", error);
    res.status(500).json({ message: error.message });
  }
};
