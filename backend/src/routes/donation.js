const express = require("express");
const auth = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");
const { requireValidId } = require("../middleware/validate");
const {
  processDonation,
  initiateDonation,
  initiateDonationTest,
  verifyDonationTest,
  getReceipt
} = require("../controllers/donationController");

const router = express.Router();

router.post("/process", auth, asyncHandler(processDonation));
router.post("/initiate", auth, asyncHandler(initiateDonation));
router.post("/initiate-test", asyncHandler(initiateDonationTest));
router.post("/verify-test", asyncHandler(verifyDonationTest));
router.get("/receipt/:donationId", requireValidId("donationId"), asyncHandler(getReceipt));
router.get("/history", auth, asyncHandler(getDonorHistory));

module.exports = router;
