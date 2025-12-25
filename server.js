const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/user');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'AI Fitness Companion API is running'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI Fitness Companion API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      chat: '/api/chat/message',
      user: '/api/user/profile'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

/**
 * 🔴 IMPORTANT CHANGE FOR VERCEL
 * ❌ Removed app.listen()
 * ✅ Exporting app instead
 */
module.exports = app;
