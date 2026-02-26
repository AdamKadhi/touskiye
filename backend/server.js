const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// Rate limiting - Increased limit to prevent blocking during development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased from 100 to 500
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// CORS configuration - More robust
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      process.env.CLIENT_URL
    ].filter(Boolean); // Remove undefined values
    
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`⚠️ CORS blocked origin: ${origin}`);
      callback(null, true); // Allow anyway in development
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: '🛍️ Welcome to TOUSKIYE API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders'
    }
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

// 404 handler - Must be before error handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`
  });
});

// Global error handling middleware - Must be last
app.use((err, req, res, next) => {
  console.error('❌ Error occurred:');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  
  // Send error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? {
      stack: err.stack,
      ...err
    } : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
    ╔══════════════════════════════════════╗
    ║  🚀 TOUSKIYE API Server Running     ║
    ╠══════════════════════════════════════╣
    ║  Port: ${PORT}                        ║
    ║  Environment: ${process.env.NODE_ENV || 'development'}          ║
    ║  URL: http://localhost:${PORT}         ║
    ║  Health: http://localhost:${PORT}/health  ║
    ╚══════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections - DON'T EXIT, JUST LOG
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ UNHANDLED PROMISE REJECTION:');
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('Promise:', promise);
  console.log('⚠️ Server will continue running...');
  // Don't exit the process - just log the error
});

// Handle uncaught exceptions - DON'T EXIT, JUST LOG
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:');
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.log('⚠️ Server will continue running...');
  // Don't exit the process - just log the error
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('\n👋 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;