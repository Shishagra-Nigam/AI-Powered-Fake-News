const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes article title and main body text from a provided web URL.
 * @param {string} url - Target news article URL
 * @returns {Promise<{headline: string, text: string, domain: string}>}
 */
const scrapeArticle = async (url) => {
  try {
    // Validate URL structure
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      throw new Error('Invalid URL format. Please enter a complete web address (e.g., https://example.com/article).');
    }

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Remove clutter elements
    $('script, style, iframe, nav, footer, header, noscript, svg, button, form, .ad, .advertisement, .social-share').remove();

    // Extract headline
    let headline = $('h1').first().text().trim() || 
                   $('meta[property="og:title"]').attr('content') || 
                   $('meta[name="twitter:title"]').attr('content') || 
                   $('title').text().trim() || 
                   'Scraped Article';

    // Clean up headline
    headline = headline.replace(/\s+/g, ' ');

    // Extract main text content from paragraphs
    let paragraphs = [];
    
    // Prefer article-scoped paragraphs if present
    const articleContainer = $('article, main, .article-body, .entry-content, #content');
    const target = articleContainer.length > 0 ? articleContainer : $('body');

    target.find('p').each((i, el) => {
      const pText = $(el).text().trim();
      // Filter out trivial short paragraphs or cookie/copyright disclaimers
      if (pText.length > 35 && !/cookie|copyright|rights reserved|privacy policy|terms of service|subscribe/i.test(pText)) {
        paragraphs.push(pText);
      }
    });

    const bodyText = paragraphs.join('\n\n');

    if (!bodyText || bodyText.length < 100) {
      throw new Error('Could not extract sufficient article text from the URL. The site may be behind a paywalled script or blocking scraping.');
    }

    return {
      headline,
      text: bodyText,
      domain: parsedUrl.hostname.replace('www.', '')
    };
  } catch (error) {
    if (error.response) {
      throw new Error(`Failed to scrape URL (HTTP ${error.response.status}). The website may restrict automated access.`);
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Connection timed out while fetching article from the specified URL.');
    }
    throw error;
  }
};

module.exports = { scrapeArticle };
