const mongoose = require("mongoose");

const requireValidId = (paramName = "id") => (req, res, next) => {
  const value = req.params[paramName];
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }
  return next();
};

module.exports = { requireValidId };
