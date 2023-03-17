const jwt = require("jsonwebtoken");
const secretKey = require("../config/secretKey");
const authenticateAnonymousUser = require("../services/authService");

function authController(app) {
  // Endpoint for anonymous login
  app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Authenticate the user
    const user = authenticateAnonymousUser(username, password);

    if (user) {
      // Generate a JWT token
      const token = jwt.sign({ username: user.username }, secretKey, {
        expiresIn: "1h",
      });

      // Return the token as a JSON response
      res.json({ token });
    } else {
      // Return an error message as a JSON response
      res.status(401).json({ message: "Invalid username or password" });
    }
  });

  // Endpoint for checking token validity
  app.get("/check-token", (req, res) => {
    const token = req.headers.authorization.split(" ")[1];

    try {
      jwt.verify(token, secretKey);
      res.json({ valid: true });
    } catch (err) {
      res.json({ valid: false });
    }
  });
}

module.exports = authController;
