import React, { useState } from 'react';
import { AlertCircle, Zap } from 'lucide-react';

export default function TextHighlighter({ text = '', flaggedPhrases = [] }) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  if (!text) {
    return <div className="text-slate-500 italic text-xs">No article text available for evaluation.</div>;
  }

  if (!flaggedPhrases || flaggedPhrases.length === 0) {
    return (
      <div className="p-5 bg-pitch rounded-2xl border border-matrix-green/30 text-slate-200 leading-relaxed whitespace-pre-wrap font-sans text-sm shadow-inner">
        {text}
      </div>
    );
  }

  const renderHighlightedText = () => {
    const sortedFlags = [...flaggedPhrases].sort((a, b) => b.phrase.length - a.phrase.length);
    const escapedPhrases = sortedFlags.map(f => f.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (escapedPhrases.length === 0) return text;

    const regex = new RegExp(`(${escapedPhrases.join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const matchFlag = sortedFlags.find(f => f.phrase.toLowerCase() === part.toLowerCase());
      if (matchFlag) {
        const categoryClass = `highlight-${matchFlag.category || 'other'}`;
        const isSelected = activeTooltip && activeTooltip.phrase === matchFlag.phrase;

        return (
          <span key={index} className="relative inline-block group">
            <mark
              onClick={() => setActiveTooltip(isSelected ? null : matchFlag)}
              onMouseEnter={() => setActiveTooltip(matchFlag)}
              className={`${categoryClass} font-semibold cursor-pointer`}
            >
              {part}
            </mark>
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-4">
      {/* Category Filter Legend */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mr-1 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-matrix-green" /> Matrix Green Inspection Tags:
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-matrix-crimson/20 text-matrix-crimson border border-matrix-crimson/50 font-extrabold text-[10px]">Emotional Trigger</span>
        <span className="px-2.5 py-0.5 rounded-full bg-matrix-amber/20 text-matrix-amber border border-matrix-amber/50 font-extrabold text-[10px]">Clickbait Trigger</span>
        <span className="px-2.5 py-0.5 rounded-full bg-matrix-lime/20 text-matrix-lime border border-matrix-lime/50 font-extrabold text-[10px]">Unsourced Claim</span>
        <span className="px-2.5 py-0.5 rounded-full bg-matrix-green/20 text-matrix-green border border-matrix-green/50 font-extrabold text-[10px]">Sensationalism</span>
      </div>

      {/* Main Text Content */}
      <div className="p-5 bg-pitch rounded-2xl border border-matrix-green/30 text-slate-200 leading-relaxed text-sm whitespace-pre-wrap relative font-sans shadow-inner">
        {renderHighlightedText()}
      </div>

      {/* Active Tooltip Popover */}
      {activeTooltip && (
        <div className="p-4 bg-pitch rounded-2xl border border-matrix-amber/70 shadow-neon-amber flex items-start space-x-3 transition-all animate-fadeIn backdrop-blur-xl">
          <AlertCircle className="w-5 h-5 text-matrix-amber flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-white text-sm">
                Flagged Trigger: <span className="text-matrix-amber">"{activeTooltip.phrase}"</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-matrix-amber font-bold uppercase text-[10px] border border-matrix-amber/40">
                {activeTooltip.category}
              </span>
            </div>
            <p className="mt-1 text-slate-300 leading-normal">{activeTooltip.reason}</p>
          </div>
          <button 
            onClick={() => setActiveTooltip(null)} 
            className="text-slate-500 hover:text-white text-xs px-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
