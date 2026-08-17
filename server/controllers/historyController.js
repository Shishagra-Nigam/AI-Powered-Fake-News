const Analysis = require('../models/Analysis');

const getHistory = async (req, res, next) => {
  try {
    const { classification, search, limit = 20, page = 1 } = req.query;

    if (Analysis.db.readyState !== 1) {
      return res.status(200).json({
        history: [],
        total: 0,
        page: 1,
        notice: 'MongoDB is currently disconnected. Working in memory-only mode.'
      });
    }

    let filter = {};

    // Filter by user if logged in
    if (req.user && req.user.userId) {
      filter.userId = req.user.userId;
    }

    if (classification) {
      filter.classification = classification;
    }

    if (search) {
      filter.$or = [
        { headline: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Analysis.countDocuments(filter);
    
    const history = await Analysis.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('headline content sourceUrl credibilityScore classification mlConfidence reasoning.summary createdAt flaggedPhrases');

    return res.status(200).json({
      history,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });

  } catch (error) {
    next(error);
  }
};

const getAnalysisById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (Analysis.db.readyState !== 1) {
      return res.status(404).json({ error: 'Analysis record not found (Database disconnected).' });
    }

    const analysis = await Analysis.findById(id);
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis record not found.' });
    }

    return res.status(200).json({ analysis });
  } catch (error) {
    next(error);
  }
};

const deleteAnalysis = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (Analysis.db.readyState !== 1) {
      return res.status(503).json({ error: 'Database service unavailable.' });
    }

    const analysis = await Analysis.findById(id);
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis record not found.' });
    }

    // Security check: ensure item belongs to logged-in user if token present
    if (req.user && analysis.userId && analysis.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'You do not have permission to delete this analysis record.' });
    }

    await Analysis.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Analysis record deleted successfully.', id });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHistory, getAnalysisById, deleteAnalysis };
