const axios = require('axios');
const cheerio = require('cheerio');

// Reputable Mainstream Media Agencies & Science Publishers
const REPUTABLE_KEYWORDS = [
  'reuters', 'ap news', 'associated press', 'bbc', 'pti', 'ani', 'pib', 'ndtv',
  'times of india', 'indian express', 'hindustan times', 'bloomberg', 'cnn',
  'nytimes', 'new york times', 'al jazeera', 'the hindu', 'news18', 'india today',
  'abc news', 'guardian', 'nasa', 'nature', 'science', 'space.com', 'scientific american',
  'washington post', 'wall street journal', 'forbes', 'cnbc'
];

// High-Stakes Event Keywords (death, emergency, resignation, war, collapse)
const HIGH_STAKES_PATTERNS = [
  /\b(dead|died|death|assassinated|assassination|killed|resigned|resignation|arrested|passed away)\b/i,
  /\b(nuclear strike|war declared|bank collapse|martial law|state of emergency|outbreak)\b/i
];

/**
 * Perform live web search query on Google News RSS
 */
const searchGoogleNews = async (query) => {
  try {
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    const response = await axios.get(rssUrl, {
      timeout: 7000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data, { xmlMode: true });
    const results = [];

    $('item').slice(0, 8).each((i, el) => {
      const title = $(el).find('title').text().trim();
      const link = $(el).find('link').text().trim();
      const pubDate = $(el).find('pubDate').text().trim();
      const source = $(el).find('source').text().trim() || 'News Source';

      if (title) {
        results.push({ title, link, pubDate, source });
      }
    });

    return results;
  } catch (err) {
    console.warn(`[FACT CHECK WARNING] Google News RSS query failed: ${err.message}`);
    return [];
  }
};

/**
 * Perform search on DuckDuckGo HTML for fact-checks and rumors
 */
const searchDuckDuckGoFactCheck = async (query) => {
  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + ' fact check fake news hoax')}`;
    const response = await axios.get(searchUrl, {
      timeout: 7000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const $ = cheerio.load(response.data);
    const results = [];

    $('.result').slice(0, 6).each((i, el) => {
      const title = $(el).find('.result__title').text().trim();
      const snippet = $(el).find('.result__snippet').text().trim();
      const url = $(el).find('.result__url').text().trim();

      if (title) {
        results.push({ title, snippet, url });
      }
    });

    return results;
  } catch (err) {
    console.warn(`[FACT CHECK WARNING] DuckDuckGo search query failed: ${err.message}`);
    return [];
  }
};

/**
 * Main Web Search Fact-Verification Engine
 */
const verifyClaimOnWeb = async (text, headline = '') => {
  const combined = `${headline} ${text}`.trim();
  
  // Clean query for search
  let searchQuery = headline && headline.length > 10 ? headline : combined.substring(0, 90);
  searchQuery = searchQuery.replace(/[^\w\s]/gi, ' ').replace(/\s+/g, ' ').trim();

  // Check if text makes a high-stakes claim
  const isHighStakes = HIGH_STAKES_PATTERNS.some(pattern => pattern.test(combined));

  console.log(`[FACT CHECK ENGINE] Searching live web for query: "${searchQuery}" (HighStakes: ${isHighStakes})`);

  // Execute parallel live web search queries
  const [googleNewsResults, ddgResults] = await Promise.all([
    searchGoogleNews(searchQuery),
    searchDuckDuckGoFactCheck(searchQuery)
  ]);

  let reputableMatches = [];
  let debunkMatches = [];

  // Analyze Google News results
  googleNewsResults.forEach(item => {
    const srcLower = item.source.toLowerCase();
    const titleLower = item.title.toLowerCase();

    const isReputable = REPUTABLE_KEYWORDS.some(kw => srcLower.includes(kw) || titleLower.includes(kw));

    if (isReputable) {
      reputableMatches.push(item);
    }

    if (/\b(fake|hoax|false|debunk|untrue|rumor|pib fact check|misleading)\b/i.test(titleLower)) {
      debunkMatches.push(item);
    }
  });

  // Analyze DuckDuckGo results for debunking reports
  ddgResults.forEach(item => {
    const textLower = `${item.title} ${item.snippet}`.toLowerCase();
    if (/\b(fake|hoax|false|debunk|untrue|rumor|pib fact check|misleading|fact check)\b/i.test(textLower)) {
      debunkMatches.push({
        title: item.title,
        source: item.url || 'Fact-Check Registry',
        snippet: item.snippet
      });
    }
  });

  // Determine Web Verification Status
  let verifiedOnWeb = false;
  let webPenalty = 0;
  let summaryText = '';

  if (debunkMatches.length > 0) {
    verifiedOnWeb = false;
    webPenalty = 85;
    summaryText = `⚠️ FAKE NEWS / DEBUNKED HOAX: Live web search identified fact-check debunking articles confirming this claim is false or a viral rumor.`;
  } else if (isHighStakes && reputableMatches.length === 0) {
    verifiedOnWeb = false;
    webPenalty = 75;
    summaryText = `❌ UNVERIFIED HIGH-STAKES CLAIM: Zero reputable news outlets (Reuters, BBC, PTI, ANI, PIB, Times of India, etc.) have reported this event. Major claims regarding death or emergency without official coverage are false hoaxes.`;
  } else if (reputableMatches.length > 0) {
    verifiedOnWeb = true;
    webPenalty = 0;
    summaryText = `✅ VERIFIED ON WEB: Live web search confirmed coverage from established news agencies (${reputableMatches.map(m => m.source).slice(0, 3).join(', ')}).`;
  } else {
    verifiedOnWeb = false;
    webPenalty = 0;
    summaryText = `🔍 UNVERIFIED GENERAL COVERAGE: Live web search performed. Exercise standard critical evaluation.`;
  }

  return {
    verifiedOnWeb,
    isHighStakes,
    webPenalty,
    summaryText,
    reputableSourcesFound: reputableMatches.slice(0, 5),
    debunkArticlesFound: debunkMatches.slice(0, 5),
    allSearchResults: googleNewsResults.slice(0, 5)
  };
};

module.exports = { verifyClaimOnWeb };
