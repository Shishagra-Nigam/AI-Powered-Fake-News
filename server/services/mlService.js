const axios = require('axios');

/**
 * Communicates with the Python Flask ML Microservice for predictions & Dedicated Neural LLM analysis.
 * @param {string} text - Article body content
 * @param {string} headline - Article headline
 * @returns {Promise<{classification: string, confidence: number, label: number, fakeProbability: number, available: boolean, dedicatedNeuralLLM: object}>}
 */
const predictWithML = async (text, headline = '') => {
  const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:5001';
  
  try {
    const response = await axios.post(`${mlServiceUrl}/predict`, {
      text,
      headline
    }, {
      timeout: 8000,
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data && response.data.status === 'success') {
      return {
        classification: response.data.classification,
        confidence: response.data.confidence_score,
        label: response.data.label,
        fakeProbability: response.data.fake_probability,
        reliableProbability: response.data.reliable_probability,
        dedicatedNeuralLLM: response.data.dedicated_neural_llm || null,
        available: true
      };
    }

    throw new Error('Unexpected response format from Python ML service.');
  } catch (error) {
    console.warn(`[ML SERVICE WARNING] ML Microservice unavailable at ${mlServiceUrl}: ${error.message}`);
    
    return {
      classification: 'unverified',
      confidence: 50,
      label: 0,
      fakeProbability: 0.5,
      reliableProbability: 0.5,
      dedicatedNeuralLLM: null,
      available: false
    };
  }
};

module.exports = { predictWithML };
