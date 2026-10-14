import React, { useState } from 'react';
import { X, Sparkles, User, Lock, Mail, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onLogin, initialMode = 'login' }) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [username, setUsername] = useState('Alex');
  const [email, setEmail] = useState('alex@builder.dev');
  const [password, setPassword] = useState('••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username || 'Builder');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-2xl border shadow-2xl p-6 sm:p-8"
        style={{
          backgroundColor: 'var(--bv-surface)',
          borderColor: 'var(--bv-line)',
          color: 'var(--bv-ink)'
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--bv-muted)] hover:text-[var(--bv-ink)] hover:bg-[var(--bv-surface-2)] transition"
        >
          <X className="size-5" />
        </button>

        {/* Brand Mark */}
        <div className="flex flex-col items-center text-center">
          <div className="size-12 rounded-2xl bg-[var(--bv-brand)] text-white grid place-items-center font-bold text-2xl shadow-lg shadow-[var(--bv-brand)]/20 mb-3">
            🌷
          </div>
          <span className="text-xs font-bold tracking-widest uppercase text-[var(--bv-brand)]">
            BuilderVerse
          </span>
          <h2 className="text-xl font-bold mt-1 text-[var(--bv-ink)]">
            {mode === 'login' ? 'Welcome back, Builder' : 'Become a Builder'}
          </h2>
          <p className="text-xs text-[var(--bv-muted)] mt-1 max-w-xs">
            {mode === 'login' 
              ? 'Pick up exactly where you left off. Your XP and streaks await.'
              : 'Create a free account and start building real portfolio projects in 10 minutes.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-semibold block mb-1.5 text-[var(--bv-ink-soft)]">
                Builder Handle / Name
              </label>
              <div className="relative">
                <User className="size-4 absolute left-3 top-2.5 text-[var(--bv-muted)]" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="e.g. dev_sarah"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] focus:outline-none focus:border-[var(--bv-brand)]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold block mb-1.5 text-[var(--bv-ink-soft)]">
              Email or Username
            </label>
            <div className="relative">
              <Mail className="size-4 absolute left-3 top-2.5 text-[var(--bv-muted)]" />
              <input
                type="text"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] focus:outline-none focus:border-[var(--bv-brand)]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[var(--bv-ink-soft)]">
                Password
              </label>
              {mode === 'login' && (
                <button type="button" className="text-[11px] text-[var(--bv-brand)] hover:underline">
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="size-4 absolute left-3 top-2.5 text-[var(--bv-muted)]" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] focus:outline-none focus:border-[var(--bv-brand)]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition shadow-md flex items-center justify-center gap-1.5 mt-2"
          >
            {mode === 'login' ? 'Log in' : 'Create Account'}
            <ArrowRight className="size-3.5" />
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-[var(--bv-muted)]">
          {mode === 'login' ? (
            <>
              New here?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-[var(--bv-brand)] font-bold hover:underline"
              >
                Become a Builder
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-[var(--bv-brand)] font-bold hover:underline"
              >
                Log in
              </button>
            </>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-[var(--bv-line)] text-center text-[10px] text-[var(--bv-muted)]">
          BuilderVerse · Learn. Think. Build. · Zero tracking, no ads
        </div>
      </div>
    </div>
  );
};
