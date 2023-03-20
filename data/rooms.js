// data/rooms.js
const rooms = {};

function createRoom(roomId) {
  if (rooms[roomId]) {
    return false;
  }

  rooms[roomId] = new Set();
  return true;
}

function getRoom(roomId) {
  return rooms[roomId];
}

function deleteRoom(roomId) {
  if (!rooms[roomId]) {
    return false;
  }

  delete rooms[roomId];
  return true;
}

module.exports = {
  createRoom,
  getRoom,
  deleteRoom,
};
