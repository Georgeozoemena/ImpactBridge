let io;

const initSocket = (server) => {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

  io.on("connection", (socket) => {
    socket.on("joinCampaign", (campaignId) => {
      if (campaignId) {
        socket.join(`campaign:${campaignId}`);
      }
    });

    socket.on("leaveCampaign", (campaignId) => {
      if (campaignId) {
        socket.leave(`campaign:${campaignId}`);
      }
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { initSocket, getIo };
