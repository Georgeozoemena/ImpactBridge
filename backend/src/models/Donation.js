const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    donorName: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 1 },
    paymentMethod: { type: String, default: "interswitch" },
    status: { type: String, enum: ["pending", "verified", "failed"], default: "pending" },
    transactionRef: { type: String, required: true },
    verifiedAt: { type: Date }
  },
  { timestamps: true }
);

donationSchema.index({ campaignId: 1, createdAt: -1 });

module.exports = mongoose.model("Donation", donationSchema);
