const mongoose = require('mongoose');

const FlaggedPhraseSchema = new mongoose.Schema({
  phrase: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['emotional', 'clickbait', 'unsourced', 'sensational', 'bias', 'logical_fallacy', 'other'],
    default: 'other' 
  },
  reason: { type: String, required: true }
});

const AnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  headline: {
    type: String,
    default: 'Untitled Article Analysis'
  },
  content: {
    type: String,
    required: [true, 'Article content is required']
  },
  sourceUrl: {
    type: String,
    default: null
  },
  credibilityScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  classification: {
    type: String,
    enum: ['reliable', 'misleading', 'satire', 'unverified'],
    required: true
  },
  mlConfidence: {
    type: Number,
    default: 0
  },
  mlClassification: {
    type: String,
    default: 'unverified'
  },
  reasoning: {
    summary: { type: String, required: true },
    sourcing: { type: String, default: '' },
    tone: { type: String, default: '' },
    logic: { type: String, default: '' },
    bias: { type: String, default: '' }
  },
  webVerification: {
    verifiedOnWeb: { type: Boolean, default: false },
    isHighStakes: { type: Boolean, default: false },
    summaryText: { type: String, default: '' },
    reputableSourcesFound: [{ title: String, source: String, link: String, pubDate: String }],
    debunkArticlesFound: [{ title: String, source: String, snippet: String }],
    searchResults: [{ title: String, source: String, link: String, pubDate: String }]
  },
  flaggedPhrases: [FlaggedPhraseSchema],
  metadata: {
    wordCount: { type: Number, default: 0 },
    readTimeMinutes: { type: Number, default: 1 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
