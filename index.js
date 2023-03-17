const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { transports: ['websocket', 'polling'] });

const corsOptions = {
  origin: 'http://localhost:3000'
};

app.use(cors(corsOptions));
app.use(express.json());
const connectedUsers = {};

const PORT = 8080;

// JWT secret key
const crypto = require('crypto');
const secretKey = crypto.randomBytes(64).toString('hex');

// Authentication middleware
function authenticateAnonymousUser(username, password) {
  // Check if the username is not already in use and the password is empty
  if (!connectedUsers[username] && password === '') {
    return { username: username };
  } else {
    return null;
  }
}

// Endpoint for anonymous login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Authenticate the user
  const user = authenticateAnonymousUser(username, password);

  if (user) {
    // Generate a JWT token
    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });

    // Return the token as a JSON response
    res.json({ token });
  } else {
    // Return an error message as a JSON response
    res.status(401).json({ message: 'Invalid username or password' });
  }
});
// Endpoint for checking token validity
app.get('/check-token', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  try {
    jwt.verify(token, secretKey);
    res.json({ valid: true });
  } catch (err) {
    res.json({ valid: false });
  }
});


// Endpoint to create a new room
app.post('/rooms', (req, res) => {
  const { roomId } = req.body;

  // Check if the room already exists
  if (rooms[roomId]) {
    return res.status(400).json({ message: 'Room already exists' });
  }

  // Create the room
  rooms[roomId] = new Set();
  roomMessages[roomId] = [];

  // Return success status
  res.status(201).json({ message: 'Room created' });
});

// Endpoint to get messages for a room
app.get('/rooms/:roomId/messages', (req, res) => {
  const roomId = req.params.roomId;

  // Check if the room exists
  if (!rooms[roomId]) {
    return res.status(404).json({ message: 'Room not found' });
  }

  // Return the messages for the room
  res.json(roomMessages[roomId]);
});

// ... (rest of your server code)

// Socket.IO middleware for token authentication
io.use((socket, next) => {
  const token = socket.handshake.query.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, secretKey);
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error('Authentication error'));
  }
});

const rooms = {};
const roomMessages = {};

io.on('connection', (socket) => {
  const { username } = socket.user;

  // Check if the user is already connected before logging the event
  if (!connectedUsers[username]) {
    connectedUsers[username] = true;
    console.log('A user connected:', socket.user);
  }

  socket.on('joinRoom', (roomId) => {
    // If the room doesn't exist, create it
    if (!rooms[roomId]) {
      rooms[roomId] = new Set();
      roomMessages[roomId] = [];
    }
  
    // If the user has already joined the room, do nothing
    if (rooms[roomId].has(socket.user.username)) {
      return;
    }
  
    // Add the user to the room
    rooms[roomId].add(socket.user.username);
    socket.join(roomId);
    console.log(`User ${socket.user.username} joined room ${roomId}`);
  
    // Send the room list to the "rooms" room
    if (roomId === 'rooms') {
      socket.emit('roomList', Object.keys(rooms));
    }
  });
  
  // Leave a room
  socket.on('leaveRoom', (roomId) => {
    if (!rooms[roomId]) {
    return;
    }

    // Remove the user from the room
    rooms[roomId].delete(socket.user.username);
    socket.leave(roomId);
    console.log(`User ${socket.user.username} left room ${roomId}`);
    });
    
    // Send a message to a room
    socket.on('sendMessage', (roomId, message) => {
      if (!rooms[roomId]) {
      return;
      }
    
      // Add the message to the room's messages
      const newMessage = {
        username: socket.user.username,
        text: message,
        timestamp: new Date()
      };
      roomMessages[roomId].push(newMessage);
      
      // Emit the message to all users in the room
      io.to(roomId).emit('newMessage', newMessage);
      
      console.log(`User ${socket.user.username} sent message to room ${roomId}: ${message}`);
    });
    
    // Disconnect event
    socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.user);

    // Remove the user from all rooms
    for (const roomId in rooms) {
      rooms[roomId].delete(socket.user.username);
    }
    
    // Remove the user from the connected users
    delete connectedUsers[username];
    });
  });
  
  
  // Start the server
  server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  });