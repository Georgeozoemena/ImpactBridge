const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    targetAmount: { type: Number, required: true, min: 1 },
    raisedAmount: { type: Number, default: 0 },
    donorCount: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive", "completed"], default: "active" },
    deadline: { type: Date },
    imageUrl: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);
