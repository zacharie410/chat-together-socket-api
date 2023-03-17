const jwt = require("jsonwebtoken");
const secretKey = require("../config/secretKey");
const { joinRoom, leaveRoom, sendMessage } = require("../services/messageService");

function messageController(io) {
  // Socket.IO middleware for token authentication
  io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }

    // Verify the token
    try {
      const decoded = jwt.verify(token, secretKey);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    // ... (rest of your Socket.IO event handling code)
  });
}

module.exports = messageController;
