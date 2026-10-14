import React, { useState } from 'react';
import { X, Sparkles, Heart } from 'lucide-react';

interface Props {
  level: string;
  onOpenGarden: () => void;
  onOpenAvatar: () => void;
}

const TIPS = [
  'Remember: You don’t have to know everything to begin building today. 🌷',
  'Stuck on a bug? An error is just a polite note from JavaScript pointing out what to check next! 🐛',
  'Consistency beats intensity every time. 15 minutes of coding today is a victory. ✨',
  'Decomposing big problems into tiny 2-line functions is how senior engineers work. 🧠'
];

export const MascotTip: React.FC<Props> = ({ level, onOpenGarden }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  if (isDismissed) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-8">
      <div 
        className="rounded-2xl border p-4 flex items-center justify-between gap-4 shadow-sm relative overflow-hidden"
        style={{
          backgroundColor: 'var(--bv-surface)',
          borderColor: 'var(--bv-line)'
        }}
      >
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-[var(--bv-brand-soft)] grid place-items-center text-xl shrink-0">
            🌱
          </div>
          <div className="text-xs">
            <span className="font-bold text-[var(--bv-brand)] flex items-center gap-1">
              Sprout the Builder Bot <span className="font-normal text-[var(--bv-muted)]">· friendly tip</span>
            </span>
            <p className="text-[var(--bv-ink-soft)] mt-0.5">
              {TIPS[tipIndex]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setTipIndex((tipIndex + 1) % TIPS.length)}
            className="text-[11px] text-[var(--bv-brand)] font-semibold hover:underline hidden sm:block"
          >
            Another tip ↻
          </button>
          <button
            onClick={onOpenGarden}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-[var(--bv-surface-2)] text-[var(--bv-ink-soft)] hover:text-[var(--bv-brand)] transition"
          >
            My Garden 🌸
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-lg text-[var(--bv-muted)] hover:text-[var(--bv-ink)]"
            title="Dismiss"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
