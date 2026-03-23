const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");
const beneficiaryRoutes = require("./routes/beneficiary");
const donorRoutes = require("./routes/donor");
const campaignRoutes = require("./routes/campaign");
const donationRoutes = require("./routes/donation");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", name: "ImpactBridge API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/beneficiary", beneficiaryRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/campaign", campaignRoutes);
app.use("/api/donation", donationRoutes);
app.use("/api", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Server error" });
});

module.exports = app;
