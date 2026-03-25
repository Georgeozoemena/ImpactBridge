const Campaign = require("../models/Campaign");
const Donation = require("../models/Donation");

const createCampaign = async (req, res) => {
  const { title, description, targetAmount } = req.body;
  const numericTarget = Number(targetAmount);
  if (!title || !description || !numericTarget) {
    return res.fail("Title, description, and targetAmount are required", 400);
  }
  if (numericTarget <= 0) {
    return res.fail("targetAmount must be greater than 0", 400);
  }
  const { deadline } = req.body;
  if (deadline && Number.isNaN(Date.parse(deadline))) {
    return res.fail("Invalid deadline date", 400);
  }

  const campaign = await Campaign.create({
    title,
    description,
    targetAmount: numericTarget,
    deadline,
    createdBy: req.user._id
  });

  return res.ok({ campaign }, 201);
};

const getCampaign = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id).lean();
  if (!campaign) {
    return res.fail("Campaign not found", 404);
  }

  const recentDonations = await Donation.find({ campaignId: campaign._id, status: "verified" })
    .sort({ createdAt: -1 })
    .limit(10)
    .select("donorName amount createdAt")
    .lean();

  return res.ok({
    campaign: {
      ...campaign,
      recentDonations: recentDonations.map((d) => ({
        donorName: d.donorName,
        amount: d.amount,
        date: d.createdAt
      }))
    }
  });
};

const listCampaigns = async (req, res) => {
  const { status, sort } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const sortBy = sort === "recent" ? { createdAt: -1 } : { createdAt: -1 };
  const campaigns = await Campaign.find(filter)
    .sort(sortBy)
    .select("title raisedAmount targetAmount donorCount status")
    .lean();

  return res.ok({ campaigns });
};

const getProgress = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id).lean();
  if (!campaign) {
    return res.fail("Campaign not found", 404);
  }

  const percentComplete = Math.min(
    100,
    Math.round((campaign.raisedAmount / campaign.targetAmount) * 100)
  );

  return res.ok({
    campaignId: campaign._id,
    raisedAmount: campaign.raisedAmount,
    targetAmount: campaign.targetAmount,
    donorCount: campaign.donorCount,
    percentComplete
  });
};

const recentDonations = async (req, res) => {
  const donations = await Donation.find({ campaignId: req.params.id, status: "verified" })
    .sort({ createdAt: -1 })
    .limit(20)
    .select("donorName amount createdAt")
    .lean();

  return res.ok({
    donations: donations.map((d) => ({
      donorName: d.donorName,
      amount: d.amount,
      date: d.createdAt
    }))
  });
};

const updateStatus = async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.fail("Status is required", 400);
  }
  const allowed = ["active", "inactive", "completed"];
  if (!allowed.includes(status)) {
    return res.fail("Invalid status value", 400);
  }

  const campaign = await Campaign.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!campaign) {
    return res.fail("Campaign not found", 404);
  }

  return res.ok({ campaign });
};

const getMyCampaign = async (req, res) => {
  const campaign = await Campaign.findOne({ createdBy: req.user._id }).sort({ createdAt: -1 });
  if (!campaign) {
    return res.ok({ campaign: null });
  }
  return res.ok({ campaign });
};

module.exports = {
  createCampaign,
  getCampaign,
  listCampaigns,
  getProgress,
  recentDonations,
  updateStatus,
  getMyCampaign
};
