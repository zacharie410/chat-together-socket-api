const express = require("express");
const jwt = require("jsonwebtoken");
const secretKey = require("../config.js").secretKey;
const auth = require("../middleware/auth"); // Import the auth middleware

const users = require("../data/users")

module.exports = function() {
  const router = express.Router();

  function validateUserName(username) {
    const FORBIDDEN_NAMES = new Set(["admin", "server", "anonymous"]);
  
    if (username && /^[a-zA-Z0-9_-]+$/.test(username)) {
      if (!FORBIDDEN_NAMES.has(username.toLowerCase())) {
        return true;
      }
    }
    return false;
  }
  
  function authenticateAnonymousUser(username, password) {
    if (
      !users.isUserConnected(username) &&
      password === "" &&
      validateUserName(username)
    ) {
      return { username: username };
    } else {
      return null;
    }
  }

  router.post("/login", (req, res) => {
    console.log("Attempt login")
    const { username, password } = req.body;

    const user = authenticateAnonymousUser(username, password);
    
    if (user) {
      const token = jwt.sign({ username: user.username }, secretKey, {
        expiresIn: "1h",
      });

      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  });

  // Use the auth middleware in the /check-token route
  router.get("/check-token", auth, (req, res) => {
    console.log("Check token")
    // If the auth middleware passed, the token is valid
    res.json({ valid: true });
  });

  return router;
};
