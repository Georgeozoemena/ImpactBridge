const express = require("express");
const { registerBeneficiary } = require("../controllers/userController");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.post("/register", asyncHandler(registerBeneficiary));

module.exports = router;
