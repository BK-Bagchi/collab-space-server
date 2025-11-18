import Activity from "../models/activity.model.js";
import Project from "../models/project.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import Task from "../models/task.model.js";
import File from "../models/file.model.js";
import { sendNotification } from "../socket/active.socket.js";

export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    if (!project)
      return res.status(400).json({ message: "Project not created" });

    const activityLog = await Activity.create({
      user: req.user._id,
      type: "CREATE_PROJECT",
      message: `You created a new project "${project.title}"`,
      relatedProject: project._id,
    });
    if (!activityLog)
      return res.status(400).json({ message: "Activity log not created" });

    const members = Array.isArray(req.body.members) ? req.body.members : [];
    const io = req.app.get("io");
    if (members.length > 0) {
      const notifications = await Promise.all(
        members.map((member) =>
          Notification.create({
            user: member,
            type: "PROJECT_INVITE",
            message: `You have been invited to join a new project "${project.title}"`,
            relatedProject: project._id,
          })
        )
      );

      sendNotification(io, members, notifications);
    }

    return res
      .status(201)
      .json({ project, message: "Project created successfully" });
  } catch (error) {
    console.error("createProject error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getUserProjects = async (req, res) => {
  const { _id } = req.user; // req.user._id from auth middleware

  try {
    // 1️⃣ Projects created by the user
    const createdProjects = await Project.find({ createdBy: _id })
      .populate("createdBy", "-password")
      .populate("members", "-password")
      .populate({
        path: "tasks",
        populate: { path: "assignees", select: "-password" }, // optional
      })
      .sort({ createdAt: -1 });

    // 2️⃣ Projects where user is a member but not the creator
    const memberProjects = await Project.find({
      members: _id,
      createdBy: { $ne: _id },
    })
      .populate("createdBy", "-password")
      .populate("members", "-password")
      .populate({
        path: "tasks",
        populate: { path: "assignees", select: "-password" }, // optional
      })
      .sort({ createdAt: -1 });

    if (createdProjects.length === 0 && memberProjects.length === 0)
      return res.status(404).json({ message: "User has no projects" });

    const projects = [...createdProjects, ...memberProjects];

    res.status(200).json({
      projects,
      totalCreated: createdProjects.length,
      totalMember: memberProjects.length,
      message: "Projects fetched successfully",
    });
  } catch (error) {
    console.error("getUserProjects error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

export const getProjectDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id)
      .populate("createdBy", "-password")
      .populate("members", "-password");

    if (!project) return res.status(404).json({ message: "Project not found" });
    res
      .status(200)
      .json({ project, message: "Project details fetched successfully" });
  } catch (error) {
    console.error("getProjectDetails error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      .populate("createdBy", "-password")
      .populate("members", "-password");

    if (!project) return res.status(404).json({ message: "Project not found" });

    const activityLog = await Activity.create({
      user: req.user._id,
      type: "UPDATE_PROJECT",
      message: `You updated the project "${project.title}"`,
      relatedProject: project._id,
    });
    if (!activityLog)
      return res.status(400).json({ message: "Activity log not created" });

    res.status(200).json({ project, message: "Project updated successfully" });
  } catch (error) {
    console.error("updateProject error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id)
      .populate("createdBy", "-password")
      .populate("members", "-password");

    if (!project) return res.status(404).json({ message: "Project not found" });

    const projectTitle = project.title;
    await project.deleteOne();
    await Task.deleteMany({ project: project._id });

    const activityLog = await Activity.create({
      user: req.user._id,
      type: "DELETE_PROJECT",
      message: `You deleted the project "${projectTitle}"`,
      relatedProject: project._id,
    });
    if (!activityLog)
      return res.status(400).json({ message: "Activity log not created" });

    res.status(200).json({ project, message: "Project deleted successfully" });
  } catch (error) {
    console.error("deleteProject error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const inviteMember = async (req, res) => {
  const { id: projectId } = req.params;
  const { members } = req.body; // _id of users, [_id, _id, _id]
  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const notifications = [];
    for (const memberId of members) {
      const user = await User.findById(memberId);
      if (!user) continue; // skip if user not found

      if (project.members.some((id) => id.equals(user._id))) continue; // Skip if user already a member

      // Create notification
      const notification = await Notification.create({
        user: user._id,
        type: "PROJECT_INVITE",
        message: `${req.user.name} has invited you to join '${project.title}' project.`,
        relatedProject: project._id,
      });
      notifications.push(notification);
    }
    project.members = members; // Replace existing members with new members
    await project.save();

    const activityLog = await Activity.create({
      user: req.user._id,
      type: "ADD_MEMBER",
      message: `You invited new member(s) to the project "${project.title}"`,
      relatedProject: project._id,
    });
    if (!activityLog)
      return res.status(400).json({ message: "Activity log not created" });

    res.status(200).json({
      notifications,
      inviter: req.user.name,
      projectName: project.title,
      message:
        notifications.length > 0
          ? "Members invited successfully"
          : "No new members were invited",
    });
  } catch (error) {
    console.error("inviteMember error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getProjectMembers = async (req, res) => {
  try {
    getProjectDetails(req, res);
  } catch (error) {
    console.error("getProjectMembers error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getTasksOfProject = async (req, res) => {
  const { projectId } = req.params;
  const { status, assignees } = req.query;
  try {
    const tasksOfProject = { project: projectId };
    if (status) tasksOfProject.status = status;
    if (assignees) tasksOfProject.assignees = assignees;

    const tasks = await Task.find(tasksOfProject)
      .populate("assignees", "-password")
      .populate("project")
      .populate("attachments")
      .sort({ createdAt: -1 });

    if (!tasks || tasks.length === 0)
      return res.status(404).json({ message: "No tasks found" });
    res.status(200).json({ tasks, message: `Found ${tasks.length} tasks` });
  } catch (error) {
    console.error("getTasksOfProject error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getFilesOfProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const files = await File.find({ project: projectId })
      .populate("uploadedBy", "-password")
      .populate("project")
      .populate("task")
      .sort({ createdAt: -1 });
    if (!files || files.length === 0)
      return res.status(404).json({ message: "No files found" });
    res.status(200).json({ files, message: `Found ${files.length} files` });
  } catch (error) {
    console.error("getFilesOfProject error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
