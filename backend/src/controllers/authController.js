const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Campaign = require("../models/Campaign");

const signToken = (user) => {
  const payload = { id: user._id, role: user.role };
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign(payload, secret, { expiresIn });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.fail("Email and password are required", 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.fail("Invalid credentials", 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.fail("Invalid credentials", 401);
  }

  const token = signToken(user);
  
  let userCampaign = null;
  if (user.role === "beneficiary") {
    userCampaign = await Campaign.findOne({ createdBy: user._id }).sort({ createdAt: -1 });
  }

  return res.ok({
    user: { 
      _id: user._id, 
      name: user.name, 
      role: user.role, 
      email: user.email,
      campaign: userCampaign ? { _id: userCampaign._id, title: userCampaign.title } : null
    },
    token
  });
};

module.exports = { login, signToken };
