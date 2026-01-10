require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const theoriesRouter = require('./routes/theories');
const analysisRouter = require('./routes/analysis');
const evidenceRouter = require('./routes/evidence');
const searchRouter = require('./routes/search');
const userRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// AI analysis rate limiting (more restrictive)
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit AI analysis to 20 per hour per IP
  message: 'AI analysis rate limit exceeded. Please try again later.'
});
app.use('/api/analysis', aiLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// Compression
app.use(compression());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/theories', theoriesRouter);
app.use('/api/analysis', analysisRouter);
app.use('/api/evidence', evidenceRouter);
app.use('/api/search', searchRouter);
app.use('/api/users', userRouter);

// API documentation route
app.get('/api', (req, res) => {
  res.json({
    message: '3rd Eye View API',
    version: '1.0.0',
    endpoints: {
      theories: '/api/theories',
      analysis: '/api/analysis',
      evidence: '/api/evidence',
      search: '/api/search',
      users: '/api/users'
    },
    documentation: 'https://github.com/El-apuesto/3rd-eye-view/blob/main/docs/api.md'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      timestamp: new Date().toISOString()
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      status: 404,
      path: req.path
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 3rd Eye View API server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔍 API available at: http://localhost:${PORT}/api`);
});

module.exports = app;
