const PDFDocument = require("pdfkit");
const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");
const { verifyPayment } = require("../services/interswitch");
const { getIo } = require("../socket");

const processDonation = async (req, res) => {
  const { campaignId, amount, paymentMethod, transactionReference } = req.body;
  const donorName = req.body.donorName || req.user.name;
  const numericAmount = Number(amount);
  if (!campaignId || !numericAmount || !donorName) {
    return res.fail("campaignId, amount, and donorName are required", 400);
  }
  if (numericAmount <= 0) {
    return res.fail("amount must be greater than 0", 400);
  }
  if (!transactionReference && process.env.INTERSWITCH_STUB !== "true") {
    return res.fail("transactionReference is required for Interswitch verification", 400);
  }

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    return res.fail("Campaign not found", 404);
  }

  const pendingDonation = await Donation.create({
    campaignId,
    donorId: req.user._id,
    donorName,
    amount: numericAmount,
    paymentMethod: paymentMethod || "interswitch",
    status: "pending",
    transactionRef: transactionReference || "pending"
  });

  const amountKobo = Math.round(numericAmount * 100);
  const verification = await verifyPayment({
    transactionReference: transactionReference || pendingDonation._id.toString(),
    amountKobo
  });
  if (!verification.verified) {
    pendingDonation.status = "failed";
    await pendingDonation.save();
    return res.fail("Payment verification failed", 402);
  }

  pendingDonation.status = "verified";
  pendingDonation.transactionRef = verification.transactionRef;
  pendingDonation.verifiedAt = verification.paidAt;
  await pendingDonation.save();

  campaign.raisedAmount += numericAmount;
  campaign.donorCount += 1;
  await campaign.save();

  let io;
  try {
    io = getIo();
  } catch (_err) {
    io = null;
  }

  if (io) {
    io.to(`campaign:${campaign._id}`).emit("campaignProgress", {
      campaignId: campaign._id,
      raisedAmount: campaign.raisedAmount,
      targetAmount: campaign.targetAmount,
      donorCount: campaign.donorCount,
      percentComplete: Math.min(
        100,
        Math.round((campaign.raisedAmount / campaign.targetAmount) * 100)
      )
    });

    io.to(`campaign:${campaign._id}`).emit("donationReceived", {
      donorName: pendingDonation.donorName,
      amount: pendingDonation.amount,
      date: pendingDonation.createdAt
    });
  }

  return res.ok({
    message: "Donation processed successfully",
    donation: {
      _id: pendingDonation._id,
      campaignId: pendingDonation.campaignId,
      amount: pendingDonation.amount,
      donorName: pendingDonation.donorName,
      date: pendingDonation.createdAt,
      responseCode: verification.responseCode
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
    return res.fail("Donation not found", 404);
  }

  const campaign = await Campaign.findById(donation.campaignId).lean();
  if (!campaign) {
    return res.fail("Campaign not found", 404);
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
