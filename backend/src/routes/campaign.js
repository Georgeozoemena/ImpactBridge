const express = require("express");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const asyncHandler = require("../middleware/asyncHandler");
const {
  createCampaign,
  getCampaign,
  listCampaigns,
  getProgress,
  recentDonations,
  updateStatus
} = require("../controllers/campaignController");

const router = express.Router();

router.post("/create", auth, role("beneficiary"), asyncHandler(createCampaign));
router.get("/", asyncHandler(listCampaigns));
router.get("/:id/progress", asyncHandler(getProgress));
router.get("/:id/recent-donations", asyncHandler(recentDonations));
router.get("/:id", asyncHandler(getCampaign));
router.patch("/:id/status", auth, role("beneficiary"), asyncHandler(updateStatus));

module.exports = router;
