const jwt = require("jsonwebtoken");
const secretKey = require("../config/secretKey");

function authenticateAnonymousUser(username, password, connectedUsers) {
  // Check if the username is not already in use and the password is empty
  if (!connectedUsers[username] && password === "") {
    return { username: username };
  } else {
    return null;
  }
}

function generateToken(user) {
  // Generate a JWT token
  const token = jwt.sign({ username: user.username }, secretKey, {
    expiresIn: "1h",
  });

  return token;
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return { valid: true, decoded };
  } catch (err) {
    return { valid: false };
  }
}

module.exports = {
  authenticateAnonymousUser,
  generateToken,
  verifyToken,
};
