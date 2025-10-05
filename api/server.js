// Curry2Cakes API Server
// Handles invite code generation and email sending

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { requestInviteCode, validateInviteCode, getInviteStats } = require('./invite-service');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'curry2cakes-api'
  });
});

// Request invite code endpoint
app.post('/api/invite/request', async (req, res) => {
  try {
    const { email, userName } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email address is required'
      });
    }

    console.log(`Invite request from: ${email}${userName ? ` (${userName})` : ''}`);

    const result = await requestInviteCode(email, userName);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('Error processing invite request:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Validate invite code endpoint
app.post('/api/invite/validate', (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        valid: false,
        error: 'Invite code is required'
      });
    }

    console.log(`Validating invite code: ${code}`);

    const result = validateInviteCode(code);
    res.json(result);

  } catch (error) {
    console.error('Error validating invite code:', error);
    res.status(500).json({
      valid: false,
      error: 'Internal server error'
    });
  }
});

// Get invite statistics (admin endpoint)
app.get('/api/admin/stats', (req, res) => {
  try {
    // In production, add proper authentication here
    const stats = getInviteStats();
    res.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Curry2Cakes API server running on port ${PORT}`);
  console.log(`📧 Email service: ${process.env.NODE_ENV === 'production' ? 'GoDaddy' : 'Mock'}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

module.exports = app;
