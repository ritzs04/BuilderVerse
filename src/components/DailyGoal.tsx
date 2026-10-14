/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Sparkles, Plus, Edit2, RotateCcw, Heart, Calendar } from 'lucide-react';

interface Props {
  onEarnXp: (amount: number) => void;
  userXp: number;
  onGoalCompleted?: () => void;
}

const PRESET_GOALS = [
  'Solve 1 logic puzzle in the Thinking Gym',
  'Squash 1 bug in the Error Companion',
  'Read 1 lesson and ace the quiz',
  'Complete 1 checklist step in a guided project',
  'Practice CSS flexbox alignment for 10 minutes'
];

export const DailyGoal: React.FC<Props> = ({ onEarnXp, onGoalCompleted }) => {
  const todayKey = new Date().toISOString().slice(0, 10);

  const [goalText, setGoalText] = useState<string>(() => {
    return localStorage.getItem('bv_daily_goal_text') || 'Solve 1 logic puzzle in the Thinking Gym';
  });

  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    const savedDate = localStorage.getItem('bv_daily_goal_date');
    const savedStatus = localStorage.getItem('bv_daily_goal_completed');
    if (savedDate === todayKey && savedStatus === 'true') {
      return true;
    }
    return false;
  });

  const [goalHistory, setGoalHistory] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('bv_daily_goal_history');
    return saved ? JSON.parse(saved) : {};
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('bv_daily_goal_text', goalText);
  }, [goalText]);

  useEffect(() => {
    localStorage.setItem('bv_daily_goal_date', todayKey);
    localStorage.setItem('bv_daily_goal_completed', isCompleted.toString());

    // Update history for today
    setGoalHistory(prev => {
      const next = { ...prev, [todayKey]: isCompleted };
      localStorage.setItem('bv_daily_goal_history', JSON.stringify(next));
      return next;
    });
  }, [isCompleted, todayKey]);

  const handleToggle = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      setShowCelebration(true);
      onEarnXp(20);
      if (onGoalCompleted) {
        onGoalCompleted();
      }
      setTimeout(() => setShowCelebration(false), 4500);
    } else {
      setIsCompleted(false);
    }
  };

  const handleSelectPreset = (preset: string) => {
    setGoalText(preset);
    setIsEditing(false);
    setIsCompleted(false);
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      setGoalText(customInput.trim());
      setCustomInput('');
      setIsEditing(false);
      setIsCompleted(false);
    }
  };

  const handleResetForToday = () => {
    setIsCompleted(false);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-4 mb-10 relative z-20">
      <div 
        className="rounded-2xl border p-5 sm:p-6 shadow-sm transition-all duration-300 relative overflow-hidden"
        style={{
          backgroundColor: 'var(--bv-surface)',
          borderColor: isCompleted ? 'var(--bv-success)' : 'var(--bv-line)'
        }}
      >
        {/* Subtle decorative background glow */}
        <div 
          className="absolute -right-12 -top-12 size-40 rounded-full blur-2xl pointer-events-none opacity-40"
          style={{ backgroundColor: isCompleted ? 'var(--bv-success-soft)' : 'var(--bv-surface-2)' }}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left Title and Subtitle */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm">🌷</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)]">
                Today's Tiny Goal
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bv-brand-soft)] text-[var(--bv-brand)]">
                +20 XP Daily
              </span>
            </div>
            <p className="text-xs text-[var(--bv-muted)]">
              Small steps compound fast. Set one doable action for today and check it off.
            </p>
          </div>

          {/* Edit / Quick Pick toggle */}
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => {
                  setCustomInput(goalText);
                  setIsEditing(true);
                }}
                className="text-xs font-medium text-[var(--bv-muted)] hover:text-[var(--bv-brand)] flex items-center gap-1 transition px-2.5 py-1 rounded-lg hover:bg-[var(--bv-surface-2)]"
              >
                <Edit2 className="size-3" /> Change goal
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs text-[var(--bv-muted)] hover:underline"
              >
                Cancel
              </button>
            )}

            {isCompleted && (
              <button
                onClick={handleResetForToday}
                className="text-xs text-[var(--bv-muted)] hover:text-[var(--bv-ink)] flex items-center gap-1 transition px-2 py-1"
                title="Reset goal"
              >
                <RotateCcw className="size-3" />
              </button>
            )}
          </div>
        </div>

        {/* Editing or Displaying the Goal */}
        {isEditing ? (
          <div className="mt-4 pt-3 border-t border-[var(--bv-line)] space-y-3">
            <form onSubmit={handleSaveCustom} className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                placeholder="Write your custom coding goal for today..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-[var(--bv-ink)] focus:outline-none focus:border-[var(--bv-brand)] transition"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[var(--bv-brand)] text-white hover:bg-[var(--bv-brand-strong)] transition shadow-sm"
              >
                Set Goal
              </button>
            </form>

            <div>
              <span className="text-[11px] font-semibold text-[var(--bv-muted)] block mb-1.5">
                Or pick a quick idea:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_GOALS.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectPreset(preset)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-[var(--bv-ink-soft)] hover:border-[var(--bv-brand)]/50 hover:text-[var(--bv-brand)] transition"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 pt-3 border-t border-[var(--bv-line)] flex items-center justify-between gap-4">
            {/* Interactive Toggle Checkbox */}
            <div 
              onClick={handleToggle}
              className={`flex-1 flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                isCompleted 
                  ? 'bg-[var(--bv-success-soft)] border-[var(--bv-success)]/40 text-[var(--bv-success)]' 
                  : 'bg-[var(--bv-surface-2)]/60 border-[var(--bv-line)] hover:border-[var(--bv-brand)]/50 text-[var(--bv-ink)]'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="size-5 shrink-0 text-[var(--bv-success)] transition-transform duration-200 scale-110" />
              ) : (
                <Circle className="size-5 shrink-0 text-[var(--bv-muted)] hover:text-[var(--bv-brand)] transition" />
              )}
              <span className={`text-xs sm:text-sm font-semibold leading-relaxed ${
                isCompleted ? 'line-through opacity-85' : ''
              }`}>
                {goalText}
              </span>
            </div>

            {/* Quick status pill */}
            <div className="shrink-0 text-right">
              {isCompleted ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--bv-success)]">
                  <Heart className="size-3.5 fill-[var(--bv-success)]" />
                  <span>Done for today!</span>
                </div>
              ) : (
                <button
                  onClick={handleToggle}
                  className="px-3.5 py-1.5 rounded-lg bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition shadow-sm"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        )}

        {/* Past 7 Days Visual Streak Bar Chart / List */}
        <div className="mt-4 pt-3 border-t border-[var(--bv-line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[var(--bv-muted)]">
            <Calendar className="size-3.5 text-[var(--bv-brand)]" />
            <span className="font-bold text-[var(--bv-ink)]">Past 7 Days Streak History:</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (6 - i));
              const dateStr = d.toISOString().slice(0, 10);
              const dayLabel = d.toLocaleDateString('en-US', { weekday: 'narrow' });
              const isDone = goalHistory[dateStr] === true;
              const isToday = dateStr === todayKey;

              return (
                <div 
                  key={dateStr} 
                  className="flex flex-col items-center gap-1 group relative"
                  title={`${d.toLocaleDateString()}: ${isDone ? 'Completed 🌷' : 'No activity'}`}
                >
                  <span className="text-[10px] text-[var(--bv-muted)] font-semibold">{dayLabel}</span>
                  <div 
                    className={`w-7 h-5 sm:w-8 sm:h-6 rounded-md flex items-center justify-center transition-all ${
                      isDone 
                        ? 'bg-[var(--bv-brand)] text-white shadow-xs font-bold text-[11px]' 
                        : 'bg-[var(--bv-surface-2)] text-[var(--bv-muted)] border border-[var(--bv-line)]'
                    } ${isToday ? 'ring-2 ring-[var(--bv-brand)]/50' : ''}`}
                  >
                    {isDone ? '✓' : '·'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Celebration Toast Note */}
        {showCelebration && (
          <div className="mt-3 p-3 rounded-xl bg-[var(--bv-success-soft)] border border-[var(--bv-success)]/30 text-xs font-semibold text-[var(--bv-success)] flex items-center justify-between animate-in fade-in duration-200">
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-4" />
              You did it! +20 XP added. Every small step makes you a little more confident. 🌸
            </span>
            <span className="text-[10px] uppercase font-bold opacity-75">Saved</span>
          </div>
        )}
      </div>
    </section>
  );
};
