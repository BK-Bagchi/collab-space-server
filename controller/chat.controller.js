import Chat from "../models/chat.model.js";

export const getAllChats = async (req, res) => {
  const { id } = req.params; // project ID
  try {
    const chats = await Chat.find({ project: id })
      .populate("sender", "-password")
      .populate("project")
      .sort({ createdAt: -1 });

    if (!chats || chats.length === 0)
      return res.status(404).json({ message: "No chats found" });
    res.status(200).json(chats);
  } catch (error) {
    console.error("getAllChats error", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
