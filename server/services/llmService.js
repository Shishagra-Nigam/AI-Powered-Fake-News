const axios = require('axios');

/**
 * Advanced Rule-Based Heuristic Reasoning Engine used as fallback or default standalone engine.
 */
const runHeuristicReasoning = (text, headline = '') => {
  const combined = `${headline} ${text}`;
  const lower = combined.toLowerCase();

  let flaggedPhrases = [];
  let penalty = 0;

  // Patterns dictionary with category and reasoning explanations
  const rules = [
    {
      category: 'clickbait',
      regex: /\b(shocking|you won'?t believe|secret|miracle|big pharma|share this before|banned|doctors are furious|what they don'?t want you to know)\b/gi,
      reason: 'Classic clickbait or conspiratorial trigger phrase designed to provoke panic or viral sharing.'
    },
    {
      category: 'sensational',
      regex: /\b(destroy[s]? all|cures everything|instant(ly)?|overnight|100% effective|secret trick|unbelievable truth|leaked documents|mind control)\b/gi,
      reason: 'Sensationalist exaggeration making unverified absolute claims without extraordinary empirical proof.'
    },
    {
      category: 'unsourced',
      regex: /\b(anonymous sources|whistleblowers reveal|insiders expose|secret documents|some people say|rumors suggest|unnamed experts)\b/gi,
      reason: 'Vague or non-verifiable attribution lacking primary institutional documentation or named experts.'
    },
    {
      category: 'emotional',
      regex: /\b(terrified|furious|disaster|evil|corrupt|shocking leak|they are lying|wake up|sheeple)\b/gi,
      reason: 'Highly emotionally charged language intended to trigger outrage rather than convey neutral facts.'
    },
    {
      category: 'logical_fallacy',
      regex: /\b(alien mothership|weather control|microchip|time portal|backyard gardens illegal|5g tower|moon landing stage[d]?)\b/gi,
      reason: 'Unsubstantiated conspiratorial premise lacking scientific consensus or verified empirical backing.'
    }
  ];

  rules.forEach(rule => {
    let match;
    // Reset regex index
    rule.regex.lastIndex = 0;
    while ((match = rule.regex.exec(combined)) !== null) {
      const phrase = match[0];
      // Avoid duplicate exact phrase flagging
      if (!flaggedPhrases.some(f => f.phrase.toLowerCase() === phrase.toLowerCase())) {
        flaggedPhrases.push({
          phrase: phrase,
          category: rule.category,
          reason: rule.reason
        });
        penalty += 12;
      }
    }
  });

  // Calculate base score from penalties
  let score = Math.max(10, Math.min(98, 92 - penalty));

  // Determine overall classification based on score
  let classification = 'reliable';
  if (score < 45) {
    classification = 'misleading';
  } else if (score < 70) {
    classification = 'unverified';
  }

  // Check for satire clues
  if (/\b(onion|satire|parody|humor|spoof|borowitz)\b/i.test(combined)) {
    classification = 'satire';
  }

  // Construct categorical breakdown summaries
  let sourcingText = score >= 75 
    ? 'Article references structured context or domain facts.' 
    : 'Article relies heavily on unverified assertions, vague insiders, or non-attributable claims.';
    
  let toneText = flaggedPhrases.some(f => f.category === 'emotional' || f.category === 'clickbait')
    ? 'Sensationalist or manipulative tone with urgent calls to share.' 
    : 'Objective, neutral reporting tone without extreme exaggeration.';

  let logicText = flaggedPhrases.some(f => f.category === 'logical_fallacy')
    ? 'Contains significant logical leaps or conspiracy tropes.'
    : 'Logical structure is clear and internally coherent.';

  let biasText = flaggedPhrases.length > 2
    ? 'High sensationalist bias aimed at emotional engagement.'
    : 'Low to moderate bias with balanced reporting style.';

  let summaryText = classification === 'reliable'
    ? 'The article demonstrates objective language, reasonable attribution, and an absence of manipulative clickbait patterns.'
    : classification === 'misleading'
    ? 'High risk of misinformation. The text exhibits excessive emotional triggers, sensational claims, and a lack of verifiable primary sources.'
    : 'Proceed with caution. The text contains unverified assertions or sensational phrasing that require independent fact-checking.';

  return {
    score,
    classification,
    reasoning: {
      summary: summaryText,
      sourcing: sourcingText,
      tone: toneText,
      logic: logicText,
      bias: biasText
    },
    flaggedPhrases: flaggedPhrases.slice(0, 8)
  };
};

/**
 * Claude API Integration wrapper
 */
const analyzeWithClaude = async (text, headline, apiKey) => {
  const prompt = `You are an expert news credibility and fact-checking AI. Analyze the following news article text and headline.
  
Headline: "${headline || 'None'}"
Content: "${text.substring(0, 3000)}"

Return ONLY a raw JSON object with NO markdown formatting around it using this schema:
{
  "score": <number between 0 and 100 representing credibility score>,
  "classification": "<'reliable' | 'misleading' | 'satire' | 'unverified'>",
  "reasoning": {
    "summary": "<2-3 sentence overview of credibility>",
    "sourcing": "<assessment of sources and attribution>",
    "tone": "<assessment of linguistic tone>",
    "logic": "<assessment of logical coherence>",
    "bias": "<assessment of sensational or ideological bias>"
  },
  "flaggedPhrases": [
    {
      "phrase": "<exact phrase found in text>",
      "category": "<'emotional' | 'clickbait' | 'unsourced' | 'sensational' | 'bias' | 'logical_fallacy' | 'other'>",
      "reason": "<explanation why phrase is flagged>"
    }
  ]
}`;

  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    },
    {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      timeout: 15000
    }
  );

  const rawText = response.data.content[0].text.trim();
  const cleanedJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanedJson);
};

/**
 * Main LLM analysis orchestrator
 */
const analyzeTextWithLLM = async (text, headline = '') => {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (anthropicKey && anthropicKey.trim().length > 10) {
    try {
      console.log('[LLM SERVICE] Executing live Claude API analysis...');
      return await analyzeWithClaude(text, headline, anthropicKey);
    } catch (err) {
      console.warn(`[LLM SERVICE WARNING] Claude API call failed (${err.message}). Falling back to heuristic reasoning engine.`);
    }
  }

  // Default to intelligent heuristic reasoning engine if no key or on failure
  return runHeuristicReasoning(text, headline);
};

module.exports = { analyzeTextWithLLM, runHeuristicReasoning };
