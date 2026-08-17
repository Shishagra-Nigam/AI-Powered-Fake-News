import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await register({ username, email, password });
      } else {
        await login({ email, password });
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pitch/90 backdrop-blur-xl animate-fadeIn">
      <div className="bg-pitch border border-matrix-green/50 rounded-3xl max-w-md w-full p-6 shadow-neon-green relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-900 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-matrix-green/10 border border-matrix-green/40 text-matrix-green mx-auto flex items-center justify-center mb-3 shadow-neon-green">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-heading font-extrabold text-white">
            {isRegister ? 'Create VeritasAI Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isRegister ? 'Sign up to save analysis history to your personal profile' : 'Sign in to access your saved analysis history'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-matrix-crimson/10 border border-matrix-crimson/40 rounded-2xl text-matrix-crimson text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-matrix-green rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none transition shadow-inner"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-matrix-green rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none transition shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 focus:border-matrix-green rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none transition shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-matrix-green hover:bg-matrix-emerald text-pitch font-extrabold text-sm shadow-neon-green transition uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => { setIsRegister(false); setError(null); }}
                className="text-matrix-green font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account yet?{' '}
              <button
                onClick={() => { setIsRegister(true); setError(null); }}
                className="text-matrix-green font-bold hover:underline"
              >
                Create One
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
