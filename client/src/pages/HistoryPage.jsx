import React, { useState, useEffect } from 'react';
import { History, Search, Trash2, Calendar, ShieldCheck, AlertTriangle, AlertCircle, RefreshCw, X } from 'lucide-react';
import { getHistoryApi, deleteAnalysisApi } from '../services/api';
import TextHighlighter from '../components/TextHighlighter';
import ReasoningCard from '../components/ReasoningCard';
import WebFactCheckCard from '../components/WebFactCheckCard';
import NeuralLLMCard from '../components/NeuralLLMCard';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [classificationFilter, setClassificationFilter] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHistoryApi({
        search: search || undefined,
        classification: classificationFilter || undefined
      });
      setHistory(data.history || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load analysis history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [classificationFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis record?')) return;

    try {
      await deleteAnalysisApi(id);
      setHistory(history.filter(item => item._id !== id));
      if (selectedItem && selectedItem._id === id) {
        setSelectedItem(null);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete record.');
    }
  };

  const getBadge = (cls) => {
    switch (cls) {
      case 'reliable':
        return <span className="px-2.5 py-1 rounded-full bg-matrix-green/10 text-matrix-green border border-matrix-green/50 text-xs font-extrabold flex items-center gap-1 shadow-neon-green"><ShieldCheck className="w-3.5 h-3.5" /> Reliable</span>;
      case 'misleading':
        return <span className="px-2.5 py-1 rounded-full bg-matrix-crimson/10 text-matrix-crimson border border-matrix-crimson/50 text-xs font-extrabold flex items-center gap-1 shadow-neon-crimson"><AlertTriangle className="w-3.5 h-3.5" /> Misleading</span>;
      case 'satire':
        return <span className="px-2.5 py-1 rounded-full bg-matrix-lime/10 text-matrix-lime border border-matrix-lime/50 text-xs font-extrabold flex items-center gap-1 shadow-neon-lime"><AlertCircle className="w-3.5 h-3.5" /> Satire</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-matrix-amber/10 text-matrix-amber border border-matrix-amber/50 text-xs font-bold shadow-neon-amber">Unverified</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-white flex items-center gap-2 drop-shadow-[0_0_10px_rgba(0,255,102,0.4)]">
            <History className="w-6 h-6 text-matrix-green" /> Analysis History Repository
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Review past credibility evaluations and saved red-flag audits</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history..."
              className="bg-pitch border border-slate-800 focus:border-matrix-green rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition shadow-inner focus:shadow-neon-green"
            />
          </form>

          <select
            value={classificationFilter}
            onChange={(e) => setClassificationFilter(e.target.value)}
            className="bg-pitch border border-slate-800 focus:border-matrix-green rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none transition"
          >
            <option value="">All Classifications</option>
            <option value="reliable">Reliable Only</option>
            <option value="misleading">Misleading Only</option>
            <option value="satire">Satire Only</option>
            <option value="unverified">Unverified Only</option>
          </select>
        </div>
      </div>

      {/* History Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-matrix-green" />
          <p className="text-sm font-semibold">Loading historical analysis records...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="p-12 text-center bg-pitch/80 rounded-3xl border border-slate-800 space-y-3 shadow-inner">
          <History className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Analysis Records Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Submit a new news article on the Analyzer page to begin generating persistent credibility history.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((item) => (
            <div
              key={item._id}
              onClick={() => setSelectedItem(item)}
              className="p-5 bg-pitch hover:bg-slate-950 rounded-3xl border border-slate-800 hover:border-matrix-green/60 transition cursor-pointer space-y-3 shadow-lg relative group hover:shadow-neon-green"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug group-hover:text-matrix-green transition">
                  {item.headline || 'Untitled Article'}
                </h3>
                {getBadge(item.classification)}
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {item.reasoning?.summary || item.content}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-matrix-green">Score: {item.credibilityScore}/100</span>
                  <button
                    onClick={(e) => handleDelete(e, item._id)}
                    className="text-slate-500 hover:text-matrix-crimson transition p-1"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Record View Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pitch/90 backdrop-blur-xl animate-fadeIn">
          <div className="bg-pitch border border-matrix-green/50 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-neon-green relative space-y-6">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-900 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 border-b border-slate-800 pb-4 pr-8">
              <div className="flex items-center space-x-2">
                {getBadge(selectedItem.classification)}
                <span className="text-xs font-bold text-matrix-green">Score: {selectedItem.credibilityScore}/100</span>
              </div>
              <h2 className="text-xl font-heading font-bold text-white">{selectedItem.headline}</h2>
              <p className="text-xs text-slate-400">Analyzed on {new Date(selectedItem.createdAt).toLocaleString()}</p>
            </div>

            <ReasoningCard reasoning={selectedItem.reasoning} />

            {selectedItem.dedicatedNeuralLLM && (
              <NeuralLLMCard dedicatedNeuralLLM={selectedItem.dedicatedNeuralLLM} />
            )}

            {selectedItem.webVerification && (
              <WebFactCheckCard webVerification={selectedItem.webVerification} />
            )}

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Article Content Audit</h4>
              <TextHighlighter text={selectedItem.content} flaggedPhrases={selectedItem.flaggedPhrases} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
