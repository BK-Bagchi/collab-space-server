import Task from "../models/task.model.js";

// Search & Filtering controller
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
