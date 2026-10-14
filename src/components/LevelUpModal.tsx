import React from 'react';
import { Trophy, Sparkles, ArrowRight, X, Award } from 'lucide-react';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  oldXp: number;
  newXp: number;
  oldTitle: string;
  newTitle: string;
  onOpenCard: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  onClose,
  oldXp,
  newXp,
  oldTitle,
  newTitle,
  onOpenCard,
}) => {
  if (!isOpen) return null;

  const xpGained = newXp - oldXp;

  // Generate 20 confetti pieces with staggered positions and delays
  const confettiPieces = Array.from({ length: 20 }).map((_, i) => {
    const left = `${(i * 5) + (i % 3 * 2)}%`;
    const animationDelay = `${(i * 0.12) % 1.5}s`;
    const animationDuration = `${1.8 + (i % 5) * 0.3}s`;
    const colorClass = [
      'bg-rose-500',
      'bg-pink-400',
      'bg-amber-400',
      'bg-purple-400',
      'bg-emerald-400',
      'bg-[var(--bv-brand)]',
      'bg-[var(--bv-gold)]'
    ][i % 7];

    return (
      <div
        key={i}
        className={`confetti-piece ${colorClass}`}
        style={{
          left,
          animationDelay,
          animationDuration,
        }}
      />
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md rounded-3xl border p-8 text-center shadow-2xl overflow-hidden transition-all transform animate-scale-up"
        style={{
          backgroundColor: 'var(--bv-surface)',
          borderColor: 'var(--bv-line-strong)',
        }}
      >
        {/* CSS Confetti Container */}
        <div className="confetti-container">
          {confettiPieces}
        </div>

        {/* Background glow effects */}
        <div className="absolute -top-16 -right-16 size-40 rounded-full bg-[var(--bv-brand)] opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 size-40 rounded-full bg-[var(--bv-gold)] opacity-20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[var(--bv-muted)] hover:text-[var(--bv-ink)] hover:bg-[var(--bv-surface-2)] transition"
        >
          <X className="size-5" />
        </button>

        {/* Celebration Icon */}
        <div className="relative mx-auto size-20 rounded-2xl bg-gradient-to-br from-[var(--bv-brand-soft)] to-[var(--bv-surface-2)] border-2 border-[var(--bv-brand)] flex items-center justify-center text-4xl shadow-lg mb-6 animate-bounce">
          🎉
        </div>

        {/* Badge & Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bv-brand-soft)] text-[var(--bv-brand)] text-xs font-bold mb-3 shadow-sm">
          <Sparkles className="size-3.5" />
          <span>Milestone Unlocked</span>
        </div>

        <h2 className="text-3xl font-extrabold text-[var(--bv-ink)] tracking-tight mb-2">
          Level Up!
        </h2>

        <p className="text-xs sm:text-sm text-[var(--bv-muted)] mb-6 leading-relaxed">
          Amazing consistency! You earned <span className="font-bold text-[var(--bv-brand)]">+{xpGained} XP</span> and graduated to a prestigious new builder rank.
        </p>

        {/* Title Transition Box */}
        <div 
          className="rounded-2xl border p-4 mb-6 flex items-center justify-between gap-3 shadow-inner"
          style={{
            backgroundColor: 'var(--bv-surface-2)',
            borderColor: 'var(--bv-line)',
          }}
        >
          <div className="text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--bv-muted)] block">Previous Rank</span>
            <span className="text-xs sm:text-sm font-semibold text-[var(--bv-ink-soft)]">{oldTitle}</span>
          </div>

          <div className="size-8 rounded-full bg-[var(--bv-brand)] text-white flex items-center justify-center shrink-0 shadow-md">
            <ArrowRight className="size-4" />
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--bv-brand)] block">New Rank</span>
            <span className="text-xs sm:text-sm font-extrabold text-[var(--bv-ink)]">{newTitle}</span>
          </div>
        </div>

        {/* Total XP stat */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-[var(--bv-ink)] mb-8">
          <Trophy className="size-4 text-[var(--bv-gold)]" />
          <span>Total Builder XP: {newXp} PTS</span>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => {
              onClose();
              onOpenCard();
            }}
            className="w-full py-3.5 rounded-2xl bg-[var(--bv-brand)] text-white font-bold text-sm shadow-lg hover:bg-[var(--bv-brand-strong)] transition flex items-center justify-center gap-2"
          >
            <Award className="size-4" />
            <span>View Updated Builder Card</span>
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-sm font-bold text-[var(--bv-ink)] hover:border-[var(--bv-brand)] transition"
          >
            Continue Learning 🌷
          </button>
        </div>
      </div>
    </div>
  );
};
