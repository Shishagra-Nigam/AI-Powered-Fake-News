const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'fake-news-detector-express-server',
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', require('./routes/analyzeRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/history', require('./routes/historyRoutes'));

// Global Error Handler
app.use(errorHandler);

// Database Connection & Server Listener
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fake_news_detector';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[DATABASE] Connected to MongoDB at ${MONGODB_URI}`);
  } catch (err) {
    console.warn(`[DATABASE WARNING] MongoDB connection failed (${err.message}). Application running in fallback mode.`);
  }
};

connectDB();

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Fake News & Misinformation Detector Express Server`);
  console.log(` Port: ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` ML Microservice URL: ${process.env.ML_SERVICE_URL || 'http://127.0.0.1:5001'}`);
  console.log(`====================================================`);
});

module.exports = app;
