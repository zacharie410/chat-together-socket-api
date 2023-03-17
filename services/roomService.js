const rooms = {};
const roomMessages = {};

function createRoom(roomId) {
  // Check if the room already exists
  if (rooms[roomId]) {
    return { status: "error", message: "Room already exists" };
  }

  // Create the room
  rooms[roomId] = new Set();
  roomMessages[roomId] = [];

  return { status: "success", message: "Room created" };
}

function getRoomMessages(roomId) {
  // Check if the room exists
  if (!rooms[roomId]) {
    return { status: "error", message: "Room not found" };
  }

  // Return the messages for the room
  return { status: "success", messages: roomMessages[roomId] };
}

module.exports = {
  createRoom,
  getRoomMessages,
};
