const authMiddleware = require("../middleware/authMiddleware");
const { createRoom, getRoomMessages } = require("../services/roomService");

function roomController(app) {
  // Use the authentication middleware for room-related routes
  app.use("/rooms", authMiddleware);

  // Endpoint to create a new room
  app.post("/rooms", (req, res) => {
    const { roomId } = req.body;
    const result = createRoom(roomId);

    if (result.success) {
      res.status(201).json({ message: "Room created" });
    } else {
      res.status(400).json({ message: result.message });
    }
  });

  // Endpoint to get messages for a room
  app.get("/rooms/:roomId/messages", (req, res) => {
    const roomId = req.params.roomId;
    const result = getRoomMessages(roomId);

    if (result.success) {
      res.json(result.messages);
    } else {
      res.status(404).json({ message: result.message });
    }
  });
}

module.exports = roomController;
