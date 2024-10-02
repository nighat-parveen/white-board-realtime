const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
// socket setup
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (adjust this in production)
    methods: ['GET', 'POST'],
  },
});

app.use(cors()); // Enable CORS

app.get('/', (req, res) => {
    res.send('Server is running');
});

const connectedUsers = new Set();


io.on('connection', (socketBoard) => {
    console.log('a user connected', socketBoard.id);
    connectedUsers.add(socketBoard.id);

    socketBoard.on('drawing', (data) => {
        console.log(data);
        socketBoard.broadcast.emit('drawing', data);
    });
    socketBoard.on('disconnect', () => {
        console.log('User disconnected:', socketBoard.id);
        connectedUsers.delete(socketBoard.id);
        console.log(`Currently connected users: ${[...connectedUsers].length}`);
      });
});

const PORT = 8000;

server.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});