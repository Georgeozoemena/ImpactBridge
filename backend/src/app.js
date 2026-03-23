const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const beneficiaryRoutes = require("./routes/beneficiary");
const donorRoutes = require("./routes/donor");
const campaignRoutes = require("./routes/campaign");
const donationRoutes = require("./routes/donation");
const adminRoutes = require("./routes/admin");
const response = require("./middleware/response");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(response);

const windowMs = (Number(process.env.RATE_LIMIT_WINDOW_MIN) || 15) * 60 * 1000;
const max = Number(process.env.RATE_LIMIT_MAX) || 100;
app.use(
  "/api",
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/health", (_req, res) => {
  res.ok({ status: "ok", name: "ImpactBridge API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/beneficiary", beneficiaryRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/campaign", campaignRoutes);
app.use("/api/donation", donationRoutes);
app.use("/api", adminRoutes);

app.use((req, res) => {
  res.fail("Route not found", 404);
});

app.use((err, _req, res, _next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }

  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: "Duplicate key error" });
  }

  return res.status(500).json({ success: false, message: "Server error" });
});

module.exports = app;
