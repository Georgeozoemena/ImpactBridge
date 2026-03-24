const User = require("../models/User");
const Campaign = require("../models/Campaign");
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

  // If beneficiary, create their initial campaign
  if (role === "beneficiary") {
    const { campaignTitle, campaignDescription, campaignTarget } = req.body;
    if (campaignTitle && campaignDescription && campaignTarget) {
      await Campaign.create({
        title: campaignTitle,
        description: campaignDescription,
        targetAmount: Number(campaignTarget),
        createdBy: user._id,
        imageUrl: `https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=800`
      });
    }
  }

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
