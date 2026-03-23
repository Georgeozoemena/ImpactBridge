const User = require("../models/User");
const Campaign = require("../models/Campaign");

const createAdmin = async (req, res) => {
  const secret = req.headers["x-admin-secret"] || req.body.adminSecret;
  if (!process.env.ADMIN_SETUP_SECRET || secret !== process.env.ADMIN_SETUP_SECRET) {
    return res.fail("Forbidden", 403);
  }

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.fail("name, email, and password are required", 400);
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.fail("Email already in use", 409);
  }

  const admin = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: "admin"
  });

  return res.ok({ admin: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role } }, 201);
};

const listUsers = async (_req, res) => {
  const users = await User.find().select("-password").lean();
  return res.ok({ users });
};

const listAllCampaigns = async (_req, res) => {
  const campaigns = await Campaign.find().sort({ createdAt: -1 }).lean();
  return res.ok({ campaigns });
};

module.exports = { createAdmin, listUsers, listAllCampaigns };
