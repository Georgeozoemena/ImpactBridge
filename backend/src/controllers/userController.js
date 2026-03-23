const User = require("../models/User");
const { signToken } = require("./authController");

const register = async (req, res, role) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email, and password are required" });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ success: false, message: "Email already in use" });
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    phone,
    role
  });

  const token = signToken(user);
  return res.status(201).json({
    success: true,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    token
  });
};

const registerBeneficiary = (req, res) => register(req, res, "beneficiary");
const registerDonor = (req, res) => register(req, res, "donor");

module.exports = { registerBeneficiary, registerDonor };
