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

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'AI Fitness Companion API is running'
  });
});

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'AI Fitness Companion API',
    version: '1.0.0'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('ERROR:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 🚨 REQUIRED FOR VERCEL
module.exports = app;
