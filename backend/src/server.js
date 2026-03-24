const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const { initSocket } = require("./socket");
const connectDb = require("./config/db");

const PORT = process.env.PORT || 4000;

const start = async () => {
  if (process.env.SKIP_DB !== "true") {
    await connectDb();
  } else {
    console.log("SKIP_DB=true - starting without MongoDB");
  }
  const server = app.listen(PORT, () => {
    console.log(`ImpactBridge API running on port ${PORT}`);
  });
  initSocket(server);
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
