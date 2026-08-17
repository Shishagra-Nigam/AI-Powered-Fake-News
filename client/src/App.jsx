import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import DashboardPage from './pages/DashboardPage';
import AnalyzerPage from './pages/AnalyzerPage';
import HistoryPage from './pages/HistoryPage';
import LiveVerificationCard from './components/LiveVerificationCard';
import { AuthProvider } from './context/AuthContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-black text-slate-100 font-sans selection:bg-emerald-500/40 selection:text-emerald-400">
      {/* High-Tech Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Fluid Main Workspace Area */}
      <div className="flex-1 flex flex-col min-h-screen bg-black overflow-x-hidden">
        <main className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-6">
          {activeTab === 'dashboard' && <DashboardPage />}
          {activeTab === 'fact-check' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-xl font-heading font-extrabold text-white">Live Search & Web Fact Verification Engine</h2>
              <LiveVerificationCard webVerification={{ verifiedOnWeb: true, summaryText: "Live Google News RSS & DuckDuckGo query integration active." }} />
            </div>
          )}
          {activeTab === 'source-analysis' && <AnalyzerPage />}
          {activeTab === 'reports' && <HistoryPage />}
          {activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto p-6 glass-card rounded-3xl space-y-4">
              <h2 className="text-xl font-heading font-extrabold text-white">Engine Configuration & System Health</h2>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-black/80 rounded-xl border border-emerald-500/30 flex justify-between">
                  <span>Python Flask ML Microservice:</span>
                  <span className="text-emerald-400 font-bold">http://127.0.0.1:5001 (ACTIVE)</span>
                </div>
                <div className="p-3 bg-black/80 rounded-xl border border-emerald-500/30 flex justify-between">
                  <span>ML & Fact Check Engine Status:</span>
                  <span className="text-emerald-400 font-bold">Veritas ML Microservice (ACTIVE)</span>
                </div>
                <div className="p-3 bg-black/80 rounded-xl border border-emerald-500/30 flex justify-between">
                  <span>Live Web Search Engine:</span>
                  <span className="text-emerald-400 font-bold">Google News RSS / DuckDuckGo Engine (ACTIVE)</span>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Minimal Footer */}
        <footer className="border-t border-emerald-950/60 bg-black py-4 px-8 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>VeritasAI — AI Misinformation & Real-Time Fact Verification Engine</span>
          <span>Customer Dashboard View</span>
        </footer>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
