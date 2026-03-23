const role = (requiredRole) => (req, res, next) => {
  if (!req.user || req.user.role !== requiredRole) {
    return res.fail("Forbidden", 403);
  }
  next();
};

module.exports = role;
