const express = require('express');
const router = express.Router();
const { getHistory, getAnalysisById, deleteAnalysis } = require('../controllers/historyController');
const { optionalAuth, requireAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, getHistory);
router.get('/:id', optionalAuth, getAnalysisById);
router.delete('/:id', requireAuth, deleteAnalysis);

module.exports = router;
