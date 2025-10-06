export const isMember = (req, res, next) => {
  try {
    // req.user is set by authMiddleware
    if (!req.user || req.user.role !== "MEMBER")
      return res
        .status(403)
        .json({ message: "Forbidden: Member access required" });

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
