const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.fail("Unauthorized", 401);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user) {
      return res.fail("Unauthorized", 401);
    }
    req.user = user;
    next();
  } catch (err) {
    return res.fail("Unauthorized", 401);
  }
};

module.exports = auth;
