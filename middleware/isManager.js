export const isManager = (req, res, next) => {
  try {
    // req.user is set by authMiddleware
    // Check if user is admin or manager
    if (!req.user || !["ADMIN", "MANAGER"].includes(req.user.role))
      return res
        .status(403)
        .json({ message: "Forbidden: Manager access required" });

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
