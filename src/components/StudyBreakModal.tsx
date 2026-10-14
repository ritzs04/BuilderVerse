import React, { useState, useEffect } from 'react';
import { X, Heart, Sparkles, Coffee, Smile, Play, Pause } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
}

export const StudyBreakModal: React.FC<Props> = ({
  isOpen,
  onClose,
  reason = "You've been tackling this challenge with high energy! Time for a breath."
}) => {
  if (!isOpen) return null;

  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev > 1) return prev - 1;

        // Cycle through 4-7-8 breathing
        if (phase === 'Inhale') {
          setPhase('Hold');
          return 7;
        } else if (phase === 'Hold') {
          setPhase('Exhale');
          return 8;
        } else {
          setPhase('Inhale');
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-3xl border shadow-2xl p-6 sm:p-8 text-center"
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

        {/* Top Icon */}
        <div className="size-14 mx-auto rounded-3xl bg-[var(--bv-brand-soft)] grid place-items-center text-3xl shadow-xs mb-3">
          🍵
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bv-surface-2)] text-[var(--bv-brand)] text-xs font-bold mb-2">
          <Heart className="size-3.5 fill-[var(--bv-brand)]" />
          <span>Mindful Reset</span>
        </div>

        <h2 className="text-xl font-bold text-[var(--bv-ink)]">
          Take a 5-Minute Gentle Break
        </h2>

        <p className="text-xs text-[var(--bv-muted)] mt-1.5 leading-relaxed max-w-sm mx-auto">
          {reason}
        </p>

        {/* Breathing Sphere */}
        <div className="py-8 flex flex-col items-center justify-center">
          <div 
            className={`size-36 rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-1000 border-4 border-white dark:border-[var(--bv-line)] ${
              phase === 'Inhale' 
                ? 'scale-115 bg-gradient-to-tr from-pink-200 to-rose-300 dark:from-pink-900/40 dark:to-rose-800/40' 
                : phase === 'Hold'
                  ? 'scale-110 bg-gradient-to-tr from-rose-300 to-purple-300 dark:from-rose-900/40 dark:to-purple-900/40'
                  : 'scale-90 bg-gradient-to-tr from-purple-200 to-pink-200 dark:from-purple-900/40 dark:to-pink-900/40'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)]">
              {phase}
            </span>
            <span className="text-3xl font-extrabold text-[var(--bv-ink)] mt-1">
              {secondsLeft}s
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => setIsActive(!isActive)}
              className="text-xs font-semibold px-3 py-1 rounded-lg bg-[var(--bv-surface-2)] hover:bg-[var(--bv-line)] transition flex items-center gap-1 text-[var(--bv-ink-soft)]"
            >
              {isActive ? <Pause className="size-3" /> : <Play className="size-3" />}
              <span>{isActive ? 'Pause cycle' : 'Resume'}</span>
            </button>
          </div>
        </div>

        {/* Wisdom callout */}
        <div className="p-3.5 rounded-2xl bg-[var(--bv-surface-2)]/60 border border-[var(--bv-line)] text-xs text-[var(--bv-ink-soft)] leading-relaxed text-left space-y-1">
          <p className="font-semibold text-[var(--bv-brand)]">
            💡 The Subconscious Effect:
          </p>
          <p>
            When you step away from the screen to drink water or look out a window, your brain shifts into the "diffuse mode" of thinking — often delivering the "aha!" moment instantly.
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition shadow-sm flex items-center justify-center gap-1.5"
          >
            <Smile className="size-4" /> I Feel Refreshed, Let's Try Again!
          </button>
        </div>
      </div>
    </div>
  );
};
