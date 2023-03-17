const jwt = require("jsonwebtoken");
const secretKey = require("../config/secretKey");

function authMiddleware(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication error: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Authentication error: Invalid token" });
  }
}

module.exports = authMiddleware;
