import Activity from "../models/activity.model.js";
import File from "../models/file.model.js";
import Notification from "../models/notification.model.js";
import Task from "../models/task.model.js";
import { sendNotification } from "../socket/notification.socket.js";

export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);

    const activityLog = await Activity.create({
      user: req.user._id,
      type: "ADD_TASK",
      message: `You created a new task "${task.title}"`,
      relatedTask: task._id,
    });
    if (!activityLog)
      return res.status(400).json({ message: "Activity log not created" });

    //prettier-ignore
    const assignees = Array.isArray(req.body.assignees) ? req.body.assignees : [];
    const io = req.app.get("io");
    if (assignees.length > 0) {
      const notifications = await Promise.all(
        assignees.map((assignee) =>
          Notification.create({
            user: assignee,
            type: "TASK_ASSIGNED",
            message: `You have been assigned to a new task "${task.title}"`,
            relatedTask: task._id,
          })
        )
      );

      sendNotification(io, assignees, notifications);
    }

    res.status(201).json({ task, message: "Task created successfully" });
  } catch (error) {
    console.error("createTask error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const assignedTasks = async (req, res) => {
  const { _id } = req.user;
  try {
    const tasks = await Task.find({ assignees: _id })
      .populate("assignees", "-password")
      .populate("project")
      .populate("attachments")
      .sort({ createdAt: -1 });
    if (!tasks || tasks.length === 0)
      return res
        .status(404)
        .json({ message: "User is not assigned to any tasks yet" });

    res
      .status(200)
      .json({ tasks, message: `Found ${tasks.length} tasks assigned to you.` });
  } catch (error) {
    console.error("assignedTasks error:", error);
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

    const activityLog = await Activity.create({
      user: req.user._id,
      type: "UPDATE_TASK",
      message: `You updated the task "${task.title}"`,
      relatedTask: task._id,
    });
    if (!activityLog)
      return res.status(400).json({ message: "Activity log not created" });

    //prettier-ignore
    const assignees = Array.isArray(req.body.assignees) ? req.body.assignees : [];
    const io = req.app.get("io");
    if (assignees.length > 0) {
      const notifications = await Promise.all(
        assignees.map((assignee) =>
          Notification.create({
            user: assignee,
            type: "TASK_UPDATED",
            message: `The task "${task.title}" has been updated`,
            relatedTask: task._id,
          })
        )
      );

      sendNotification(io, assignees, notifications);
    }

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

    const activityLog = await Activity.create({
      user: req.user._id,
      type: "DELETE_TASK",
      message: `You deleted the task "${task.title}"`,
      relatedTask: task._id,
    });
    if (!activityLog)
      return res.status(400).json({ message: "Activity log not created" });

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

      if (!subtasks?.title)
        return res.status(400).json({ message: "Sub task title is required" });
      if (subtasks?.done === undefined)
        return res.status(400).json({ message: "Sub task status is required" });

      updateFields["subtasks.$.title"] = subtasks.title;
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

    if (status === "DONE") {
      const activityLog = await Activity.create({
        user: req.user._id,
        type: "COMPLETE_TASK",
        message: `You completed the task "${task.title}"`,
        relatedTask: task._id,
      });
      if (!activityLog)
        return res.status(400).json({ message: "Activity log not created" });
    }

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

export const getFilesOfTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const files = await File.find({ task: taskId })
      .populate("project")
      .populate("uploadedBy", "-password")
      .populate("task")
      .sort({ createdAt: -1 });

    if (!files.length)
      return res.status(404).json({ message: "No files found for this task" });

    res.status(200).json({ files, message: `Found ${files.length} files` });
  } catch (error) {
    console.error("getFilesOfTask error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
