const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");
const { verifyPayment } = require("../services/interswitch");
const { getIo } = require("../socket");

const router = express.Router();

const getTxnRef = (payload = {}) =>
  payload.txn_ref ||
  payload.txnref ||
  payload.transaction_ref ||
  payload.reference ||
  payload.ref ||
  payload.txRef ||
  payload.txnRef;

router.post(
  "/interswitch",
  asyncHandler(async (req, res) => {
    const payload = { ...req.body };
    const transactionReference = getTxnRef(payload);
    const amountRaw = Number(payload.amount || payload.apprAmt || 0);

    if (!transactionReference || !amountRaw) {
      return res.status(200).json({ success: false, message: "Missing transactionReference or amount" });
    }

    const donation = await Donation.findOne({ transactionRef: transactionReference });
    if (!donation) {
      return res.status(200).json({ success: false, message: "Donation not found" });
    }

    if (donation.status === "verified") {
      return res.status(200).json({ success: true, message: "Already verified" });
    }

    const amountKobo = amountRaw < 10000 ? Math.round(amountRaw * 100) : amountRaw;
    const verification = await verifyPayment({ transactionReference, amountKobo });
    if (!verification.verified) {
      donation.status = "failed";
      await donation.save();
      return res.status(200).json({ success: false, message: "Verification failed" });
    }

    donation.status = "verified";
    donation.transactionRef = verification.transactionRef;
    donation.verifiedAt = verification.paidAt;
    await donation.save();

    const campaign = await Campaign.findById(donation.campaignId);
    if (campaign) {
      campaign.raisedAmount += donation.amount;
      campaign.donorCount += 1;
      await campaign.save();
    }

    let io;
    try {
      io = getIo();
    } catch (_err) {
      io = null;
    }

    if (io && campaign) {
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
        donorName: donation.donorName,
        amount: donation.amount,
        date: donation.createdAt
      });
    }

    return res.status(200).json({ success: true, message: "Verified" });
  })
);

module.exports = router;
