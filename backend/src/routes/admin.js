const express = require("express");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const asyncHandler = require("../middleware/asyncHandler");
const { listUsers, listAllCampaigns } = require("../controllers/adminController");

const router = express.Router();

router.get("/users", auth, role("admin"), asyncHandler(listUsers));
router.get("/campaigns/all", auth, role("admin"), asyncHandler(listAllCampaigns));

module.exports = router;
