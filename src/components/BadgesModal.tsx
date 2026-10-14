import React, { useEffect, useState } from 'react';
import { BADGES } from '../data/builderVerseData';
import { X, Trophy, Flame, Zap, Award, CheckCircle2, Lock, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userXp: number;
  streakDays: number;
}

export const BadgesModal: React.FC<Props> = ({ isOpen, onClose, userXp, streakDays }) => {
  const [newlyUnlockedIds, setNewlyUnlockedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    try {
      const storedUnlocked = JSON.parse(localStorage.getItem('bv_unlocked_badges') || '[]');
      const currentUnlocked = BADGES.filter(b => userXp >= (b.unlockedAtXp || 0)).map(b => b.id);
      
      // Find badges that are unlocked now but weren't in storedUnlocked
      const justUnlocked = currentUnlocked.filter(id => !storedUnlocked.includes(id));
      if (justUnlocked.length > 0) {
        setNewlyUnlockedIds(justUnlocked);
        // Save current unlocked to storage
        localStorage.setItem('bv_unlocked_badges', JSON.stringify(currentUnlocked));
      } else {
        setNewlyUnlockedIds([]);
      }
    } catch (e) {
      console.error(e);
    }
  }, [isOpen, userXp]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl p-6 sm:p-8"
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

        <div className="flex items-center gap-3 pb-4 border-b border-[var(--bv-line)]">
          <span className="grid size-10 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
            <Trophy className="size-5" />
          </span>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)]">Progression</span>
            <h2 className="text-xl font-bold text-[var(--bv-ink)]">Badges & Achievements</h2>
          </div>
        </div>

        {/* User Stats Card */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] flex items-center gap-3">
            <Zap className="size-6 text-amber-500 shrink-0" />
            <div>
              <div className="text-[11px] font-semibold text-[var(--bv-muted)]">Total XP Earned</div>
              <div className="text-lg font-extrabold text-[var(--bv-ink)]">{userXp} XP</div>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] flex items-center gap-3">
            <Flame className="size-6 text-rose-500 shrink-0" />
            <div>
              <div className="text-[11px] font-semibold text-[var(--bv-muted)]">Active Streak</div>
              <div className="text-lg font-extrabold text-[var(--bv-ink)]">{streakDays} Days</div>
            </div>
          </div>
        </div>

        {/* Badges List */}
        <div className="mt-5 space-y-3">
          {BADGES.map(badge => {
            const isUnlocked = userXp >= (badge.unlockedAtXp || 0);
            const isNewlyUnlocked = newlyUnlockedIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-xl border flex items-center gap-3.5 transition ${
                  isUnlocked
                    ? 'bg-amber-500/5 border-amber-500/30 text-[var(--bv-ink)]'
                    : 'bg-[var(--bv-surface-2)]/40 border-[var(--bv-line)] opacity-60'
                }`}
              >
                <div className={`size-11 rounded-xl grid place-items-center text-xl shrink-0 ${
                  isUnlocked ? 'bg-amber-500/15' : 'bg-[var(--bv-surface-2)] grayscale'
                } ${isUnlocked ? 'animate-badge-pop' : ''}`}>
                  {badge.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-[var(--bv-ink)] truncate">{badge.title}</h4>
                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-500/15 px-2 py-0.5 rounded-full animate-pulse">
                        <CheckCircle2 className="size-3" /> Unlocked {isNewlyUnlocked && '🎉'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-[var(--bv-muted)] bg-[var(--bv-surface-2)] px-2 py-0.5 rounded-full">
                        <Lock className="size-3" /> {badge.unlockedAtXp} XP req.
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--bv-muted)] mt-0.5">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
