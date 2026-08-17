import React from 'react';
import { Cpu, Sparkles, Layers } from 'lucide-react';

export default function NeuralLLMCard({ dedicatedNeuralLLM = {} }) {
  const {
    neural_score = 50,
    neural_bias_intensity = 0,
    attention_flagged_tokens = [],
    layer_breakdown = {}
  } = dedicatedNeuralLLM;

  return (
    <div className="p-5 bg-pitch rounded-2xl border border-matrix-green/40 shadow-neon-green space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-matrix-green/10 border border-matrix-green/40 text-matrix-green flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
              Project Dedicated Neural LLM Transformer Engine
              <span className="text-[10px] px-2 py-0.5 rounded bg-matrix-green/20 text-matrix-green font-extrabold border border-matrix-green/50 shadow-neon-green">NATIVE MODEL</span>
            </h3>
            <p className="text-[11px] text-slate-400">Self-contained 4-Head Self-Attention Transformer running locally</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-extrabold text-matrix-green drop-shadow-[0_0_8px_rgba(0,255,102,0.6)]">Neural Score: {neural_score}/100</span>
        </div>
      </div>

      {/* Neural Attention Focus Tokens */}
      {attention_flagged_tokens.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-matrix-green flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-matrix-green" /> Neural Transformer Attention Focus Spans:
          </h4>
          <div className="flex flex-wrap gap-2">
            {attention_flagged_tokens.map((item, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl bg-matrix-green/15 border border-matrix-green/40 text-white text-xs font-semibold flex items-center gap-1.5 shadow-neon-green"
              >
                <span>"{item.token}"</span>
                <span className="text-[10px] bg-pitch px-1.5 py-0.5 rounded text-matrix-green font-mono font-bold border border-matrix-green/40">
                  {(item.attention_weight * 100).toFixed(1)}% attn
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Layer-by-Layer Neural Network Architecture Readout */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-matrix-green" /> Transformer Neural Execution Pipeline:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-pitch rounded-xl border border-slate-800 space-y-0.5">
            <span className="font-bold text-matrix-green text-[11px] block">L1: Token & Positional Encoding</span>
            <span className="text-slate-300 text-[11px]">{layer_breakdown.layer_1_embedding || '64-dim Dense Vectors'}</span>
          </div>
          <div className="p-2.5 bg-pitch rounded-xl border border-slate-800 space-y-0.5">
            <span className="font-bold text-matrix-emerald text-[11px] block">L2: Multi-Head Self-Attention</span>
            <span className="text-slate-300 text-[11px]">{layer_breakdown.layer_2_attention || '4-Head Scaled Dot-Product Attention'}</span>
          </div>
          <div className="p-2.5 bg-pitch rounded-xl border border-slate-800 space-y-0.5">
            <span className="font-bold text-matrix-lime text-[11px] block">L3: Feedforward GELU Network</span>
            <span className="text-slate-300 text-[11px]">{layer_breakdown.layer_3_ffn || '2-Layer GELU FFN'}</span>
          </div>
          <div className="p-2.5 bg-pitch rounded-xl border border-slate-800 space-y-0.5">
            <span className="font-bold text-matrix-amber text-[11px] block">L4: Neural Bias Intensity</span>
            <span className="text-slate-300 text-[11px]">Sensationalism Level: {neural_bias_intensity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
