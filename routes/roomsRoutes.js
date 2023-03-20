// roomsRoutes.js
const express = require("express");

module.exports = function(rooms, roomMessages) {
  const router = express.Router();

  router.post("/", (req, res) => {
    const { roomId } = req.body;

    // Check if the room already exists
    if (rooms[roomId]) {
      return res.status(400).json({ message: "Room already exists" });
    }

    // Create the room
    rooms[roomId] = new Set();
    roomMessages[roomId] = [];

    // Return success status
    res.status(201).json({ message: "Room created" });
  });

  router.get("/:roomId/messages", (req, res) => {
    const roomId = req.params.roomId;

    // Check if the room exists
    if (!rooms[roomId]) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Return the messages for the room
    res.json(roomMessages[roomId]);
  });

  return router;
};
