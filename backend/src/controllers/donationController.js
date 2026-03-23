const PDFDocument = require("pdfkit");
const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");
const { verifyPayment } = require("../services/interswitch");

const processDonation = async (req, res) => {
  const { campaignId, amount, paymentMethod } = req.body;
  const donorName = req.body.donorName || req.user.name;
  const numericAmount = Number(amount);
  if (!campaignId || !numericAmount || !donorName) {
    return res.status(400).json({ success: false, message: "campaignId, amount, and donorName are required" });
  }

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    return res.status(404).json({ success: false, message: "Campaign not found" });
  }

  const pendingDonation = await Donation.create({
    campaignId,
    donorId: req.user._id,
    donorName,
    amount: numericAmount,
    paymentMethod: paymentMethod || "interswitch",
    status: "pending",
    transactionRef: "pending"
  });

  const verification = await verifyPayment({ campaignId, amount: numericAmount, donorName });
  if (!verification.verified) {
    pendingDonation.status = "failed";
    await pendingDonation.save();
    return res.status(402).json({ success: false, message: "Payment verification failed" });
  }

  pendingDonation.status = "verified";
  pendingDonation.transactionRef = verification.transactionRef;
  pendingDonation.verifiedAt = verification.paidAt;
  await pendingDonation.save();

  campaign.raisedAmount += numericAmount;
  campaign.donorCount += 1;
  await campaign.save();

  return res.json({
    success: true,
    message: "Donation processed successfully",
    donation: {
      _id: pendingDonation._id,
      campaignId: pendingDonation.campaignId,
      amount: pendingDonation.amount,
      donorName: pendingDonation.donorName,
      date: pendingDonation.createdAt
    },
    updatedCampaign: {
      raisedAmount: campaign.raisedAmount,
      donorCount: campaign.donorCount
    }
  });
};

const getReceipt = async (req, res) => {
  const donation = await Donation.findById(req.params.donationId).lean();
  if (!donation) {
    return res.status(404).json({ success: false, message: "Donation not found" });
  }

  const campaign = await Campaign.findById(donation.campaignId).lean();
  if (!campaign) {
    return res.status(404).json({ success: false, message: "Campaign not found" });
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename=receipt-${donation._id}.pdf`);

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  doc.pipe(res);

  doc.fontSize(20).text("ImpactBridge Donation Receipt", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Donor Name: ${donation.donorName}`);
  doc.text(`Campaign: ${campaign.title}`);
  doc.text(`Amount: ₦${donation.amount.toLocaleString("en-NG")}`);
  doc.text(`Date: ${new Date(donation.createdAt).toISOString()}`);
  doc.text(`Transaction ID: ${donation.transactionRef}`);
  doc.moveDown();
  doc.text("Thank you for turning payments into impact.");

  doc.end();
};

module.exports = { processDonation, getReceipt };
