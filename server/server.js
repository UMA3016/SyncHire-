const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --------------- Middleware ---------------
app.use(cors()); // allow all origins for development
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --------------- Routes ---------------
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Health-check endpoint
app.get('/', (_req, res) => {
  res.json({ message: 'SyncHire API is running' });
});

// --------------- Error Handling Middleware ---------------
// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// --------------- Start Server with Socket.io ---------------
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // For development, allow all
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

const Message = require('./models/Message');
const ChatRoom = require('./models/ChatRoom');
const Notification = require('./models/Notification');

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Join a specific chat room
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Join a personal user room for global notifications
  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Socket ${socket.id} joined personal room user_${userId}`);
  });

  // Handle incoming messages
  socket.on('send_message', async (data) => {
    try {
      const { chatRoomId, senderId, text, fileUrl, fileName } = data;

      // Save message to database
      const newMessage = await Message.create({
        chatRoomId,
        senderId,
        text,
        fileUrl,
        fileName,
      });

      // Update last message timestamp & determine recipient
      const chatRoom = await ChatRoom.findByIdAndUpdate(
        chatRoomId, 
        { lastMessageAt: new Date() },
        { new: true } // Return the updated document to check users
      );

      // Determine recipient (either candidate or recruiter)
      const recipientId = 
        senderId === chatRoom.candidateId.toString() 
          ? chatRoom.recruiterId.toString() 
          : chatRoom.candidateId.toString();

      // Create notification
      let notif = await Notification.create({
        userId: recipientId,
        senderId,
        applicationId: chatRoom.applicationId,
        jobId: chatRoom.jobId,
        message: text || (fileUrl ? 'Sent a file' : 'New message'),
        type: 'chat_message'
      });

      notif = await notif.populate('senderId', 'name');

      // Broadcast to everyone in the chat room
      io.to(chatRoomId).emit('receive_message', newMessage);

      // Broadcast the notification to the recipient's personal room
      io.to(`user_${recipientId}`).emit('receive_notification', notif);

    } catch (error) {
      console.error('Socket send_message error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server & WebSockets running on port ${PORT}`);
});
