import Project from "../models/project.model.js";

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
