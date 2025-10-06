import Project from "../models/project.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);

    if (!project)
      return res.status(400).json({ message: "Project not created" });
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
    const projects = await Project.find({
      $or: [{ createdBy: _id }, { members: _id }],
    })
      .populate("createdBy", "name email avatar role")
      .populate("members", "name email avatar role")
      .sort({ createdAt: -1 });

    if (!projects || projects.length === 0)
      return res.status(404).json({ message: "No projects found" });
    res
      .status(200)
      .json({ projects, message: "Projects fetched successfully" });
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
      .populate("createdBy", "name email avatar role")
      .populate("members", "name email avatar role");

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
      .populate("createdBy", "name email avatar role")
      .populate("members", "name email avatar role");

    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ project, message: "Project updated successfully" });
  } catch (error) {
    console.error("updateProject error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findByIdAndDelete(id)
      .populate("createdBy", "name email avatar role")
      .populate("members", "name email avatar role");

    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ project, message: "Project deleted successfully" });
  } catch (error) {
    console.error("deleteProject error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const inviteMember = async (req, res) => {
  const { id: projectId } = req.params;
  const { id: userId } = req.body;
  try {
    const project = await Project.findById(projectId);
    const user = await User.findById(userId);

    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!user) return res.status(404).json({ message: "User not found" });
    // Checking if user is already a member
    if (project.members.some((memberId) => memberId.equals(userId)))
      return res
        .status(400)
        .json({ message: "User is already a project member" });

    // Creating notification
    const notification = await Notification.create({
      user: userId,
      type: "PROJECT_INVITE",
      message: `${req.user.email} has invited you to join ${project.name} project.`,
      //   message: `${req.user.name} has invited you to join ${project.name} project.`,
      relatedProject: project._id,
    });
    if (!notification)
      return res.status(400).json({ message: "Notification not created" });

    res
      .status(200)
      .json({ notification, message: "Member invited successfully" });
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
