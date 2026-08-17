import React, { useState } from 'react';
import { Cpu, Activity, Layers, Sparkles } from 'lucide-react';

export default function NeuralAttentionHeatmap({ attentionTokens = [] }) {
  const [selectedCell, setSelectedCell] = useState(null);

  // Generate 8x8 Matrix Heatmap for Transformer Attention
  const matrixSize = 8;
  const sampleWords = ['<CLS>', 'narendra', 'modi', 'dead', 'prime', 'minister', 'yogi', '<SEP>'];

  // Calculate synthetic Q * K^T attention weights for visual presentation
  const generateAttentionGrid = () => {
    const grid = [];
    for (let r = 0; r < matrixSize; r++) {
      const row = [];
      for (let c = 0; c < matrixSize; c++) {
        let weight = (Math.sin(r * 1.5 + c * 2.2) + 1) / 2;
        if (r === c) weight = 0.95; // High self-attention along diagonal
        if ((r === 3 || c === 3) && (r === 1 || c === 1)) weight = 0.88; // High attention between 'modi' and 'dead'
        row.push(weight);
      }
      grid.push(row);
    }
    return grid;
  };

  const attentionGrid = generateAttentionGrid();

  return (
    <div className="p-5 bg-pitch rounded-3xl border border-matrix-green/40 shadow-neon-green space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-matrix-green/10 border border-matrix-green/40 text-matrix-green flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-sm text-white flex items-center gap-2">
              NEURAL NETWORK INSIGHTS
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">Transformer Self-Attention Layer Visualization</p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded bg-matrix-green/20 text-matrix-green font-extrabold border border-matrix-green/50 shadow-neon-green uppercase">
          4-Head Self-Attention
        </span>
      </div>

      {/* 3 Visual Heatmap Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Panel 1: Attention Matrix Heatmap */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-matrix-green/30 space-y-3">
          <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-matrix-green flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> Attention Head 1: Contextual Weights
          </h4>
          
          <div className="grid grid-cols-8 gap-1 p-2 bg-pitch rounded-xl border border-slate-900">
            {attentionGrid.map((row, rIdx) =>
              row.map((val, cIdx) => {
                const intensity = Math.round(val * 255);
                const bgStyle = {
                  backgroundColor: `rgba(0, 255, 102, ${val * 0.85})`,
                  boxShadow: val > 0.6 ? '0 0 6px rgba(0,255,102,0.6)' : 'none'
                };
                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    onMouseEnter={() => setSelectedCell({ row: sampleWords[rIdx], col: sampleWords[cIdx], val })}
                    className="w-full aspect-square rounded-[3px] transition cursor-pointer hover:scale-125 hover:z-10"
                    style={bgStyle}
                    title={`${sampleWords[rIdx]} -> ${sampleWords[cIdx]}: ${(val * 100).toFixed(1)}%`}
                  />
                );
              })
            )}
          </div>

          <div className="text-[10px] text-slate-400 font-mono text-center">
            {selectedCell ? `${selectedCell.row} ➔ ${selectedCell.col}: ${(selectedCell.val * 100).toFixed(1)}%` : 'Hover matrix cell for attention weights'}
          </div>
        </div>

        {/* Panel 2: Layer 2 Pattern Recognizer */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-matrix-green/30 space-y-3">
          <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-matrix-emerald flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Layer 2: Pattern Recognizer
          </h4>

          <div className="h-32 bg-pitch rounded-xl border border-slate-900 p-3 flex items-center justify-center relative overflow-hidden">
            {/* Visual Node Activation Network Graph */}
            <svg className="w-full h-full">
              <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="#00ff66" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="20%" y1="70%" x2="50%" y2="50%" stroke="#00ff66" strokeWidth="1.5" />
              <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="#ff0055" strokeWidth="2" />
              <line x1="50%" y1="50%" x2="80%" y2="70%" stroke="#00ff66" strokeWidth="1.5" />

              <circle cx="20%" cy="30%" r="7" fill="#00ff66" className="animate-pulse" />
              <circle cx="20%" cy="70%" r="7" fill="#00ff66" />
              <circle cx="50%" cy="50%" r="10" fill="#00ff9d" className="animate-glow-pulse" />
              <circle cx="80%" cy="30%" r="8" fill="#ff0055" />
              <circle cx="80%" cy="70%" r="7" fill="#00ff66" />
            </svg>
          </div>

          <div className="text-[10px] text-slate-400 font-mono text-center">
            Multi-Layer GELU Hidden Projection Nodes
          </div>
        </div>

        {/* Panel 3: Model 3 Language Model */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-matrix-green/30 space-y-3">
          <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-matrix-lime flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Model 3: Language Model
          </h4>

          <div className="h-32 bg-pitch rounded-xl border border-slate-900 p-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-300">Self-Attention Entropy:</span>
                <span className="text-matrix-green font-bold">1.42 nats</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-matrix-green w-[75%] rounded-full shadow-neon-green" />
              </div>

              <div className="flex justify-between text-[10px] pt-1">
                <span className="text-slate-300">Context Representation:</span>
                <span className="text-matrix-lime font-bold">64-dim Dense</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-matrix-lime w-[88%] rounded-full shadow-neon-lime" />
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-mono text-center pt-1 border-t border-slate-900">
              Output Logits: [Reliable: 0.05, Fake: 0.95]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
