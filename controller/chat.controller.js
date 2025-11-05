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

export const getLastProjectChats = async (req, res) => {
  const { _id } = req.user;
  try {
    const projectIds = await Project.find({
      $or: [{ createdBy: _id }, { members: _id }],
    }).distinct("_id");

    const lastMessages = await Chat.aggregate([
      { $match: { project: { $in: projectIds } } },
      { $sort: { createdAt: -1 } },

      // Group by project and take the first (latest) chat per project
      {
        $group: {
          _id: "$project",
          lastMessage: { $first: "$content" },
          sender: { $first: "$sender" },
          createdAt: { $first: "$createdAt" },
        },
      },

      // Populate project details
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "project",
        },
      },
      { $unwind: "$project" },

      // Populate sender details
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "sender",
        },
      },
      { $unwind: "$sender" },

      // Final projection for cleaner output
      {
        $project: {
          _id: 0,
          project: { _id: 1, title: 1, color: 1 },
          lastMessage: 1,
          sender: { _id: 1, name: 1, avatar: 1 },
          createdAt: 1,
        },
      },

      // Sort by most recent chats
      { $sort: { createdAt: -1 } },
    ]);

    if (!lastMessages || lastMessages.length === 0)
      return res.status(404).json({ message: "No chats found" });

    res.status(200).json({
      message: "Last messages fetched successfully",
      chats: lastMessages,
    });
  } catch (error) {
    console.error("getLastProjectChats error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
    });
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
