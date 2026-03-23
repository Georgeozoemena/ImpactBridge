const express = require("express");
const auth = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");
const { requireValidId } = require("../middleware/validate");
const { processDonation, getReceipt } = require("../controllers/donationController");

const router = express.Router();

router.post("/process", auth, asyncHandler(processDonation));
router.get("/receipt/:donationId", requireValidId("donationId"), asyncHandler(getReceipt));

module.exports = router;
