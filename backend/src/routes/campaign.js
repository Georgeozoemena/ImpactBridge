const express = require("express");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const asyncHandler = require("../middleware/asyncHandler");
const { requireValidId } = require("../middleware/validate");
const {
  createCampaign,
  getCampaign,
  listCampaigns,
  getProgress,
  recentDonations,
  updateStatus,
  getMyCampaign
} = require("../controllers/campaignController");

const router = express.Router();

router.post("/create", auth, role("beneficiary"), asyncHandler(createCampaign));
router.get("/me", auth, role("beneficiary"), asyncHandler(getMyCampaign));
router.get("/", asyncHandler(listCampaigns));
router.get("/:id/progress", requireValidId("id"), asyncHandler(getProgress));
router.get("/:id/recent-donations", requireValidId("id"), asyncHandler(recentDonations));
router.get("/:id", requireValidId("id"), asyncHandler(getCampaign));
router.patch("/:id/status", auth, role("beneficiary"), requireValidId("id"), asyncHandler(updateStatus));

module.exports = router;
