export const isAdmin = (req, res, next) => {
  try {
    // req.user is set by authMiddleware
    if (!req.user || req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Forbidden: Admin access required" });
    }

    next();
  } catch (error) {
    console.error("isAdmin middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
