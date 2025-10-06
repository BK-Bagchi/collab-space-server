import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import Chat from "../models/chat.model.js";

export const searchTasks = async (req, res) => {
  const { q, status, assignees } = req.query;
  try {
    const filter = {};
    // Helper to escape regex special characters
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Keyword filter (title or description)
    if (q) {
      const regex = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ title: regex }, { description: regex }];
    }

    // Status filter
    if (status) filter.status = status;
    // Assignee filter (supports multiple IDs)
    if (assignees) {
      const ids = assignees.split(",").map((id) => id.trim());
      filter.assignees = { $in: ids };
    }

    const tasks = await Task.find(filter)
      .populate("assignees", "-password")
      .populate("project")
      .sort({ createdAt: -1 });

    if (!tasks || tasks.length === 0)
      return res.status(404).json({ message: "No tasks found" });

    res.status(200).json({
      tasks,
      message: `Found ${tasks.length} task(s) matching ${q} ${status} ${assignees}`,
    });
  } catch (error) {
    console.error("searchTasks error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const searchProjects = async (req, res) => {
  const { q } = req.query; // search keyword

  try {
    if (!q || q.trim() === "")
      return res.status(200).json({ message: "No search keyword provided" });

    // case-insensitive search using regex
    const regex = new RegExp(q, "i");
    const projects = await Project.find({
      $or: [{ title: regex }, { description: regex }],
    })
      .populate("createdBy", "-password")
      .populate("members", "-password")
      .sort({ createdAt: -1 });

    if (!projects.length)
      return res.status(404).json({ message: "No projects found" });

    res.status(200).json({
      projects,
      message: `Found ${projects.length} project(s) matching "${q}"`,
    });
  } catch (error) {
    console.error("searchProjects error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

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
