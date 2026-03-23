const express = require("express");
const auth = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");
const { requireValidId } = require("../middleware/validate");
const { processDonation, initiateDonation, getReceipt } = require("../controllers/donationController");

const router = express.Router();

router.post("/process", auth, asyncHandler(processDonation));
router.post("/initiate", auth, asyncHandler(initiateDonation));
router.get("/receipt/:donationId", requireValidId("donationId"), asyncHandler(getReceipt));

module.exports = router;
