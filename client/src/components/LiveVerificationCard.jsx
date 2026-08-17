import React, { useState } from 'react';
import { Search, Globe, ShieldCheck, ShieldAlert, AlertTriangle, ExternalLink } from 'lucide-react';

export default function LiveVerificationCard({ webVerification = {} }) {
  const [searchTerm, setSearchTerm] = useState('');

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
    <div className="p-5 bg-pitch rounded-3xl border border-matrix-green/40 shadow-neon-green space-y-4">
      {/* Card Header & Search Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-matrix-green/10 border border-matrix-green/40 text-matrix-green flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-sm text-white">LIVE VERIFICATION</h3>
              <p className="text-[10px] text-slate-400 font-medium">Real-Time Search & Fact-Check Feed</p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
            {reputableSourcesFound.length + debunkArticlesFound.length} Feeds Active
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for news..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-matrix-green rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
          />
        </div>
      </div>

      {/* Verification Sources List (Source A, Source B, Source C style) */}
      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
        {debunkArticlesFound.length > 0 && (
          <div className="p-3 bg-pitch rounded-2xl border border-matrix-crimson/50 text-xs space-y-1 shadow-neon-crimson">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-white text-[11px] truncate max-w-[170px]">
                Source B: {debunkArticlesFound[0].source || 'Fact-Check Warning'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-matrix-amber/20 text-matrix-amber border border-matrix-amber/50 font-extrabold text-[10px] flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> CAUTION (Yellow Badge)
              </span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2">{debunkArticlesFound[0].title}</p>
          </div>
        )}

        {reputableSourcesFound.length > 0 ? (
          reputableSourcesFound.map((src, idx) => (
            <div key={idx} className="p-3 bg-pitch rounded-2xl border border-matrix-green/40 text-xs space-y-1 shadow-neon-green">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-matrix-green text-[11px] truncate max-w-[170px]">
                  Source {String.fromCharCode(65 + idx)}: {src.source}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-matrix-green/20 text-matrix-green border border-matrix-green/50 font-extrabold text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED (Green Badge)
                </span>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-1">{src.title}</p>
            </div>
          ))
        ) : (
          !isDebunked && (
            <div className="p-4 text-center bg-slate-950 rounded-2xl border border-slate-900 text-xs text-slate-400">
              No live mainstream news agency matches found for this query yet.
            </div>
          )
        )}

        {isDebunked && (
          <div className="p-3 bg-pitch rounded-2xl border border-matrix-crimson/60 text-xs space-y-1 shadow-neon-crimson">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-matrix-crimson text-[11px]">
                High-Stakes Hoax Alert
              </span>
              <span className="px-2 py-0.5 rounded-full bg-matrix-crimson/20 text-matrix-crimson border border-matrix-crimson/50 font-extrabold text-[10px] flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> UNVERIFIED / FALSE
              </span>
            </div>
            <p className="text-[11px] text-slate-300">No official source confirms this event.</p>
          </div>
        )}
      </div>
    </div>
  );
}
