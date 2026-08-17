import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

export default function ScoreGauge({ score = 50, classification = 'unverified', mlConfidence = 0 }) {
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * (circumference * 0.75);

  const getTheme = () => {
    switch (classification) {
      case 'reliable':
        return {
          stroke: '#00ff66',
          text: 'text-matrix-green',
          bg: 'bg-matrix-green/10',
          border: 'border-matrix-green/50',
          glow: 'shadow-neon-green',
          icon: ShieldCheck,
          label: 'Reliable Source'
        };
      case 'misleading':
        return {
          stroke: '#ff0055',
          text: 'text-matrix-crimson',
          bg: 'bg-matrix-crimson/10',
          border: 'border-matrix-crimson/50',
          glow: 'shadow-neon-crimson',
          icon: AlertTriangle,
          label: 'High Risk / Misleading'
        };
      case 'satire':
        return {
          stroke: '#76ff03',
          text: 'text-matrix-lime',
          bg: 'bg-matrix-lime/10',
          border: 'border-matrix-lime/50',
          glow: 'shadow-neon-lime',
          icon: AlertCircle,
          label: 'Satire / Parody'
        };
      default:
        return {
          stroke: '#ffaa00',
          text: 'text-matrix-amber',
          bg: 'bg-matrix-amber/10',
          border: 'border-matrix-amber/50',
          glow: 'shadow-neon-amber',
          icon: HelpCircle,
          label: 'Unverified Claim'
        };
    }
  };

  const theme = getTheme();
  const IconComponent = theme.icon;

  return (
    <div className={`flex flex-col items-center justify-center p-6 bg-pitch rounded-3xl border ${theme.border} ${theme.glow} relative overflow-hidden transition-all duration-500`}>
      {/* Radial Neon Gradient Backdrop */}
      <div 
        className="absolute inset-0 opacity-20 blur-3xl pointer-events-none transition-all duration-700"
        style={{ backgroundColor: theme.stroke }}
      />

      <div className="relative flex items-center justify-center">
        {/* SVG Arc Gauge with Cyber Filter Glow */}
        <svg width={size} height={size} className="transform -rotate-135">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#052610"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeLinecap="round"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.stroke}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 10px ${theme.stroke})` }}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-heading font-extrabold text-4xl text-white tracking-tight drop-shadow-[0_0_12px_rgba(0,255,102,0.5)]">
            {score}
          </span>
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            / 100 SCORE
          </span>
        </div>
      </div>

      {/* Classification Badge */}
      <div className={`mt-2 flex items-center space-x-2 px-3.5 py-1.5 rounded-full border ${theme.bg} ${theme.border}`}>
        <IconComponent className={`w-4 h-4 ${theme.text}`} />
        <span className={`text-xs font-extrabold ${theme.text} uppercase tracking-wider`}>
          {theme.label}
        </span>
      </div>

      {mlConfidence > 0 && (
        <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-matrix-green shadow-neon-green animate-pulse" />
          <span>ML Confidence: <strong className="text-white font-bold">{mlConfidence.toFixed(1)}%</strong></span>
        </div>
      )}
    </div>
  );
}
