const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

let io;
const userSockets = new Map();

const initSocket = (server) => {
  io = socketIo(server, {
    cors: { origin: "http://localhost:3000" },
  });

  io.on("connection", async (socket) => {
    console.log("User connected:", socket.id);

    socket.on("registerUser", async (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) return socket.disconnect();

        userSockets.set(user._id.toString(), socket.id);
        console.log(`User ${user._id} registered with socket ${socket.id}`);
      } catch (error) {
        console.log("Invalid WebSocket token");
        socket.disconnect();
      }
    });

    socket.on("disconnect", () => {
      for (let [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });
};

const emitToUser = (userId, event, data) => {
  const socketId = userSockets.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
};

module.exports = { initSocket, emitToUser };
