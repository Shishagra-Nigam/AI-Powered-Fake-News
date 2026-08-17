const Analysis = require('../models/Analysis');
const { scrapeArticle } = require('../services/scraperService');
const { predictWithML } = require('../services/mlService');
const { analyzeTextWithLLM } = require('../services/llmService');
const { verifyClaimOnWeb } = require('../services/factCheckService');
const fallbackDb = require('../services/dbFallbackService');

/**
 * Controller to handle article analysis requests (raw text or URL).
 */
const analyzeArticle = async (req, res, next) => {
  try {
    const { text, url } = req.body;

    if (!text && !url) {
      return res.status(400).json({ error: 'Please provide either raw article text or a valid article URL.' });
    }

    let articleText = text || '';
    let articleHeadline = 'Untitled Article Analysis';
    let sourceUrl = url || null;

    // Handle web scraping if URL is provided
    if (url) {
      try {
        console.log(`[ANALYZER] Scraping content from URL: ${url}`);
        const scraped = await scrapeArticle(url);
        articleText = scraped.text;
        articleHeadline = scraped.headline;
      } catch (scrapeErr) {
        return res.status(422).json({ error: `Article Scraping Error: ${scrapeErr.message}` });
      }
    } else {
      const lines = articleText.trim().split('\n');
      if (lines[0] && lines[0].length < 120) {
        articleHeadline = lines[0].trim();
      } else {
        articleHeadline = articleText.trim().substring(0, 70) + '...';
      }
    }

    if (!articleText || articleText.trim().length < 15) {
      return res.status(400).json({ error: 'Article text must contain at least 15 characters for accurate analysis.' });
    }

    console.log(`[ANALYZER] Processing article: "${articleHeadline}" (${articleText.length} chars)`);

    // Run ML prediction (with dedicated Neural LLM engine), LLM reasoning, AND Live Web Fact Check concurrently
    const [mlResult, llmResult, webFactCheck] = await Promise.all([
      predictWithML(articleText, articleHeadline),
      analyzeTextWithLLM(articleText, articleHeadline),
      verifyClaimOnWeb(articleText, articleHeadline)
    ]);

    // Synthesize combined credibility score
    let finalScore = llmResult.score;
    let finalClassification = llmResult.classification;

    if (mlResult.available) {
      const mlReliableScore = (1 - mlResult.fakeProbability) * 100;
      finalScore = Math.round((mlReliableScore * 0.35) + (llmResult.score * 0.65));
    }

    // Apply Live Web Fact-Verification Penalty / Validation
    if (webFactCheck.webPenalty > 0) {
      finalScore = Math.max(5, Math.min(30, finalScore - webFactCheck.webPenalty));
      if (webFactCheck.isHighStakes || webFactCheck.debunkArticlesFound.length > 0) {
        finalClassification = 'misleading';
      }
    } else if (webFactCheck.verifiedOnWeb) {
      finalScore = Math.min(98, finalScore + 15);
      finalClassification = 'reliable';
    }

    // Determine classification label based on final score
    if (finalScore >= 75) {
      finalClassification = 'reliable';
    } else if (finalScore <= 45) {
      finalClassification = 'misleading';
    } else if (llmResult.classification === 'satire') {
      finalClassification = 'satire';
    }

    // If web check indicates false hoax, override reasoning summary
    let reasoningOutput = { ...llmResult.reasoning };
    if (webFactCheck.webPenalty >= 70) {
      reasoningOutput.summary = `${webFactCheck.summaryText} ${reasoningOutput.summary}`;
      reasoningOutput.sourcing = `ZERO REPUTABLE SOURCES FOUND: ${webFactCheck.summaryText}`;
    }

    // Word count & read time metadata
    const words = articleText.trim().split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));

    const analysisPayload = {
      userId: req.user ? req.user.userId : null,
      headline: articleHeadline,
      content: articleText,
      sourceUrl,
      credibilityScore: finalScore,
      classification: finalClassification,
      mlConfidence: mlResult.confidence,
      mlClassification: mlResult.classification,
      dedicatedNeuralLLM: mlResult.dedicatedNeuralLLM || null,
      reasoning: reasoningOutput,
      webVerification: webFactCheck,
      flaggedPhrases: llmResult.flaggedPhrases,
      metadata: {
        wordCount: words,
        readTimeMinutes
      }
    };

    // Save to MongoDB or Fallback DB
    let savedRecord = null;
    try {
      if (Analysis.db.readyState === 1) {
        savedRecord = await Analysis.create(analysisPayload);
      } else {
        savedRecord = await fallbackDb.createAnalysisRecord(analysisPayload);
      }
    } catch (dbErr) {
      console.warn(`[DATABASE WARNING] Could not persist analysis: ${dbErr.message}`);
    }

    const responseId = savedRecord ? savedRecord._id : `temp_${Date.now()}`;

    return res.status(200).json({
      success: true,
      analysis: {
        id: responseId,
        ...analysisPayload,
        createdAt: savedRecord ? savedRecord.createdAt : new Date().toISOString()
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { analyzeArticle };
