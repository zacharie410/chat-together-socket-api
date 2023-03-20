// data/rooms.js
const users = {};

function isUserConnected(username) {
  if (users[username]) {
    return true;
  } else {
    return false;
  }
}

function getUser(username) {
  return users[username];
}

function connectUser(username) {
    users[username] = true;
}

function disconnectUser(username) {
  if (!users[username]) {
    return false;
  }

  delete users[username];
  return true;
}

module.exports = {
  isUserConnected,
  getUser,
  disconnectUser,
  connectUser
};
