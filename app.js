const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const authController = require("./controllers/authController");
const roomController = require("./controllers/roomController");
const messageController = require("./controllers/messageController");
const corsOptions = require("./config/corsOptions");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { transports: ["websocket", "polling"] });

app.use(cors(corsOptions));
app.use(express.json());

authController(app);
roomController(app);
messageController(io);

const PORT = 8080;

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
