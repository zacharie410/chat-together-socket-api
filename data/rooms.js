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

function getRooms() {
  return rooms;
}

function deleteRoom(roomId) {
  if (!rooms[roomId]) {
    return false;
  }

  delete rooms[roomId];
  return true;
}

function connectUser(roomId, socket) {
  rooms[roomId].add(socket.user.username);
  socket.join(roomId)
}

function isUserConnected(roomId, username) {
  if (rooms[roomId].has(username)) {
    return true;
  } else {
    return false;
  }
}

function disconnectUser(roomId, socket) {
  for (const roomId in rooms) {
    rooms[roomId].delete(socket.user.username);
  }
  socket.leave(roomId);
}

module.exports = {
  createRoom,
  getRoom,
  getRooms,
  deleteRoom,
  connectUser,
  disconnectUser,
  isUserConnected
};
