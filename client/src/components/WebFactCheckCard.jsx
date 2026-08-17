import React from 'react';
import { Globe, ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, FileQuestion } from 'lucide-react';

export default function WebFactCheckCard({ webVerification = {} }) {
  const {
    verifiedOnWeb = false,
    isHighStakes = false,
    summaryText = '',
    reputableSourcesFound = [],
    debunkArticlesFound = [],
    allSearchResults = []
  } = webVerification;

  const isDebunked = debunkArticlesFound.length > 0 || (isHighStakes && !verifiedOnWeb);

  return (
    <div className="p-5 bg-pitch rounded-2xl border border-matrix-green/40 shadow-neon-green space-y-4">
      {/* Header & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-matrix-green/10 border border-matrix-green/40 text-matrix-green flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              Real-Time Web Search & Fact Verification
            </h3>
            <p className="text-[11px] text-slate-400">Live search audit across global news wires & fact-checking registries</p>
          </div>
        </div>

        <div>
          {isDebunked ? (
            <span className="px-3.5 py-1 rounded-full bg-matrix-crimson/10 text-matrix-crimson border border-matrix-crimson/50 text-xs font-extrabold flex items-center gap-1.5 shadow-neon-crimson animate-pulse">
              <ShieldAlert className="w-4 h-4" /> ❌ False Claim / Unverified Hoax
            </span>
          ) : verifiedOnWeb ? (
            <span className="px-3.5 py-1 rounded-full bg-matrix-green/10 text-matrix-green border border-matrix-green/50 text-xs font-extrabold flex items-center gap-1.5 shadow-neon-green">
              <ShieldCheck className="w-4 h-4" /> ✅ Verified on Mainstream News
            </span>
          ) : (
            <span className="px-3.5 py-1 rounded-full bg-matrix-amber/10 text-matrix-amber border border-matrix-amber/50 text-xs font-bold flex items-center gap-1.5 shadow-neon-amber">
              <FileQuestion className="w-4 h-4" /> 🔍 Unverified Coverage
            </span>
          )}
        </div>
      </div>

      {/* Verification Summary Box */}
      <div className={`p-4 rounded-2xl border text-xs leading-relaxed font-sans ${
        isDebunked 
          ? 'bg-matrix-crimson/10 border-matrix-crimson/40 text-rose-200' 
          : verifiedOnWeb 
          ? 'bg-matrix-green/10 border-matrix-green/40 text-emerald-200' 
          : 'bg-pitch border-slate-800 text-slate-300'
      }`}>
        <p className="font-semibold">{summaryText || 'Live web search audit completed.'}</p>
      </div>

      {/* Debunk / Warning Clues List */}
      {debunkArticlesFound.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-matrix-crimson flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Fact-Check & Debunk Warnings Found:
          </h4>
          <div className="space-y-2">
            {debunkArticlesFound.map((item, idx) => (
              <div key={idx} className="p-3 bg-pitch rounded-xl border border-matrix-crimson/40 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white line-clamp-1">{item.title}</span>
                  <span className="text-[10px] text-matrix-crimson font-extrabold uppercase">{item.source}</span>
                </div>
                {item.snippet && <p className="text-slate-400 text-[11px] line-clamp-2">{item.snippet}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verified Sources List */}
      {reputableSourcesFound.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-matrix-green flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed Coverage From Reputable Outlets:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {reputableSourcesFound.map((item, idx) => (
              <div key={idx} className="p-2.5 bg-pitch rounded-xl border border-matrix-green/40 text-xs space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-matrix-green truncate max-w-[140px]">{item.source}</span>
                  <span className="text-[10px] text-slate-500">{item.pubDate ? new Date(item.pubDate).toLocaleDateString() : ''}</span>
                </div>
                <p className="text-slate-300 text-[11px] line-clamp-1 font-medium">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Web Search Headlines */}
      {reputableSourcesFound.length === 0 && debunkArticlesFound.length === 0 && allSearchResults.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Live Web Search Headlines Found:
          </h4>
          <div className="space-y-1.5">
            {allSearchResults.map((item, idx) => (
              <div key={idx} className="p-2.5 bg-pitch rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                <span className="text-slate-300 truncate max-w-[320px]">{item.title}</span>
                <span className="text-[10px] font-semibold text-matrix-green bg-slate-900 px-2 py-0.5 rounded">{item.source}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
