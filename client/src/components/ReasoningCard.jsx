import React from 'react';
import { BookOpen, MessageSquare, Brain, Compass, CheckCircle2 } from 'lucide-react';

export default function ReasoningCard({ reasoning = {} }) {
  const categories = [
    {
      title: 'Sourcing & Attribution',
      icon: BookOpen,
      content: reasoning.sourcing || 'No specific sourcing defects identified.',
      color: 'border-matrix-green/40 text-matrix-green'
    },
    {
      title: 'Linguistic Tone & Style',
      icon: MessageSquare,
      content: reasoning.tone || 'Neutral reporting tone observed throughout.',
      color: 'border-matrix-emerald/40 text-matrix-emerald'
    },
    {
      title: 'Logical Coherence',
      icon: Brain,
      content: reasoning.logic || 'Logical arguments follow standard journalistic patterns.',
      color: 'border-matrix-lime/40 text-matrix-lime'
    },
    {
      title: 'Sensationalism & Bias',
      icon: Compass,
      content: reasoning.bias || 'Low overall ideological or clickbait bias.',
      color: 'border-matrix-green/40 text-matrix-green'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Executive Reasoning Summary */}
      <div className="p-5 bg-gradient-to-r from-pitch via-slate-950 to-pitch rounded-2xl border border-matrix-green/50 shadow-neon-green space-y-2">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-matrix-green flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-matrix-green" /> Executive Reasoning Summary
        </h3>
        <p className="text-sm text-slate-200 leading-relaxed font-sans">
          {reasoning.summary || 'Detailed credibility assessment completed.'}
        </p>
      </div>

      {/* 2x2 Grid for Categorical Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div key={idx} className={`p-4 bg-pitch rounded-2xl border ${cat.color} hover:brightness-125 transition`}>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-pitch border border-slate-800 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-matrix-green" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {cat.title}
                </h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {cat.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
