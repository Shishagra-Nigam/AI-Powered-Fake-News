import React, { useState } from 'react';
import { Sparkles, Link as LinkIcon, FileText, RefreshCw, AlertCircle, Shield, Globe, Cpu } from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';
import TextHighlighter from '../components/TextHighlighter';
import ReasoningCard from '../components/ReasoningCard';
import WebFactCheckCard from '../components/WebFactCheckCard';
import NeuralLLMCard from '../components/NeuralLLMCard';
import { analyzeArticleApi } from '../services/api';

export default function AnalyzerPage() {
  const [mode, setMode] = useState('text');
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const presets = [
    {
      label: '🚨 Fake Political Death Claim',
      type: 'hoax',
      text: `The Narendra Modi is dead and our new prime minister will be going to be yogi adityanath`
    },
    {
      label: '📰 Reliable NASA Space News',
      type: 'real',
      text: `NASA's James Webb Space Telescope Discovers Atmospheric Water Vapor on Remote Exoplanet. Researchers confirmed the presence of water vapor and carbon dioxide using transmission spectroscopy. The study, published in Nature astronomy journal, represents a major milestone in interstellar astrophysics.`
    },
    {
      label: '💊 Miracle Cure Clickbait',
      type: 'cure',
      text: `MIRACLE CURE: Common Kitchen Ingredient Destroys All Diseases Overnight! Big Pharma is terrified! Secret medical documents leaked by anonymous insiders prove drinking baking soda cures stage 4 cancer.`
    }
  ];

  const handlePresetSelect = (presetText) => {
    setMode('text');
    setInputText(presetText);
    setError(null);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError(null);

    if (mode === 'text' && (!inputText || inputText.trim().length < 15)) {
      setError('Please enter at least 15 characters of text.');
      return;
    }
    if (mode === 'url' && (!inputUrl || !inputUrl.startsWith('http'))) {
      setError('Please enter a valid HTTP/HTTPS web address.');
      return;
    }

    setLoading(true);
    setLoadingStep(mode === 'url' ? 'Scraping web page content...' : 'Preprocessing text & features...');

    try {
      setTimeout(() => {
        setLoadingStep('Running Project Native Neural LLM Transformer Engine (Self-Attention)...');
      }, 600);

      setTimeout(() => {
        setLoadingStep('Searching live Google News RSS & DuckDuckGo for web verification...');
      }, 1200);

      const payload = mode === 'url' ? { url: inputUrl } : { text: inputText };
      const response = await analyzeArticleApi(payload);

      if (response.success && response.analysis) {
        setAnalysisResult(response.analysis);
      } else {
        throw new Error('Analysis request failed.');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to complete article analysis.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-matrix-green/10 border border-matrix-green/40 text-matrix-green text-xs font-extrabold shadow-neon-green">
          <Globe className="w-3.5 h-3.5" />
          <span>Real-Time Web Verification & Dedicated Neural LLM System</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight drop-shadow-[0_0_15px_rgba(0,255,102,0.4)]">
          Analyze News Credibility & Misinformation
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Paste news content or an article URL below. Our native Neural LLM Transformer model and live web search engine evaluate factuality and red-flag phrases.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-pitch border border-matrix-green/40 rounded-3xl p-6 shadow-neon-green relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 mb-5 gap-3">
          <div className="flex space-x-2">
            <button
              onClick={() => setMode('text')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                mode === 'text'
                  ? 'bg-matrix-green/20 text-matrix-green border border-matrix-green/60 shadow-neon-green'
                  : 'text-slate-400 hover:bg-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Raw Text Input</span>
            </button>
            <button
              onClick={() => setMode('url')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                mode === 'url'
                  ? 'bg-matrix-green/20 text-matrix-green border border-matrix-green/60 shadow-neon-green'
                  : 'text-slate-400 hover:bg-slate-900'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>Article URL Scraper</span>
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-bold mr-1 text-[11px] uppercase tracking-wider">Quick Test:</span>
            {presets.map((p, i) => (
              <button
                key={i}
                onClick={() => handlePresetSelect(p.text)}
                className="px-2.5 py-1 rounded-xl bg-pitch hover:bg-slate-900 text-slate-300 transition text-[11px] font-semibold border border-slate-800 hover:border-matrix-green/50"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAnalyze} className="space-y-4">
          {mode === 'text' ? (
            <div>
              <textarea
                rows={6}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste news article headline and body text here..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-matrix-green rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none transition leading-relaxed font-sans shadow-inner focus:shadow-neon-green"
              />
            </div>
          ) : (
            <div>
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://example-news-site.com/article-path"
                className="w-full bg-slate-950 border border-slate-800 focus:border-matrix-green rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition font-sans shadow-inner focus:shadow-neon-green"
              />
            </div>
          )}

          {error && (
            <div className="p-4 bg-matrix-crimson/10 border border-matrix-crimson/40 rounded-2xl text-matrix-crimson text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 font-medium">
              {mode === 'text' ? `${inputText.length} characters` : 'Server-side HTML extraction active'}
            </span>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-matrix-green hover:bg-matrix-emerald text-pitch font-extrabold text-xs uppercase tracking-wider shadow-neon-green transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-pitch" />
                  <span>Evaluating Neural LLM...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-pitch" />
                  <span>Analyze Credibility</span>
                </>
              )}
            </button>
          </div>
        </form>

        {loading && (
          <div className="mt-4 p-4 bg-slate-950/90 rounded-2xl border border-matrix-green/50 flex items-center space-x-3 text-xs text-matrix-green animate-pulse shadow-neon-green">
            <RefreshCw className="w-4 h-4 animate-spin text-matrix-green flex-shrink-0" />
            <span className="font-bold">{loadingStep}</span>
          </div>
        )}
      </div>

      {/* Results Section */}
      {analysisResult && (
        <div className="space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-matrix-green" /> Analysis Results Dashboard
            </h2>
            <span className="text-xs text-slate-400 font-mono">ID: #{analysisResult.id.toString().slice(-6)}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Gauge & Categorical Reasoning */}
            <div className="space-y-6">
              <ScoreGauge
                score={analysisResult.credibilityScore}
                classification={analysisResult.classification}
                mlConfidence={analysisResult.mlConfidence}
              />
              <ReasoningCard reasoning={analysisResult.reasoning} />
            </div>

            {/* Right Column: Article Headline, Dedicated Neural LLM, Web Search Fact Check & Text Inspector */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-5 bg-pitch rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-matrix-green">Evaluated Headline</span>
                <h3 className="text-lg font-heading font-bold text-white leading-snug">
                  {analysisResult.headline}
                </h3>
                {analysisResult.sourceUrl && (
                  <p className="text-xs text-slate-400 truncate">
                    Source: <a href={analysisResult.sourceUrl} target="_blank" rel="noreferrer" className="text-matrix-green hover:underline">{analysisResult.sourceUrl}</a>
                  </p>
                )}
              </div>

              {/* Project Dedicated Neural LLM Transformer Engine Card */}
              {analysisResult.dedicatedNeuralLLM && (
                <NeuralLLMCard dedicatedNeuralLLM={analysisResult.dedicatedNeuralLLM} />
              )}

              {/* Real-Time Web Fact Verification Panel */}
              <WebFactCheckCard webVerification={analysisResult.webVerification} />

              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1">
                  Article Body & Interactive Red-Flag Inspector
                </h4>
                <TextHighlighter
                  text={analysisResult.content}
                  flaggedPhrases={analysisResult.flaggedPhrases}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
