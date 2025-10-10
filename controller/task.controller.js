import File from "../models/file.model.js";
import Task from "../models/task.model.js";

export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ task, message: "Task created successfully" });
  } catch (error) {
    console.error("createTask error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id)
      .populate("assignees", "-password")
      .populate("project")
      .populate("attachments");
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    console.error("getTaskById error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ task, message: "Task updated successfully" });
  } catch (error) {
    console.error("updateTask error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ task, message: "Task deleted successfully" });
  } catch (error) {
    console.error("deleteTask error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
