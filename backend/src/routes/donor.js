const express = require("express");
const { registerDonor } = require("../controllers/userController");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.post("/register", asyncHandler(registerDonor));

module.exports = router;
