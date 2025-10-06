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
