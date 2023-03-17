const rooms = {};

function joinRoom(username, roomId) {
  // If the room doesn't exist, create it
  if (!rooms[roomId]) {
    rooms[roomId] = new Set();
  }

  // If the user has already joined the room, do nothing
  if (rooms[roomId].has(username)) {
    return { status: "error", message: "User already in the room" };
  }

  // Add the user to the room
  rooms[roomId].add(username);

  return { status: "success", message: `User ${username} joined room ${roomId}` };
}

function leaveRoom(username, roomId) {
  if (!rooms[roomId]) {
    return { status: "error", message: "Room not found" };
  }

  if (!rooms[roomId].has(username)) {
    return { status: "error", message: "User not in the room" };
  }

  // Remove the user from the room
  rooms[roomId].delete(username);

  return { status: "success", message: `User ${username} left room ${roomId}` };
}

function sendMessage(username, roomId, message, roomMessages) {
  if (!rooms[roomId]) {
    return { status: "error", message: "Room not found" };
  }

  // Add the message to the room's messages
  const newMessage = {
    username: username,
    text: message,
    timestamp: new Date(),
  };
  roomMessages[roomId].push(newMessage);

  return { status: "success", message: newMessage };
}

module.exports = {
  joinRoom,
  leaveRoom,
  sendMessage,
};
