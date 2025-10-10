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

export const updateSubTask = async (req, res) => {
  const { id } = req.params;
  const { action, subtasks } = req.body;
  //gets req.body.subTaskId for update and delete
  //   68e8df15c8e832d9dd82acd4

  try {
    let task;

    // 🟢 ADD a new subtask
    if (action === "add") {
      if (!subtasks?.title)
        return res.status(400).json({ message: "Sub task title is required" });

      task = await Task.findByIdAndUpdate(
        id,
        { $push: { subtasks } },
        { new: true }
      );
    }
    // 🟡 UPDATE an existing subtask
    else if (action === "update") {
      if (!req.body.subTaskId)
        return res.status(400).json({ message: "Sub task id is required" });

      const updateFields = {};
      if (subtasks?.title !== undefined)
        updateFields["subtasks.$.title"] = subtasks.title;

      if (subtasks?.done !== undefined)
        updateFields["subtasks.$.done"] = subtasks.done;

      task = await Task.findOneAndUpdate(
        { _id: id, "subtasks._id": req.body.subTaskId },
        { $set: updateFields },
        { new: true }
      );
    }
    // 🔴 REMOVE a subtask
    else if (action === "remove") {
      if (!req.body.subTaskId)
        return res.status(400).json({ message: "Sub task id is required" });

      task = await Task.findByIdAndUpdate(
        id,
        { $pull: { subtasks: { _id: req.body.subTaskId } } },
        { new: true }
      );
    }
    if (!task) return res.status(404).json({ message: "Task not found" });

    const messages = {
      add: "Sub task added successfully",
      update: "Sub task updated successfully",
      remove: "Sub task removed successfully",
    };
    res.status(200).json({ task, message: messages[action] });
  } catch (error) {
    console.error("updateSubTask error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const allowedStatuses = ["TODO", "IN_PROGRESS", "DONE"];
    if (!allowedStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ task, message: "Task status updated successfully" });
  } catch (error) {
    console.error("updateSubTask error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const uploadTaskAttachment = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.body.name || !req.body.url)
      return res.status(400).json({ message: "File name and url is required" });

    const uploadFile = await File.create(req.body);
    if (!uploadFile)
      return res.status(404).json({ message: "File not created" });

    const task = await Task.findByIdAndUpdate(
      id,
      { $push: { attachments: uploadFile._id } },
      { new: true }
    )
      .populate("project")
      .populate("assignees", "-password")
      .populate("attachments");

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ task, message: "Attachment uploaded successfully" });
  } catch (error) {
    console.error("uploadTaskAttachment error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
