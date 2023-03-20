//
const PORT = 8080;
//
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
//
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { transports: ["websocket", "polling"] });
const corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));
app.use(express.json());
//
const connectedUsers = {};
const rooms = {};
const roomMessages = {};
//
const socketHandler = require("./sockets/socketHandler");
const roomsRoutes = require("./routes/roomsRoutes")(rooms, roomMessages);
const authRoutes = require("./routes/authRoutes")(connectedUsers);

//routing
app.use("/rooms", roomsRoutes);
app.use(authRoutes);
// socketHandler
socketHandler(io, connectedUsers, rooms, roomMessages);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
