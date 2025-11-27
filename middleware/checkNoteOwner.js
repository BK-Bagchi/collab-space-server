import Note from "../models/note.model.js";

export const checkNoteOwner = async (req, res, next) => {
  const { id } = req.params;
  try {
    const checkNoteOwner = await Note.exists({ _id: id, user: req.user._id });
    if (!checkNoteOwner)
      return res
        .status(403)
        .json({ message: "Unauthorized: You are not the owner of this note" });

    next();
  } catch (error) {
    console.error("checkNoteOwner error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
