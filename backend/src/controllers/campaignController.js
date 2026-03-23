const Campaign = require("../models/Campaign");
const Donation = require("../models/Donation");

const createCampaign = async (req, res) => {
  const { title, description, targetAmount, deadline, imageUrl } = req.body;
  if (!title || !description || !targetAmount) {
    return res.status(400).json({ success: false, message: "Title, description, and targetAmount are required" });
  }

  const campaign = await Campaign.create({
    title,
    description,
    targetAmount,
    deadline,
    imageUrl,
    createdBy: req.user._id
  });

  return res.status(201).json({ success: true, campaign });
};

const getCampaign = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id).lean();
  if (!campaign) {
    return res.status(404).json({ success: false, message: "Campaign not found" });
  }

  const recentDonations = await Donation.find({ campaignId: campaign._id, status: "verified" })
    .sort({ createdAt: -1 })
    .limit(10)
    .select("donorName amount createdAt")
    .lean();

  return res.json({
    success: true,
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

  return res.json({ success: true, campaigns });
};

const getProgress = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id).lean();
  if (!campaign) {
    return res.status(404).json({ success: false, message: "Campaign not found" });
  }

  const percentComplete = Math.min(
    100,
    Math.round((campaign.raisedAmount / campaign.targetAmount) * 100)
  );

  return res.json({
    success: true,
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

  return res.json({
    success: true,
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
    return res.status(400).json({ success: false, message: "Status is required" });
  }

  const campaign = await Campaign.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!campaign) {
    return res.status(404).json({ success: false, message: "Campaign not found" });
  }

  return res.json({ success: true, campaign });
};

module.exports = {
  createCampaign,
  getCampaign,
  listCampaigns,
  getProgress,
  recentDonations,
  updateStatus
};
