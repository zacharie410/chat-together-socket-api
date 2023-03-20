// socketHandler.js
const jwt = require("jsonwebtoken");
const secretKey = require("../config").secretKey;
const socketAuth = require("../middleware/socketAuth"); // Import socketAuth middleware
const rooms = require("../data/rooms");
const users = require("../data/users");

module.exports = function (io) {
  // Use the socketAuth middleware for token authentication
  console.log("socketHandler.js");
  io.use(socketAuth);

  // Place the rest of your Socket.IO event listeners here
  io.on("connection", (socket) => {
    const { username } = socket.user;

    // Check if the user is already connected before logging the event
    if (!users.isUserConnected(username)) {
      users.connectUser(username);
      console.log("A user connected:", socket.user);
    }

    // Send a message to a room
    socket.on("sendMessage", (roomId, message) => {
      if (!rooms.getRoom(roomId)) {
        return;
      }

      // Add the message to the room's messages
      const newMessage = {
        username: socket.user.username,
        text: message,
        timestamp: new Date(),
      };

      // Emit the message to all users in the room
      io.to(roomId).emit("newMessage", newMessage);

      console.log(
        `User ${socket.user.username} sent message to room ${roomId}: ${message}`
      );
    });

    socket.on("joinRoom", (roomId) => {
      // If the room doesn't exist, create it
      if (!rooms.getRoom(roomId)) {
        rooms.createRoom(roomId);
      }
      // If the user has already joined the room, do nothing
      if (rooms.isUserConnected(roomId, socket.user.username)) {
        //(rooms[roomId].has(socket.user.username)) {
        return;
      }
      // Add the user to the room
      rooms.connectUser(roomId, socket);
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

    // Leave a room
    socket.on("leaveRoom", (roomId) => {
      if (!rooms.getRoom(roomId)) {
        return;
      }

      // Remove the user from the room
      rooms.disconnectUser(roomId, socket);
      console.log(`User ${socket.user.username} left room ${roomId}`);
    });

    // Disconnect event
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.user);
      users.disconnectUser(socket.user.username);
    });
  });
};
