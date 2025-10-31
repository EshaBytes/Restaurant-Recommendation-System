exports.adminOnly = (req, res, next) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only",
      });
    }

    next();
  } catch (error) {
    console.error("💥 Admin middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error in admin authorization",
    });
  }
};
