import React, { useState } from 'react';
import { ShieldCheck, LayoutDashboard, Globe, Search, FileText, Settings, LogIn, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab, onOpenAuthModal }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Customer-facing clean navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fact-check', label: 'Fact Check', icon: Globe },
    { id: 'source-analysis', label: 'Source Analysis', icon: Search },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Sticky Header Bar */}
      <header className="lg:hidden sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-emerald-500/20 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => handleSelect('dashboard')}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 p-0.5 shadow-neon-green flex items-center justify-center">
            <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <span className="font-heading font-extrabold text-lg text-white">
            Veritas<span className="text-emerald-400">AI</span>
          </span>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:text-white transition"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-md animate-fadeIn"
        />
      )}

      {/* Main Sidebar Container */}
      <aside className={`
        fixed lg:sticky top-0 z-40 h-screen w-64 bg-black/95 backdrop-blur-2xl border-r border-emerald-500/20 flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-8">
          {/* Brand Header */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleSelect('dashboard')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 p-0.5 shadow-neon-green flex items-center justify-center animate-glow-pulse">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                Veritas<span className="text-emerald-400">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Misinformation Engine</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all duration-300 ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/50 shadow-neon-green transform translate-x-1'
                      : 'text-slate-400 hover:text-white hover:bg-emerald-950/30 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Auth Footer */}
        <div className="pt-4 border-t border-emerald-950/60">
          {user ? (
            <div className="p-3 bg-emerald-950/30 rounded-2xl border border-emerald-500/30 space-y-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/40">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 truncate">
                  <p className="text-xs font-bold text-white truncate">{user.username}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full py-1.5 px-3 rounded-xl bg-cyber-crimson/10 hover:bg-cyber-crimson/20 border border-cyber-crimson/40 text-cyber-crimson font-bold text-[11px] flex items-center justify-center space-x-1.5 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:brightness-110 text-black font-extrabold text-xs shadow-neon-green transition-all uppercase tracking-wider flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
