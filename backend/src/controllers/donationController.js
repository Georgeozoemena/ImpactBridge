const PDFDocument = require("pdfkit");
const { v4: uuidv4 } = require("uuid");
const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");
const { verifyPayment, buildPaymentRequest } = require("../services/interswitch");
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

const initiateDonation = async (req, res) => {
  const { campaignId, amount, redirectUrl } = req.body;
  const donorName = req.body.donorName || req.user.name;
  const donorEmail = req.body.donorEmail || req.user.email;
  const numericAmount = Number(amount);
  if (!campaignId || !numericAmount || !donorName || !donorEmail) {
    return res.fail("campaignId, amount, donorName, and donorEmail are required", 400);
  }
  if (numericAmount <= 0) {
    return res.fail("amount must be greater than 0", 400);
  }

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    return res.fail("Campaign not found", 404);
  }

  const transactionReference = `IB-${uuidv4()}`;
  const amountKobo = Math.round(numericAmount * 100);

  const pendingDonation = await Donation.create({
    campaignId,
    donorId: req.user._id,
    donorName,
    amount: numericAmount,
    paymentMethod: "interswitch",
    status: "pending",
    transactionRef: transactionReference
  });

  const payment = buildPaymentRequest({
    amountKobo,
    transactionReference,
    customerId: req.user._id.toString(),
    customerEmail: donorEmail,
    customerName: donorName,
    redirectUrl,
    payItemName: campaign.title
  });

  return res.ok({
    paymentUrl: payment.paymentUrl,
    fields: payment.fields,
    donationId: pendingDonation._id,
    transactionReference
  });
};

const initiateDonationTest = async (req, res) => {
  if (process.env.NO_DB_TEST !== "true") {
    return res.fail("Not available", 404);
  }

  const { amount, redirectUrl, donorEmail, donorName, transactionReference } = req.body;
  const numericAmount = Number(amount);
  if (!numericAmount || !donorEmail) {
    return res.fail("amount and donorEmail are required", 400);
  }

  const txRef = transactionReference || `IB-TEST-${uuidv4()}`;
  const amountKobo = Math.round(numericAmount * 100);

  const payment = buildPaymentRequest({
    amountKobo,
    transactionReference: txRef,
    customerId: "test-user",
    customerEmail: donorEmail,
    customerName: donorName || "Test Donor",
    redirectUrl,
    payItemName: "ImpactBridge Test"
  });

  return res.ok({
    paymentUrl: payment.paymentUrl,
    fields: payment.fields,
    transactionReference: txRef
  });
};

const verifyDonationTest = async (req, res) => {
  if (process.env.NO_DB_TEST !== "true") {
    return res.fail("Not available", 404);
  }

  const { transactionReference, amount } = req.body;
  const numericAmount = Number(amount);
  if (!transactionReference || !numericAmount) {
    return res.fail("transactionReference and amount are required", 400);
  }

  const amountKobo = Math.round(numericAmount * 100);
  const verification = await verifyPayment({ transactionReference, amountKobo });

  return res.ok({ verification });
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
  doc.text(`Amount: NGN ${donation.amount.toLocaleString("en-NG")}`);
  doc.text(`Date: ${new Date(donation.createdAt).toISOString()}`);
  doc.text(`Transaction ID: ${donation.transactionRef}`);
  doc.moveDown();
  doc.text("Thank you for turning payments into impact.");

  doc.end();
};

const getDonorHistory = async (req, res) => {
  const donations = await Donation.find({ donorId: req.user._id, status: "verified" })
    .sort({ createdAt: -1 })
    .populate("campaignId", "title targetAmount raisedAmount status")
    .lean();

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
  const livesTouched = new Set(donations.map((d) => d.campaignId._id.toString())).size;
  const campaignsSupported = livesTouched;

  return res.ok({
    totalDonated,
    livesTouched,
    campaignsSupported,
    history: donations.map((d) => ({
      _id: d._id,
      campaign: d.campaignId ? d.campaignId.title : "Unknown Campaign",
      campaignId: d.campaignId ? d.campaignId._id : null,
      amount: d.amount,
      date: d.createdAt,
      status: d.status,
      campaignProgress: d.campaignId ? Math.min(100, Math.round((d.campaignId.raisedAmount / d.campaignId.targetAmount) * 100)) : 0
    }))
  });
};

module.exports = { processDonation, initiateDonation, initiateDonationTest, verifyDonationTest, getReceipt, getDonorHistory };
