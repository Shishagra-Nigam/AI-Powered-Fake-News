import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import AnalyzerPage from './pages/AnalyzerPage';
import HistoryPage from './pages/HistoryPage';
import { AuthProvider } from './context/AuthContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-black text-slate-100 font-sans selection:bg-matrix-green/30 selection:text-matrix-green">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 bg-black">
        {activeTab === 'analyzer' && <AnalyzerPage />}
        {activeTab === 'history' && <HistoryPage />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-black py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>VeritasAI — AI Misinformation & News Detector</span>
          <span>Real-Time Web Fact Checking & Analysis</span>
        </div>
      </footer>

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
