const jwt = require('jsonwebtoken');

/**
 * Required Authentication Middleware
 * Blocks unauthorized access if JWT is missing or invalid.
 */
const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No authentication token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_fake_news_detector_2026_portfolio');
    
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
};

/**
 * Optional Authentication Middleware
 * Attaches user to req.user if valid token provided, but allows guest access if no token.
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_fake_news_detector_2026_portfolio');
      req.user = decoded;
    }
  } catch (err) {
    // Ignore invalid token in optional mode
    req.user = null;
  }
  next();
};

module.exports = { requireAuth, optionalAuth };
