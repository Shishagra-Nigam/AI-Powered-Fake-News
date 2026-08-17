const Analysis = require('../models/Analysis');
const fallbackDb = require('../services/dbFallbackService');

const getHistory = async (req, res, next) => {
  try {
    const { classification, search, limit = 20, page = 1 } = req.query;
    const isMongoConnected = Analysis.db.readyState === 1;

    if (!isMongoConnected) {
      const history = await fallbackDb.getAnalysisHistory({
        userId: req.user ? req.user.userId : null,
        search,
        classification
      });

      return res.status(200).json({
        history,
        total: history.length,
        page: 1,
        totalPages: 1
      });
    }

    let filter = {};

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
      .select('headline content sourceUrl credibilityScore classification mlConfidence reasoning webVerification dedicatedNeuralLLM createdAt flaggedPhrases');

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
    const isMongoConnected = Analysis.db.readyState === 1;

    let analysis = null;
    if (isMongoConnected) {
      analysis = await Analysis.findById(id);
    } else {
      const list = await fallbackDb.getAnalysisHistory({});
      analysis = list.find(item => item._id === id);
    }

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
    const isMongoConnected = Analysis.db.readyState === 1;

    if (!isMongoConnected) {
      const deleted = await fallbackDb.deleteAnalysisRecord(id, req.user ? req.user.userId : null);
      if (deleted) {
        return res.status(200).json({ message: 'Analysis record deleted successfully.', id });
      }
      return res.status(404).json({ error: 'Analysis record not found.' });
    }

    const analysis = await Analysis.findById(id);
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis record not found.' });
    }

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
