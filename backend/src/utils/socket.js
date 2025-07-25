const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5174",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", ({ firstName, userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log(firstName + " joined the room " + roomId);
      socket.join(roomId);
      console.log("Socket rooms:", socket.rooms);
    });

    socket.on("sendMessage", ({ firstName, userId, targetUserId, text }) => {
      const roomId = [userId, targetUserId].sort().join("_");

      socket.to(roomId).emit("messageReceived", {
        firstName,
        text,
        senderId: userId,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = initializeSocket;
