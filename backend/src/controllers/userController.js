const User = require("../models/User");
const { signToken } = require("./authController");

const register = async (req, res, role) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.fail("Name, email, and password are required", 400);
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.fail("Email already in use", 409);
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    phone,
    role
  });

  const token = signToken(user);
  return res.ok(
    {
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token
    },
    201
  );
};

const registerBeneficiary = (req, res) => register(req, res, "beneficiary");
const registerDonor = (req, res) => register(req, res, "donor");

module.exports = { registerBeneficiary, registerDonor };
