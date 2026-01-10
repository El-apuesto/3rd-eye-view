const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// Register new user
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if user exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user
    const user = await User.create({ username, email, password });

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = await User.verifyPassword(username, password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ user, token });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const preferences = await User.getPreferences(user.id);

    res.json({ user, preferences });
  } catch (error) {
    next(error);
  }
});

// Update user preferences
router.put('/preferences', authenticateToken, async (req, res, next) => {
  try {
    const preferences = await User.updatePreferences(req.user.id, req.body);
    res.json({ preferences });
  } catch (error) {
    next(error);
  }
});

// Get saved theories
router.get('/saved', authenticateToken, async (req, res, next) => {
  try {
    const theories = await User.getSavedTheories(req.user.id);
    res.json({ theories });
  } catch (error) {
    next(error);
  }
});

// Save theory
router.post('/saved/:theoryId', authenticateToken, async (req, res, next) => {
  try {
    const theoryId = parseInt(req.params.theoryId);
    const { notes } = req.body;
    
    const saved = await User.saveTheory(req.user.id, theoryId, notes);
    res.json({ saved });
  } catch (error) {
    next(error);
  }
});

// Unsave theory
router.delete('/saved/:theoryId', authenticateToken, async (req, res, next) => {
  try {
    const theoryId = parseInt(req.params.theoryId);
    const unsaved = await User.unsaveTheory(req.user.id, theoryId);
    
    if (!unsaved) {
      return res.status(404).json({ error: 'Theory not in saved list' });
    }

    res.json({ message: 'Theory removed from saved list' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
