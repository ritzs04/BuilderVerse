import React, { useState } from 'react';
import { X, Sparkles, Heart, Sun, Droplets, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userXp: number;
  completedLessonsCount: number;
  completedProjectsCount: number;
  thinkingSolvedCount: number;
}

export const LearningGardenModal: React.FC<Props> = ({
  isOpen,
  onClose,
  userXp,
  completedLessonsCount,
  completedProjectsCount,
  thinkingSolvedCount
}) => {
  if (!isOpen) return null;

  const [wateredCount, setWateredCount] = useState(0);
  const [wateringMsg, setWateringMsg] = useState('');

  // Calculate Garden Stage (1 to 5)
  let stage = 1;
  let stageName = 'Planted Seeds';
  let stageEmoji = '🌱';
  let stageDescription = 'Your learning seeds are planted in warm, welcoming soil.';

  if (userXp >= 250 || completedProjectsCount >= 1) {
    stage = 5;
    stageName = 'Flourishing Sanctuary';
    stageEmoji = '🌳🌸🦋';
    stageDescription = 'A thriving garden of real capabilities, blooming with projects and logical thinking.';
  } else if (userXp >= 150) {
    stage = 4;
    stageName = 'Rose Garden in Bloom';
    stageEmoji = '🌷🌸🌺';
    stageDescription = 'Your continuous practice has blossomed into beautiful, recognizable coding skills.';
  } else if (userXp >= 80) {
    stage = 3;
    stageName = 'Budding Rosebuds';
    stageEmoji = '🌷🌿';
    stageDescription = 'Buds are forming as you solve puzzles and connect concepts together.';
  } else if (userXp >= 40) {
    stage = 2;
    stageName = 'Green Sprouts';
    stageEmoji = '🌿🌱';
    stageDescription = 'Curiosity is sprouting! Each lesson watered your understanding.';
  }

  const handleWater = () => {
    setWateredCount(prev => prev + 1);
    const messages = [
      'Gently watered! You are making quiet, steady progress. 💧',
      'The soil is rich with curiosity today. Keep growing! 🌸',
      'Look at that growth! Consistency is what builds confidence. 🌷'
    ];
    setWateringMsg(messages[wateredCount % messages.length]);
    setTimeout(() => setWateringMsg(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl rounded-3xl border shadow-2xl p-6 sm:p-8"
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

        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)]">
            <Sparkles className="size-3.5" /> My Learning Garden
          </div>
          <h2 className="text-xl font-bold text-[var(--bv-ink)] mt-0.5">
            Your Knowledge in Bloom
          </h2>
          <p className="text-xs text-[var(--bv-muted)] max-w-sm mx-auto mt-1">
            Every lesson completed, puzzle solved, and bug fixed helps your personal garden grow.
          </p>
        </div>

        {/* Visual Garden Canvas */}
        <div 
          className="rounded-3xl border p-6 text-center relative overflow-hidden shadow-sm"
          style={{
            backgroundColor: 'var(--bv-surface-2)',
            borderColor: 'var(--bv-line)'
          }}
        >
          <div className="flex items-center justify-between text-xs text-[var(--bv-muted)] font-semibold mb-4">
            <span className="flex items-center gap-1">
              <Sun className="size-4 text-amber-500" /> Stage {stage} of 5
            </span>
            <span className="text-[var(--bv-brand)] font-bold">{stageName}</span>
          </div>

          {/* Garden visual */}
          <div className="py-6 flex flex-col items-center justify-center gap-2">
            <div className="text-6xl animate-bounce duration-1000">
              {stageEmoji}
            </div>
            <div className="h-2 w-32 rounded-full bg-emerald-600/20 mx-auto mt-2" />
          </div>

          <p className="text-xs text-[var(--bv-ink-soft)] font-medium max-w-md mx-auto mt-2">
            {stageDescription}
          </p>

          {/* Water the Garden Action */}
          <div className="mt-5 pt-4 border-t border-[var(--bv-line)] flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleWater}
              className="px-4 py-2 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition shadow-sm flex items-center gap-1.5"
            >
              <Droplets className="size-3.5" /> Water Your Garden
            </button>
            <span className="text-xs text-[var(--bv-muted)]">
              Watered {wateredCount} times today
            </span>
          </div>

          {wateringMsg && (
            <div className="mt-3 text-xs font-semibold text-[var(--bv-brand)] animate-in fade-in duration-200">
              {wateringMsg}
            </div>
          )}
        </div>

        {/* Garden Milestones Contributed */}
        <div className="mt-5 space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--bv-muted)] block">
            Nurtured by your real accomplishments:
          </span>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl border border-[var(--bv-line)] bg-[var(--bv-surface)] flex items-center gap-2.5">
              <CheckCircle2 className="size-4 text-[var(--bv-success)] shrink-0" />
              <div>
                <div className="font-bold">{completedLessonsCount} Lessons</div>
                <div className="text-[10px] text-[var(--bv-muted)]">Nourishing seeds</div>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-[var(--bv-line)] bg-[var(--bv-surface)] flex items-center gap-2.5">
              <CheckCircle2 className="size-4 text-[var(--bv-success)] shrink-0" />
              <div>
                <div className="font-bold">{thinkingSolvedCount} Logic Wins</div>
                <div className="text-[10px] text-[var(--bv-muted)]">Deepening roots</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 text-center text-xs text-[var(--bv-muted)] flex items-center justify-center gap-1.5">
          <Heart className="size-3 text-rose-400" />
          <span>A garden doesn't grow in a day. Take your time and enjoy learning.</span>
        </div>
      </div>
    </div>
  );
};
