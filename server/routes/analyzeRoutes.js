const express = require('express');
const router = express.Router();
const { analyzeArticle } = require('../controllers/analyzeController');
const { optionalAuth } = require('../middleware/authMiddleware');

// POST /api/analyze - Accepts text or url, optional Auth header
router.post('/analyze', optionalAuth, analyzeArticle);

module.exports = router;
