import Chat from "../models/chat.model.js";
import File from "../models/file.model.js";
import Project from "../models/project.model.js";

export const getAllChats = async (req, res) => {
  const { _id } = req.user;

  try {
    const chats = await Chat.find({
      $or: [
        { sender: _id },
        { receiver: _id },
        {
          project: {
            $in: await Project.find({
              $or: [{ createdBy: _id }, { members: _id }],
            }).distinct("_id"),
          },
        },
      ],
    })
      .populate("sender", "-password")
      .populate("receiver", "-password")
      .populate("project")
      .sort({ createdAt: -1 });

    if (!chats || chats.length === 0)
      return res.status(404).json({ message: "No chats found" });

    res.status(200).json({
      message: "Chats fetched successfully",
      count: chats.length,
      chats,
    });
  } catch (error) {
    console.error("getAllChats error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

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

export const sendMessageToProject = async (req, res) => {
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

export const uploadFileToProject = async (req, res) => {
  const { id } = req.params; // project ID
  const { sender, attachment, type = "FILE" } = req.body;
  const { name, url } = attachment;
  try {
    if (!name || !url)
      return res.status(400).json({ message: "File name and url is required" });
    const file = await File.create(attachment);

    const chatData = { project: id, sender, attachment: file._id, type };
    const chatCreate = await Chat.create(chatData);
    const chat = chatCreate
      .findById(chatCreate._id)
      .populate("attachment")
      .populate("sender", "-password")
      .populate("project");

    if (!chat) return res.status(404).json({ message: "Chat not created" });
    res.status(200).json({ chat, message: "File uploaded successfully" });
  } catch (error) {
    console.error("uploadFile error", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
