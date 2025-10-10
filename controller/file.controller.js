import File from "../models/file.model.js";

export const uploadFile = async (req, res) => {
  const { name, url } = req.body;
  try {
    if (!name || !url)
      return res.status(400).json({ message: "File name and url is required" });

    const file = await File.create(req.body);
    if (!file) return res.status(404).json({ message: "File not created" });
    res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("uploadFile error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getFileById = async (req, res) => {
  const { id } = req.params;
  try {
    const file = await File.findById(id)
      .populate("uploadedBy", "-password")
      .populate("project")
      .populate("task");
    if (!file) return res.status(404).json({ message: "File not found" });
    res.status(200).json(file);
  } catch (error) {
    console.error("getFileById error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
