const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const User = require("../src/models/User");
const Campaign = require("../src/models/Campaign");
const Donation = require("../src/models/Donation");

const run = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set");
  }

  await mongoose.connect(uri);

  await Donation.deleteMany({});
  await Campaign.deleteMany({});
  await User.deleteMany({});

  const beneficiary = await User.create({
    name: "Lagos University Teaching Hospital",
    email: "hospital@example.com",
    password: "password123",
    phone: "+2348012345678",
    role: "beneficiary"
  });

  const donor = await User.create({
    name: "Ayo",
    email: "ayo@example.com",
    password: "pass123",
    role: "donor"
  });

  const campaign = await Campaign.create({
    title: "Kidney Surgery Fund",
    description: "Help save Emeka’s life with a kidney transplant",
    targetAmount: 500000,
    raisedAmount: 200000,
    donorCount: 2,
    status: "active",
    deadline: new Date("2026-04-30"),
    imageUrl: "https://example.com/emeka.jpg",
    createdBy: beneficiary._id
  });

  await Donation.create({
    campaignId: campaign._id,
    donorId: donor._id,
    donorName: donor.name,
    amount: 5000,
    paymentMethod: "interswitch",
    status: "verified",
    transactionRef: "IB-DEMO-1",
    verifiedAt: new Date()
  });

  await Donation.create({
    campaignId: campaign._id,
    donorName: "Chioma",
    amount: 10000,
    paymentMethod: "interswitch",
    status: "verified",
    transactionRef: "IB-DEMO-2",
    verifiedAt: new Date()
  });

  console.log("Seed complete");
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
