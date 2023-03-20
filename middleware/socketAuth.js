// socketAuth.js
const jwt = require("jsonwebtoken");
const secretKey = require("../config").secretKey;

module.exports = function(socket, next) {
  const token = socket.handshake.query.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error("Authentication error"));
  }
};
