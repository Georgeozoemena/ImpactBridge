const User = require("../models/User");
const Campaign = require("../models/Campaign");

const listUsers = async (_req, res) => {
  const users = await User.find().select("-password").lean();
  return res.ok({ users });
};

const listAllCampaigns = async (_req, res) => {
  const campaigns = await Campaign.find().sort({ createdAt: -1 }).lean();
  return res.ok({ campaigns });
};

module.exports = { listUsers, listAllCampaigns };
