// socketHandler.js
const jwt = require("jsonwebtoken");
const secretKey = require("../config").secretKey;
const socketAuth = require("../middleware/socketAuth"); // Import socketAuth middleware

module.exports = function (io, connectedUsers, rooms, roomMessages) {
  // Use the socketAuth middleware for token authentication
  io.use(socketAuth);

  // Place the rest of your Socket.IO event listeners here
  io.on("connection", (socket) => {
    const { username } = socket.user;

    // Check if the user is already connected before logging the event
    if (!connectedUsers[username]) {
      connectedUsers[username] = true;
      console.log("A user connected:", socket.user);
    }

    socket.on("joinRoom", (roomId) => {
      // If the room doesn't exist, create it
      if (!rooms[roomId]) {
        rooms[roomId] = new Set();
        roomMessages[roomId] = [];
      }
      // If the user has already joined the room, do nothing
      if (rooms[roomId].has(socket.user.username)) {
        return;
      }

      // Add the user to the room
      rooms[roomId].add(socket.user.username);
      socket.join(roomId);
      console.log(`User ${socket.user.username} joined room ${roomId}`);

      const newMessage = {
        username: "SERVER: ",
        text: `User ${socket.user.username} joined room ${roomId}`,
        timestamp: new Date(),
      };

      // Emit the message to all users in the room
      io.to(roomId).emit("newMessage", newMessage);

      // Send the room list to the "rooms" room
      if (roomId === "rooms") {
        socket.emit("roomList", Object.keys(rooms));
      }
    });

    // Send a message to a room
    socket.on("sendMessage", (roomId, message) => {
      if (!rooms[roomId]) {
        return;
      }

      // Add the message to the room's messages
      const newMessage = {
        username: socket.user.username,
        text: message,
        timestamp: new Date(),
      };
      roomMessages[roomId].push(newMessage);

      // Emit the message to all users in the room
      io.to(roomId).emit("newMessage", newMessage);

      console.log(
        `User ${socket.user.username} sent message to room ${roomId}: ${message}`
      );
    });

    // Leave a room
    socket.on("leaveRoom", (roomId) => {
      if (!rooms[roomId]) {
        return;
      }

      // Remove the user from the room
      rooms[roomId].delete(socket.user.username);
      socket.leave(roomId);
      console.log(`User ${socket.user.username} left room ${roomId}`);
    });

    // Disconnect event
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.user);

      // Remove the user from all rooms
      for (const roomId in rooms) {
        rooms[roomId].delete(socket.user.username);
      }

      // Remove the user from the connected users
      delete connectedUsers[username];
    });
  });
};
