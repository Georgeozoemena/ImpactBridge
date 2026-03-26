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
const webhookRoutes = require("./routes/webhook");
const adminRoutes = require("./routes/admin");
const response = require("./middleware/response");
const mockData = require("./middleware/mockData");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json()); // Modified: removed limit
app.use(express.urlencoded({ extended: true })); // Modified: extended to true
app.use(morgan("dev"));
app.use(response);
app.use(mockData);

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

app.get("/", (_req, res) => {
  res.ok({ status: "ok", name: "ImpactBridge API", message: "Use /health for status checks." });
});

app.all("/payment/callback", (req, res) => {
  const payload = { ...req.query, ...req.body };
  const frontendUrl = process.env.FRONTEND_URL;
  const txnRef =
    payload.txn_ref ||
    payload.txnref ||
    payload.transaction_ref ||
    payload.reference ||
    payload.ref ||
    payload.txRef ||
    payload.txnRef;

  if (frontendUrl) {
    try {
      const base = frontendUrl.replace(/\/+$/, "");
      const redirectUrl = new URL(`${base}/payment/callback`);
      if (txnRef) redirectUrl.searchParams.set("txn_ref", txnRef);
      if (payload.amount) redirectUrl.searchParams.set("amount", payload.amount);
      if (payload.apprAmt) redirectUrl.searchParams.set("apprAmt", payload.apprAmt);
      if (payload.resp) redirectUrl.searchParams.set("resp", payload.resp);
      if (payload.payRef) redirectUrl.searchParams.set("payRef", payload.payRef);
      if (payload.retRef) redirectUrl.searchParams.set("retRef", payload.retRef);
      return res.redirect(302, redirectUrl.toString());
    } catch (err) {
      console.error("Callback redirect failed:", err);
    }
  }

  const data = JSON.stringify(payload, null, 2);
  res.setHeader("Content-Type", "text/html");
  res.send(
    `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>ImpactBridge Payment Callback</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #222; }
          pre { background: #f6f6f6; padding: 16px; border-radius: 8px; }
        </style>
      </head>
      <body>
        <h2>Payment Callback Received</h2>
        <p>Copy the transaction reference below and use it to verify the donation.</p>
        <pre>${data}</pre>
      </body>
    </html>`
  );
});

app.use("/api/auth", authRoutes);
app.use("/api/beneficiary", beneficiaryRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/campaign", campaignRoutes);
app.use("/api/donation", donationRoutes);
app.use("/api/webhook", webhookRoutes);
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
