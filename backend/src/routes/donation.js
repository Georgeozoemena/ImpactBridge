const express = require("express");
const auth = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");
const { processDonation, getReceipt } = require("../controllers/donationController");

const router = express.Router();

router.post("/process", auth, asyncHandler(processDonation));
router.get("/receipt/:donationId", asyncHandler(getReceipt));

module.exports = router;
