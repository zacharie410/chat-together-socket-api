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
//
const socketHandler = require("./sockets/socketHandler");
const roomsRoutes = require("./routes/roomsRoutes")();
const authRoutes = require("./routes/authRoutes")();
//routing
app.use("/rooms", roomsRoutes);
app.use(authRoutes);
// socketHandler
socketHandler(io);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
