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
    
    if (process.env.SKIP_DB === "true") {
      req.user = {
        _id: payload.id || "mock-user-id",
        name: "Demo User",
        role: "beneficiary"
      };
      return next();
    }

    const user = await User.findById(payload.id).select("-password");
    if (!user) {
      return res.fail("Unauthorized", 401);
    }
    req.user = user;
    next();
  } catch (err) {
    if (process.env.SKIP_DB === "true") {
       req.user = { _id: "mock-user-id", name: "Guest User", role: "donor" };
       return next();
    }
    return res.fail("Unauthorized", 401);
  }
};

module.exports = auth;
