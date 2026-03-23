const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDb = require("./config/db");

const PORT = process.env.PORT || 4000;

const start = async () => {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`ImpactBridge API running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
