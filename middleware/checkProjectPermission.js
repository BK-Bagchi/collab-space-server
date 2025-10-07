import Project from "../models/project.model.js";

export const checkProjectPermission = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const userId = req.user._id;
    const userRole = req.user.role;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Allow if admin
    if (userRole === "ADMIN" || userRole === "MANAGER") return next();

    // Allow if creator
    if (project.createdBy.toString() === userId.toString()) return next();

    // Allow members to edit certain fields (optional)
    const allowedForMembers = ["color", "description"];
    const updatingFields = Object.keys(req.body);
    const isMember = project.members.some(
      (m) => m.toString() === userId.toString()
    );

    if (isMember && updatingFields.every((f) => allowedForMembers.includes(f)))
      return next();

    // Otherwise deny
    return res
      .status(403)
      .json({ message: "Unauthorized: You cannot update this project" });
  } catch (error) {
    console.error("checkProjectPermission error:", error);
    res.status(500).json({ message: error.message });
  }
};
