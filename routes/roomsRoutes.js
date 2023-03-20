// roomsRoutes.js
const express = require("express");

const rooms = require("../data/rooms")

module.exports = function() {
  const router = express.Router();

  router.post("/", (req, res) => {
    const { roomId } = req.body;

    // Check if the room already exists
    if (rooms.getRoom(roomId)) {
      return res.status(400).json({ message: "Room already exists" });
    }

    rooms.createRoom(roomId);

    res.status(201).json({ message: "Room created" });
  });

  return router;
};
