const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const Document = require('./models/Document');

require('dotenv').config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

mongoose.connect(process.env.MONGO_URI);

io.on('connection', socket => {
  socket.on('get-document', async docId => {
    const document = await Document.findById(docId) || await Document.create({ _id: docId, content: '' });
    socket.join(docId);
    socket.emit('load-document', document.content);

    socket.on('send-changes', delta => {
      socket.broadcast.to(docId).emit('receive-changes', delta);
    });

    socket.on('save-document', async content => {
      await Document.findByIdAndUpdate(docId, { content });
    });
  });
});

server.listen(3001, () => {
  console.log('Server listening on port 3001');
});
