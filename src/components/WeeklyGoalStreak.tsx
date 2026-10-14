import React, { useState, useEffect } from 'react';
import { 
  Flame, Calendar, CheckCircle2, Circle, Sparkles, Trophy, 
  TrendingUp, Shield, ChevronRight, Info, Heart, ArrowRight
} from 'lucide-react';
import { triggerPathCompleteConfetti } from '../utils/confetti';

interface Props {
  streak: number;
  onCompleteToday?: () => void;
  onEarnXp?: (amount: number) => void;
}

interface DayStatus {
  date: Date;
  dateKey: string; // YYYY-MM-DD
  dayName: string; // Mon, Tue...
  dayNumber: number;
  isToday: boolean;
  isFuture: boolean;
  isCompleted: boolean;
}

export const WeeklyGoalStreak: React.FC<Props> = ({ streak, onCompleteToday, onEarnXp }) => {
  const [history, setHistory] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('bv_daily_goal_history');
      if (saved) return JSON.parse(saved);
      // Seed initial 3-day streak history matching initial streak of 3
      const now = new Date();
      const initial: Record<string, boolean> = {};
      for (let i = 1; i <= 3; i++) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        initial[d.toISOString().slice(0, 10)] = true;
      }
      return initial;
    } catch {
      return {};
    }
  });

  const [selectedDay, setSelectedDay] = useState<DayStatus | null>(null);
  const [bestStreak, setBestStreak] = useState<number>(() => {
    const saved = localStorage.getItem('bv_best_streak');
    return saved ? parseInt(saved) : Math.max(streak, 7);
  });

  // Calculate 7-day window (current week: Monday to Sunday)
  const getWeekDays = (): DayStatus[] => {
    const today = new Date();
    const todayKey = today.toISOString().slice(0, 10);

    // Calculate current Monday
    const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday...
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMonday);

    const days: DayStatus[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateKey = d.toISOString().slice(0, 10);
      const isToday = dateKey === todayKey;
      const isFuture = d > today && !isToday;
      const isCompleted = history[dateKey] === true;

      days.push({
        date: d,
        dateKey,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: d.getDate(),
        isToday,
        isFuture,
        isCompleted
      });
    }
    return days;
  };

  const weekDays = getWeekDays();
  const completedDaysCount = weekDays.filter(d => d.isCompleted).length;
  const weeklyPercent = Math.round((completedDaysCount / 7) * 100);

  // Sync best streak
  useEffect(() => {
    if (streak > bestStreak) {
      setBestStreak(streak);
      localStorage.setItem('bv_best_streak', streak.toString());
    }
  }, [streak, bestStreak]);

  const toggleDayCompletion = (day: DayStatus) => {
    if (day.isFuture) return;

    const nextCompleted = !day.isCompleted;
    const newHistory = { ...history, [day.dateKey]: nextCompleted };
    setHistory(newHistory);
    localStorage.setItem('bv_daily_goal_history', JSON.stringify(newHistory));

    if (day.isToday) {
      localStorage.setItem('bv_daily_goal_completed', nextCompleted.toString());
      if (nextCompleted) {
        if (onCompleteToday) onCompleteToday();
        if (onEarnXp) onEarnXp(20);
        triggerPathCompleteConfetti();
      }
    }

    // Update selected day view
    setSelectedDay({ ...day, isCompleted: nextCompleted });
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-10 relative z-20">
      <div 
        className="rounded-3xl border p-5 sm:p-6 shadow-xs transition-all duration-300 relative overflow-hidden"
        style={{
          backgroundColor: 'var(--bv-surface)',
          borderColor: 'var(--bv-line)'
        }}
      >
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--bv-line)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-amber-500/10 text-amber-600 text-sm">
                <Flame className="size-4 fill-amber-500 text-amber-500" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-[var(--bv-brand)]">
                Weekly Goal Streak
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--bv-brand-soft)] text-[var(--bv-brand)]">
                Habit Builder
              </span>
            </div>
            <p className="text-xs text-[var(--bv-muted)]">
              Daily practice creates lifelong builders. Here is your 7-day habit calendar for this week.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="px-3 py-1.5 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] flex items-center gap-2 text-xs font-bold text-[var(--bv-ink)]">
              <Flame className="size-4 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{streak} Day Streak</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] flex items-center gap-1.5 text-xs font-semibold text-[var(--bv-muted)]">
              <Trophy className="size-3.5 text-amber-600" />
              <span>Best: {bestStreak}d</span>
            </div>
          </div>
        </div>

        {/* 7-Day Calendar Grid */}
        <div className="pt-5">
          <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
            {weekDays.map((day) => {
              const isSelected = selectedDay?.dateKey === day.dateKey;

              return (
                <div
                  key={day.dateKey}
                  onClick={() => setSelectedDay(day)}
                  className={`group relative flex flex-col items-center justify-between p-2.5 sm:p-3.5 rounded-2xl border transition-all cursor-pointer select-none text-center min-h-[92px] sm:min-h-[105px] ${
                    day.isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 shadow-xs'
                      : day.isToday
                      ? 'bg-[var(--bv-brand-soft)]/50 border-2 border-[var(--bv-brand)] text-[var(--bv-ink)]'
                      : day.isFuture
                      ? 'bg-[var(--bv-surface-2)]/30 border-[var(--bv-line)]/50 text-[var(--bv-muted)] opacity-60 cursor-default'
                      : 'bg-[var(--bv-surface-2)]/70 border-[var(--bv-line)] text-[var(--bv-muted)] hover:border-[var(--bv-brand)]/50'
                  } ${isSelected ? 'ring-2 ring-[var(--bv-brand)]' : ''}`}
                >
                  {/* Day of Week */}
                  <span className="text-[11px] sm:text-xs font-bold tracking-tight">
                    {day.dayName}
                  </span>

                  {/* Icon Indicator */}
                  <div className="my-1">
                    {day.isCompleted ? (
                      <span className="grid size-7 sm:size-8 place-items-center rounded-xl bg-emerald-500 text-white shadow-xs">
                        <CheckCircle2 className="size-4 sm:size-5 stroke-[2.5]" />
                      </span>
                    ) : day.isToday ? (
                      <span className="grid size-7 sm:size-8 place-items-center rounded-xl bg-[var(--bv-surface)] border-2 border-[var(--bv-brand)] text-[var(--bv-brand)] shadow-xs animate-bounce">
                        <Flame className="size-4 fill-[var(--bv-brand)]" />
                      </span>
                    ) : day.isFuture ? (
                      <span className="grid size-7 sm:size-8 place-items-center rounded-xl bg-[var(--bv-surface)]/60 text-[var(--bv-muted)] text-xs">
                        ·
                      </span>
                    ) : (
                      <span className="grid size-7 sm:size-8 place-items-center rounded-xl bg-[var(--bv-surface)] border border-[var(--bv-line)] text-[var(--bv-muted)] text-xs font-bold">
                        ○
                      </span>
                    )}
                  </div>

                  {/* Date Number + Tag */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs sm:text-sm font-black text-[var(--bv-ink)]">
                      {day.dayNumber}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-75">
                      {day.isToday ? 'Today' : day.isCompleted ? 'Hit' : day.isFuture ? 'Soon' : 'Rest'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details Card (Expandable Inspection) */}
        {selectedDay && (
          <div className="mt-4 p-3.5 rounded-2xl bg-[var(--bv-surface-2)]/50 border border-[var(--bv-line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2.5">
              <Calendar className="size-4 text-[var(--bv-brand)] shrink-0" />
              <div>
                <span className="font-bold text-[var(--bv-ink)]">
                  {selectedDay.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}:
                </span>{' '}
                <span className="text-[var(--bv-muted)]">
                  {selectedDay.isCompleted
                    ? 'Goal achieved! +20 XP awarded 🌷'
                    : selectedDay.isFuture
                    ? 'Upcoming day. Keep your streak momentum going!'
                    : 'Goal was not marked for this date.'}
                </span>
              </div>
            </div>

            {!selectedDay.isFuture && (
              <button
                onClick={() => toggleDayCompletion(selectedDay)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                  selectedDay.isCompleted
                    ? 'bg-[var(--bv-surface)] border border-[var(--bv-line)] text-[var(--bv-muted)] hover:text-red-600'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                }`}
              >
                {selectedDay.isCompleted ? 'Unmark Goal' : 'Mark Goal Hit ✓'}
              </button>
            )}
          </div>
        )}

        {/* Footer Habits Banner & Summary */}
        <div className="mt-5 pt-4 border-t border-[var(--bv-line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[var(--bv-ink-soft)]">
            <span className="font-bold text-[var(--bv-brand)]">Week Goal Progress:</span>
            <span>{completedDaysCount} of 7 days completed ({weeklyPercent}%)</span>
            <div className="w-20 bg-[var(--bv-surface-2)] h-2 rounded-full overflow-hidden border border-[var(--bv-line)] shrink-0 hidden sm:block">
              <div 
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${weeklyPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-[var(--bv-muted)]">
            <span className="flex items-center gap-1 font-semibold text-[var(--bv-brand)]">
              <Sparkles className="size-3" /> Habit rule:
            </span>
            <span>5 mins/day beats 3 hours once a week.</span>
          </div>
        </div>

      </div>
    </section>
  );
};
