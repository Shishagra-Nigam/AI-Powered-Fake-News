import React, { useState } from 'react';
import { ShieldCheck, History, LogIn, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, onOpenAuthModal }) {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-pitch/90 backdrop-blur-xl border-b border-matrix-green/30 shadow-[0_4px_30px_rgba(0,255,102,0.15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('analyzer')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-matrix-green via-matrix-emerald to-matrix-lime p-0.5 shadow-neon-green flex items-center justify-center animate-glow-pulse">
              <div className="w-full h-full bg-pitch rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-matrix-green" />
              </div>
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5 drop-shadow-[0_0_10px_rgba(0,255,102,0.6)]">
                Veritas<span className="text-matrix-green">AI</span>
              </span>
              <p className="text-[11px] text-slate-400 -mt-1 hidden sm:block font-medium">AI Misinformation & Fact Verification</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'analyzer'
                  ? 'bg-matrix-green/20 text-matrix-green border border-matrix-green/60 shadow-neon-green'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-matrix-green" />
              <span>Analyzer</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'history'
                  ? 'bg-matrix-green/20 text-matrix-green border border-matrix-green/60 shadow-neon-green'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <History className="w-4 h-4 text-matrix-green" />
              <span>History</span>
            </button>
          </nav>

          {/* Auth Button */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-pitch border border-matrix-green/40 hover:border-matrix-green text-xs font-bold text-slate-200 shadow-neon-green transition"
                >
                  <div className="w-6 h-6 rounded-full bg-matrix-green/20 text-matrix-green flex items-center justify-center text-xs font-bold border border-matrix-green/50">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.username}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-pitch border border-matrix-green/40 rounded-2xl shadow-2xl py-1.5 z-50 backdrop-blur-xl">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Signed in as</p>
                      <p className="text-xs font-bold text-white truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-matrix-crimson hover:bg-slate-900 text-left transition font-bold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center space-x-2 px-4.5 py-2 rounded-xl bg-matrix-green hover:bg-matrix-emerald text-pitch font-extrabold text-xs shadow-neon-green transition-all uppercase tracking-wider"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
