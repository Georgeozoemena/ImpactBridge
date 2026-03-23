const role = (requiredRole) => (req, res, next) => {
  if (!req.user || req.user.role !== requiredRole) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  next();
};

module.exports = role;
