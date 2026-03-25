const express = require("express");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.post("/image", auth, upload.single("image"), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.fail("No image uploaded", 400);
  }
  
  // Return the URL for the uploaded image
  // For local development, this will be /uploads/filename
  const imageUrl = `/uploads/${req.file.filename}`;
  return res.ok({ imageUrl });
}));

module.exports = router;
