const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fallbackDb = require('../services/dbFallbackService');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_fake_news_detector_2026_portfolio';

/**
 * Register User Account with MongoDB and Local Fallback Store
 */
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const isMongoConnected = User.db.readyState === 1;

    // Check if user already exists
    let existingUser = null;
    if (isMongoConnected) {
      existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
    } else {
      existingUser = await fallbackDb.findUser({ $or: [{ email: email.toLowerCase() }, { username }] });
    }

    if (existingUser) {
      return res.status(409).json({ error: 'User with that email or username already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user record
    let user = null;
    if (isMongoConnected) {
      user = await User.create({
        username,
        email: email.toLowerCase(),
        password: hashedPassword
      });
    } else {
      user = await fallbackDb.createUser({
        username,
        email: email.toLowerCase(),
        password: hashedPassword
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`[AUTH] User registered successfully: ${user.username} (${user.email}) [Mongo: ${isMongoConnected}]`);

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Login User Account
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const isMongoConnected = User.db.readyState === 1;

    let user = null;
    if (isMongoConnected) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      user = await fallbackDb.findUser({ email: email.toLowerCase() });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`[AUTH] User logged in: ${user.username} (${user.email})`);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get Authenticated User Profile
 */
const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const isMongoConnected = User.db.readyState === 1;
    let user = null;

    if (isMongoConnected) {
      user = await User.findById(req.user.userId).select('-password');
    } else {
      const found = await fallbackDb.findUser({ _id: req.user.userId });
      if (found) {
        const { password, ...rest } = found;
        user = rest;
      }
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
