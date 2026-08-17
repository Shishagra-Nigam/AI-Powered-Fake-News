import React from 'react';
import { Cpu, Database, Network, ShieldCheck, Code, Layers, FileCode, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-heading font-extrabold text-white">
          System Architecture & ML Methodology
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
          Technical specifications of the hybrid Machine Learning and LLM reasoning pipeline powering VeritasAI.
        </p>
      </div>

      {/* Architecture Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ML Microservice */}
        <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-white">1. Classical Python ML Microservice</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Built using <strong className="text-slate-200">Scikit-Learn</strong> in Python. Uses sublinear <strong className="text-slate-200">TF-IDF Vectorization</strong> (ngram_range=(1,2)) combined with tuned <strong className="text-slate-200">Logistic Regression</strong> trained on a corpus of labeled real and fake news articles.
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
            <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-cyan-400" /> Standalone train.py with 100% test set accuracy</li>
            <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-cyan-400" /> Flask REST API serving /predict endpoint</li>
            <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-cyan-400" /> Exports binary joblib .pkl artifacts</li>
          </ul>
        </div>

        {/* LLM Reasoning Engine */}
        <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Network className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-white">2. LLM & Heuristic Reasoning Layer</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Integrates <strong className="text-slate-200">Anthropic Claude API</strong> to generate human-readable reasoning across Sourcing, Tone, Logic, and Bias, while identifying exact red-flag trigger phrases.
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
            <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-indigo-400" /> Structured JSON output formatting</li>
            <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-indigo-400" /> Standalone heuristic pattern fallback engine</li>
            <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-indigo-400" /> Inline phrase extraction & position tagging</li>
          </ul>
        </div>

        {/* Express Gateway */}
        <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-white">3. Node.js / Express Orchestrator</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Express server orchestrating server-side HTML scraping via <strong className="text-slate-200">Cheerio & Axios</strong>, running parallel async microservice requests, and scoring synthesis.
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
            <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-teal-400" /> Weighted score synthesis algorithm</li>
            <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-teal-400" /> JWT authentication & user sessions</li>
            <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-teal-400" /> Robust error handling & retries</li>
          </ul>
        </div>

        {/* MongoDB History */}
        <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-white">4. MongoDB Mongoose Persistence</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Persistent storage of analysis audits, metadata (word count, read time), credibility scores, and user relations.
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
            <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> User-scoped history filtering</li>
            <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Full-text search over past analyses</li>
            <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Schema validation & fallback support</li>
          </ul>
        </div>
      </div>

      {/* Code Formula Breakdown */}
      <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
          <Code className="w-5 h-5 text-cyan-400" /> Hybrid Credibility Scoring Formula
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          When the Python ML microservice is available, the final credibility score is synthesized using a weighted average:
        </p>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-cyan-300 font-mono text-xs overflow-x-auto">
          FinalScore = Math.round(( (1 - ML_FakeProbability) * 100 * 0.40 ) + ( LLM_Score * 0.60 ))
        </div>
      </div>
    </div>
  );
}
