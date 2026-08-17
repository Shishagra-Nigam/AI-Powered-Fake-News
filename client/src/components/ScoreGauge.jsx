import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

export default function ScoreGauge({ score = 50, classification = 'unverified', mlConfidence = 0 }) {
  const size = 190;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * (circumference * 0.75);

  const getTheme = () => {
    switch (classification) {
      case 'reliable':
        return {
          stroke: '#00ff88',
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/40',
          glow: 'shadow-neon-green',
          icon: ShieldCheck,
          label: 'Reliable Source'
        };
      case 'misleading':
        return {
          stroke: '#ff0055',
          text: 'text-cyber-crimson',
          bg: 'bg-cyber-crimson/10',
          border: 'border-cyber-crimson/40',
          glow: 'shadow-neon-crimson',
          icon: AlertTriangle,
          label: 'High Risk / Misleading'
        };
      case 'satire':
        return {
          stroke: '#00e5ff',
          text: 'text-cyber-cyan',
          bg: 'bg-cyber-cyan/10',
          border: 'border-cyber-cyan/40',
          glow: 'shadow-neon-cyan',
          icon: AlertCircle,
          label: 'Satire / Parody'
        };
      default:
        return {
          stroke: '#ffb700',
          text: 'text-cyber-amber',
          bg: 'bg-cyber-amber/10',
          border: 'border-cyber-amber/40',
          glow: 'shadow-[0_0_20px_rgba(255,183,0,0.3)]',
          icon: HelpCircle,
          label: 'Unverified Claim'
        };
    }
  };

  const theme = getTheme();
  const IconComponent = theme.icon;

  return (
    <div className={`flex flex-col items-center justify-center p-6 glass-card rounded-3xl border ${theme.border} ${theme.glow} relative overflow-hidden transition-all duration-500`}>
      {/* Soft Radial Ambient Glow */}
      <div 
        className="absolute inset-0 opacity-15 blur-3xl pointer-events-none transition-all duration-700"
        style={{ backgroundColor: theme.stroke }}
      />

      <div className="relative flex items-center justify-center">
        {/* SVG Arc Gauge with drop-shadow filter */}
        <svg width={size} height={size} className="transform -rotate-135">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(0, 255, 136, 0.08)"
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

        {/* Center Score Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-heading font-extrabold text-4xl text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
            {score}
          </span>
          <span className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase mt-0.5">
            / 100 SCORE
          </span>
        </div>
      </div>

      {/* Classification Badge */}
      <div className={`mt-3 flex items-center space-x-2 px-4 py-1.5 rounded-full border ${theme.bg} ${theme.border} backdrop-blur-md`}>
        <IconComponent className={`w-4 h-4 ${theme.text}`} />
        <span className={`text-xs font-extrabold ${theme.text} uppercase tracking-wider`}>
          {theme.label}
        </span>
      </div>

      {mlConfidence > 0 && (
        <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-neon-green animate-pulse" />
          <span>ML Confidence: <strong className="text-white font-bold">{mlConfidence.toFixed(1)}%</strong></span>
        </div>
      )}
    </div>
  );
}
