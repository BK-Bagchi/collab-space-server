import Task from "../models/task.model.js";
import Project from "../models/project.model.js";

const assigneeActivityStats = (tasks) => {
  return Object.values(
    tasks.reduce((acc, task) => {
      if (task.assignees && task.assignees.length > 0) {
        task.assignees.forEach((assignee) => {
          const id = assignee._id.toString();

          if (!acc[id])
            //prettier-ignore
            acc[id] = { user: assignee, totalTasks: 0, todo: 0, inProgress: 0, completed: 0, overdue: 0};

          acc[id].totalTasks += 1;
          if (task.status === "TODO") acc[id].todo += 1;
          if (task.status === "IN_PROGRESS") acc[id].inProgress += 1;
          if (task.status === "COMPLETED") acc[id].completed += 1;
          if (
            task.dueDate &&
            new Date(task.dueDate) < new Date() &&
            task.status !== "COMPLETED"
          )
            acc[id].overdue += 1;
        });
      }
      return acc;
    }, {})
  );
};

export const getProjectStats = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId)
      .populate("members", "-password")
      .populate("createdBy", "-password");
    if (!project || project.length === 0)
      return res.status(404).json({ message: "Project not found" });

    const tasks = await Task.find({ project: projectId })
      .populate("assignees", "-password")
      .populate("attachments")
      .populate("project")
      .sort({ createdAt: -1 });

    if (!tasks || tasks.length === 0)
      return res
        .status(404)
        .json({ message: "No tasks found for this project" });

    const totalTasks = tasks.length;
    const todo = tasks.filter((task) => task.status === "TODO").length;
    const inProgress = tasks.filter(
      (task) => task.status === "IN_PROGRESS"
    ).length;
    const completed = tasks.filter((task) => task.status === "DONE").length;
    const overdue = tasks.filter(
      (task) =>
        task.dueDate &&
        new Date(task.dueDate) < new Date() &&
        task.status !== "DONE"
    ).length;

    const assigneeActivity = assigneeActivityStats(tasks);

    res.status(200).json({
      project: {
        _id: project._id,
        title: project.title,
        members: project.members,
      },
      stats: {
        totalTasks,
        todo,
        inProgress,
        completed,
        overdue,
        assigneeActivity,
      },
      message: "Project statistics fetched successfully",
    });
  } catch (error) {
    console.error("getProjectStats error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getTeamProductivity = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("project")
      .populate("assignees", "-password")
      .populate("attachments")
      .sort({ createdAt: -1 });

    if (!tasks || tasks.length === 0)
      return res
        .status(404)
        .json({ message: "No tasks found for this project" });

    // Aggregate per-assignee stats
    const teamStats = assigneeActivityStats(tasks);

    res.status(200).json({
      teamStats,
      message: "Team productivity overview fetched successfully",
    });
  } catch (error) {
    console.error("getTeamProductivity error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
