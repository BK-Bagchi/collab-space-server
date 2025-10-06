import Chat from "../models/chat.model.js";

export const getAllChatsOfProject = async (req, res) => {
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

export const sendMessage = async (req, res) => {
  const { id } = req.params; // project ID
  const { sender, content } = req.body;
  try {
    const chatData = { project: id, sender, content };
    const chat = await Chat.create(chatData);

    if (!chat) return res.status(404).json({ message: "Chat not created" });
    res.status(200).json({ chat, message: "Message sent successfully" });
  } catch (error) {
    console.error("sendMessage error", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const uploadFile = async (req, res) => {
  const { id } = req.params; // project ID
  const { sender, attachment, type = "FILE" } = req.body;
  try {
    const chatData = { project: id, sender, attachment, type };
    const chat = await Chat.create(chatData);

    if (!chat) return res.status(404).json({ message: "Chat not created" });
    res.status(200).json({ chat, message: "File uploaded successfully" });
  } catch (error) {
    console.error("uploadFile error", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Search and Filtering
export const searchMessages = async (req, res) => {
  const { q, projectId } = req.query;

  try {
    const filter = {};

    if (projectId) filter.project = projectId;

    // Helper to escape regex special characters
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Text search by keyword
    if (q) {
      const regex = new RegExp(escapeRegex(q), "i");
      filter.content = regex;
    }

    const chat = await Chat.find(filter)
      .populate("sender", "-password")
      .populate("project")
      .sort({ createdAt: -1 });

    if (!chat.length) return res.status(404).json({ message: "No chat found" });

    res.status(200).json({
      chat,
      message: `Found ${chat.length} message(s) matching ${q} ${projectId}`,
    });
  } catch (error) {
    console.error("searchMessages error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};
