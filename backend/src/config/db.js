const mongoose = require("mongoose");
const dns = require("dns");

const connectDb = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set");
  }

  const safeUri = uri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:*****@");
  console.log(`MongoDB URI: ${safeUri}`);

  if (process.env.DNS_SERVERS) {
    const servers = process.env.DNS_SERVERS.split(",").map((s) => s.trim()).filter(Boolean);
    if (servers.length) {
      dns.setServers(servers);
      console.log(`Using custom DNS servers: ${servers.join(", ")}`);
    }
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    family: 4,
    serverSelectionTimeoutMS: 5000
  });
  console.log("MongoDB connected");
};

module.exports = connectDb;
