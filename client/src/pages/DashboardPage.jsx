import React, { useState } from 'react';
import { Sparkles, FileText, RefreshCw, Award, CheckCircle2 } from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';
import TextHighlighter from '../components/TextHighlighter';
import LiveVerificationCard from '../components/LiveVerificationCard';
import ReasoningCard from '../components/ReasoningCard';
import { analyzeArticleApi } from '../services/api';

export default function DashboardPage() {
  const [inputText, setInputText] = useState(
    `NASA James Webb Space Telescope Discovers Atmospheric Water Vapor on Remote Exoplanet. Researchers confirmed the presence of water vapor and carbon dioxide using transmission spectroscopy. The study, published in Nature astronomy journal, represents a major milestone in interstellar astrophysics.`
  );
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState({
    id: 'demo_85',
    headline: "NASA James Webb Space Telescope Discovers Atmospheric Water Vapor on Remote Exoplanet",
    content: `NASA James Webb Space Telescope Discovers Atmospheric Water Vapor on Remote Exoplanet. Researchers confirmed the presence of water vapor and carbon dioxide using transmission spectroscopy. The study, published in Nature astronomy journal, represents a major milestone in interstellar astrophysics.`,
    credibilityScore: 85,
    classification: 'reliable',
    mlConfidence: 99.26,
    webVerification: {
      verifiedOnWeb: true,
      summaryText: 'Confirmed by Nature Journal and NASA News releases.',
      reputableSourcesFound: [
        { source: 'Nature Astronomy', title: 'Transmission Spectroscopy of Water Vapor' },
        { source: 'NASA Press Release', title: 'Webb Telescope Exoplanet Water Discovery' }
      ],
      debunkArticlesFound: [],
      allSearchResults: []
    },
    flaggedPhrases: [
      { phrase: 'unsubstantiated claims', category: 'unsourced', reason: 'Unverified assertion requiring primary source proof' },
      { phrase: 'highly biased report', category: 'emotional', reason: 'Ideological language pattern flagged' }
    ],
    reasoning: {
      summary: 'High credibility verification with mainstream scientific press cross-confirmation.',
      sourcing: 'Direct peer-reviewed publication attribution.',
      tone: 'Objective scientific reporting tone.',
      logic: 'Logical coherence confirmed.',
      bias: 'Low subjective bias.'
    }
  });

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!inputText || inputText.trim().length < 15) return;

    setLoading(true);
    try {
      const response = await analyzeArticleApi({ text: inputText });
      if (response.success && response.analysis) {
        setAnalysisResult(response.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header & Search Banner */}
      <div className="glass-card rounded-3xl p-6 relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold shadow-neon-green mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VeritasAI Misinformation Detection Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
              Real-Time <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Credibility & Fact Verification</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Paste any news article headline or claim below to evaluate factuality against live search and automated red-flag auditing.
            </p>
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste news headline or claim text here..."
              className="w-full bg-black/80 border border-emerald-500/30 focus:border-emerald-400 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner focus:shadow-neon-green"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:brightness-110 text-black font-extrabold text-xs shadow-neon-green transition-all uppercase tracking-wider flex items-center justify-center space-x-2 flex-shrink-0"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin text-black" /> : <Sparkles className="w-4 h-4 text-black" />}
            <span>Analyze Article</span>
          </button>
        </form>
      </div>

      {/* TOP ROW GRID (Score Gauge + Live Verification + Featured Analysis) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column 1: CREDIBILITY GAUGE */}
        <div className="space-y-4">
          <ScoreGauge
            score={analysisResult.credibilityScore}
            classification={analysisResult.classification}
            mlConfidence={analysisResult.mlConfidence}
          />
        </div>

        {/* Column 2: LIVE VERIFICATION */}
        <div>
          <LiveVerificationCard webVerification={analysisResult.webVerification} />
        </div>

        {/* Column 3: FEATURED ANALYSIS & RED-FLAG INSPECTOR */}
        <div className="glass-card rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-950/60 pb-2.5">
            <h3 className="font-heading font-extrabold text-sm text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-400" /> FEATURED ANALYSIS
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Red-Flag Inspection</span>
          </div>

          <TextHighlighter text={analysisResult.content} flaggedPhrases={analysisResult.flaggedPhrases} />

          <div className="pt-2 border-t border-emerald-950/60 flex items-center justify-between text-[10px]">
            <span className="text-cyber-crimson font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyber-crimson animate-pulse" /> Flagged Phrases Highlighted
            </span>
            <span className="text-slate-500 font-mono">Live Highlight Active</span>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW GRID (Categorical Reasoning + Portfolio Showcase) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Executive Reasoning Breakdown (Spans 2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <ReasoningCard reasoning={analysisResult.reasoning} />
        </div>

        {/* Right Column: PORTFOLIO SHOWCASE & AUDIT CARDS */}
        <div className="glass-card rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3">
            <h3 className="font-heading font-extrabold text-sm text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400" /> PORTFOLIO SHOWCASE
            </h3>
            <span className="text-[10px] text-emerald-400 font-extrabold uppercase">Audited Projects</span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-black/60 rounded-2xl border border-emerald-500/30 space-y-1.5 hover:border-emerald-400/60 transition">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-white">Project: Global Climate Analysis</span>
                <span className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified (Green Check)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                Evaluated IPCC report summaries against peer-reviewed atmospheric data feeds.
              </p>
            </div>

            <div className="p-3.5 bg-black/60 rounded-2xl border border-emerald-500/30 space-y-1.5 hover:border-emerald-400/60 transition">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-white">Project: Tech News & Exoplanet Discovery</span>
                <span className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified (Green Check)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                Cross-referenced Nature Astronomy publications and NASA Press releases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
