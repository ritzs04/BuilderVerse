import React, { useState } from 'react';
import { Trophy, Medal, Crown, Flame, Sparkles, TrendingUp, ArrowUpRight, Zap, Award, CheckCircle2 } from 'lucide-react';

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  level: string;
  xp: number;
  streak: number;
  badgesCount: number;
  countryEmoji: string;
  specialty: string;
  isCurrentUser?: boolean;
}

const BASE_LEADERBOARD_USERS: Omit<LeaderboardUser, 'isCurrentUser'>[] = [
  {
    id: 'b-elena',
    name: 'Elena Rostova',
    avatar: '🌸',
    level: 'Confident Creator',
    xp: 940,
    streak: 18,
    badgesCount: 8,
    countryEmoji: '🇨🇦',
    specialty: 'Full-Stack React & APIs'
  },
  {
    id: 'b-kai',
    name: 'Kai Tanaka',
    avatar: '⚡',
    level: 'Confident Creator',
    xp: 860,
    streak: 14,
    badgesCount: 7,
    countryEmoji: '🇯🇵',
    specialty: 'CSS Architecture & Flexbox'
  },
  {
    id: 'b-maya',
    name: 'Maya Sharma',
    avatar: '🦊',
    level: 'Confident Creator',
    xp: 720,
    streak: 12,
    badgesCount: 6,
    countryEmoji: '🇮🇳',
    specialty: 'Async JavaScript & DOM'
  },
  {
    id: 'b-marcus',
    name: 'Marcus Vance',
    avatar: '🚀',
    level: 'Creative Coder',
    xp: 590,
    streak: 9,
    badgesCount: 5,
    countryEmoji: '🇬🇧',
    specialty: 'Algorithms & Logic Puzzles'
  },
  {
    id: 'b-zoe',
    name: 'Zoe Rodriguez',
    avatar: '🎨',
    level: 'Creative Coder',
    xp: 470,
    streak: 8,
    badgesCount: 4,
    countryEmoji: '🇲🇽',
    specialty: 'Responsive UI Design'
  },
  {
    id: 'b-amara',
    name: 'Amara Okafor',
    avatar: '🌷',
    level: 'Project Builder',
    xp: 390,
    streak: 6,
    badgesCount: 4,
    countryEmoji: '🇳🇬',
    specialty: 'Git Workflows & Pipelines'
  },
  {
    id: 'b-sam',
    name: 'Sam Chen',
    avatar: '💡',
    level: 'Project Builder',
    xp: 290,
    streak: 5,
    badgesCount: 3,
    countryEmoji: '🇸🇬',
    specialty: 'Interactive DOM Events'
  },
  {
    id: 'b-liam',
    name: 'Liam Murphy',
    avatar: '🐱',
    level: 'Logic Learner',
    xp: 190,
    streak: 4,
    badgesCount: 2,
    countryEmoji: '🇮🇪',
    specialty: 'Box Model Fundamentals'
  },
  {
    id: 'b-sofia',
    name: 'Sofia Rossi',
    avatar: '🐼',
    level: 'Logic Learner',
    xp: 130,
    streak: 3,
    badgesCount: 2,
    countryEmoji: '🇮🇹',
    specialty: 'Semantic HTML Semantics'
  },
  {
    id: 'b-noah',
    name: 'Noah Davis',
    avatar: '☕',
    level: 'Idea Explorer',
    xp: 75,
    streak: 2,
    badgesCount: 1,
    countryEmoji: '🇦🇺',
    specialty: 'First Step Programming'
  }
];

interface Props {
  currentUser: {
    username: string;
    xp: number;
    streak: number;
    avatar: string;
    level: string;
    builderId: string;
  };
}

export const GlobalLeaderboard: React.FC<Props> = ({ currentUser }) => {
  const [timeframe, setTimeframe] = useState<'all-time' | 'weekly' | 'today'>('all-time');

  // Compute scaled scores based on timeframe
  const getScaledEntries = (): LeaderboardUser[] => {
    // Current user representation
    let userXp = currentUser.xp;
    if (timeframe === 'weekly') {
      userXp = Math.max(25, Math.round(currentUser.xp * 0.45));
    } else if (timeframe === 'today') {
      userXp = Math.max(15, Math.round(currentUser.xp * 0.18));
    }

    const currentEntry: LeaderboardUser = {
      id: 'current-user',
      name: currentUser.username || 'You',
      avatar: currentUser.avatar || '🌸',
      level: currentUser.level,
      xp: userXp,
      streak: currentUser.streak,
      badgesCount: Math.max(1, Math.floor(currentUser.xp / 100)),
      countryEmoji: '✨',
      specialty: 'Active Builder',
      isCurrentUser: true
    };

    const mockEntries: LeaderboardUser[] = BASE_LEADERBOARD_USERS.map(b => {
      let scaledXp = b.xp;
      if (timeframe === 'weekly') {
        scaledXp = Math.round(b.xp * 0.42 + (b.streak * 4));
      } else if (timeframe === 'today') {
        scaledXp = Math.round(b.xp * 0.14 + (b.streak * 2));
      }
      return {
        ...b,
        xp: scaledXp,
        isCurrentUser: false
      };
    });

    const all = [...mockEntries, currentEntry];
    all.sort((a, b) => b.xp - a.xp);
    return all;
  };

  const rankedEntries = getScaledEntries();
  const userRankIndex = rankedEntries.findIndex(e => e.isCurrentUser);
  const userRank = userRankIndex + 1;
  const userEntry = rankedEntries[userRankIndex];

  // Person directly ahead of user
  const personAhead = userRankIndex > 0 ? rankedEntries[userRankIndex - 1] : null;
  const xpToOvertake = personAhead ? (personAhead.xp - userEntry.xp + 5) : 0;

  const top3 = rankedEntries.slice(0, 3);
  const restRanked = rankedEntries.slice(3);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: '🥇', label: '1st', bg: 'bg-amber-400/20 text-amber-700 dark:text-amber-300 border-amber-400/40' };
    if (rank === 2) return { icon: '🥈', label: '2nd', bg: 'bg-slate-300/30 text-slate-700 dark:text-slate-300 border-slate-300/50' };
    if (rank === 3) return { icon: '🥉', label: '3rd', bg: 'bg-amber-600/20 text-amber-800 dark:text-amber-400 border-amber-600/40' };
    return { icon: `#${rank}`, label: `#${rank}`, bg: 'bg-[var(--bv-surface-2)] text-[var(--bv-ink-soft)] border-[var(--bv-line)]' };
  };

  const maxXp = rankedEntries[0]?.xp || 1000;

  return (
    <section id="leaderboard" className="py-16 px-4 sm:px-6 border-t border-[var(--bv-line)]">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)]">
              <Trophy className="size-4" /> Global Leaderboard
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--bv-ink)]">
              Top Builders & Learning Milestones 🏆
            </h2>
            <p className="text-sm text-[var(--bv-muted)] max-w-2xl">
              Turn every solved quiz, fixed bug, and completed project into XP. Compete with friendly peers worldwide and climb the ranks!
            </p>
          </div>

          {/* Timeframe Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--bv-surface-2)]/70 border border-[var(--bv-line)] shrink-0 self-start md:self-auto">
            {(['all-time', 'weekly', 'today'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setTimeframe(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer capitalize ${
                  timeframe === tab
                    ? 'bg-[var(--bv-brand)] text-white shadow-xs'
                    : 'text-[var(--bv-ink-soft)] hover:bg-[var(--bv-surface)]'
                }`}
              >
                {tab === 'all-time' ? 'All-Time' : tab === 'weekly' ? 'Weekly Sprint' : 'Today'}
              </button>
            ))}
          </div>
        </div>

        {/* Current User Standing Highlight Banner */}
        <div className="p-5 sm:p-6 rounded-3xl border-2 border-[var(--bv-brand)]/40 bg-gradient-to-r from-[var(--bv-brand-soft)]/40 via-[var(--bv-surface)] to-[var(--bv-surface-2)]/50 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="grid size-14 place-items-center rounded-2xl bg-[var(--bv-surface)] border border-[var(--bv-line)] text-3xl shadow-xs">
                {currentUser.avatar || '🌸'}
              </span>
              <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[var(--bv-brand)] text-white shadow-xs">
                #{userRank}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-base text-[var(--bv-ink)]">
                  {currentUser.username || 'You'}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--bv-brand)] text-white">
                  You
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--bv-surface-2)] text-[var(--bv-ink-soft)] font-semibold">
                  {currentUser.level}
                </span>
              </div>
              <p className="text-xs text-[var(--bv-muted)] mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1 font-semibold text-amber-600">
                  <Flame className="size-3.5 fill-amber-500 text-amber-500" />
                  {currentUser.streak} Day Streak
                </span>
                <span>·</span>
                <span className="font-mono text-[var(--bv-ink)]">
                  Builder ID: {currentUser.builderId}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[var(--bv-line)]/50">
            <div className="text-left md:text-right">
              <div className="text-xs font-medium text-[var(--bv-muted)]">Your Score</div>
              <div className="text-xl font-black text-[var(--bv-brand)] flex items-center gap-1 md:justify-end">
                <Zap className="size-4 fill-[var(--bv-brand)]" />
                {userEntry.xp} XP
              </div>
            </div>

            {personAhead && (
              <div className="pl-4 border-l border-[var(--bv-line)] text-xs space-y-1">
                <div className="text-[var(--bv-muted)] text-[11px]">Next Target:</div>
                <div className="font-bold text-[var(--bv-ink)] flex items-center gap-1">
                  <span>+{xpToOvertake} XP to overtake</span>
                  <span className="text-[var(--bv-brand)]">#{userRank - 1} {personAhead.name.split(' ')[0]}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top 3 Podium (1st, 2nd, 3rd) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 items-end">
          {/* 2nd Place */}
          {top3[1] && (
            <div className={`order-2 md:order-1 p-5 rounded-3xl border transition-all text-center flex flex-col items-center justify-between min-h-[220px] ${
              top3[1].isCurrentUser
                ? 'bg-[var(--bv-brand-soft)]/40 border-[var(--bv-brand)] shadow-md'
                : 'bg-[var(--bv-surface)] border-[var(--bv-line)] shadow-xs'
            }`}>
              <div className="w-full flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  🥈 2nd Place
                </span>
                <span className="text-sm">{top3[1].countryEmoji}</span>
              </div>

              <div className="my-3 flex flex-col items-center">
                <span className="text-4xl mb-1">{top3[1].avatar}</span>
                <div className="font-bold text-sm text-[var(--bv-ink)] flex items-center gap-1">
                  {top3[1].name}
                  {top3[1].isCurrentUser && <span className="text-[10px] bg-[var(--bv-brand)] text-white px-1.5 py-0.2 rounded-full">You</span>}
                </div>
                <span className="text-[11px] text-[var(--bv-muted)]">{top3[1].level}</span>
              </div>

              <div className="w-full pt-3 border-t border-[var(--bv-line)]/60 flex items-center justify-between text-xs font-bold">
                <span className="text-amber-600 flex items-center gap-0.5">
                  <Flame className="size-3.5 fill-amber-500 text-amber-500" /> {top3[1].streak}d
                </span>
                <span className="text-[var(--bv-brand)] font-extrabold">{top3[1].xp} XP</span>
              </div>
            </div>
          )}

          {/* 1st Place (Center & Tallest) */}
          {top3[0] && (
            <div className={`order-1 md:order-2 p-6 rounded-3xl border-2 transition-all text-center flex flex-col items-center justify-between min-h-[260px] relative ${
              top3[0].isCurrentUser
                ? 'bg-amber-500/10 border-amber-400 shadow-lg'
                : 'bg-gradient-to-b from-amber-500/10 via-[var(--bv-surface)] to-[var(--bv-surface)] border-amber-400/60 shadow-md'
            }`}>
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-400 text-zinc-950 text-xs font-black flex items-center gap-1 shadow-sm">
                <Crown className="size-3.5 fill-zinc-950" /> LEADER 🥇
              </div>

              <div className="w-full flex items-center justify-between pt-1">
                <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300">
                  1st Place Champion
                </span>
                <span className="text-base">{top3[0].countryEmoji}</span>
              </div>

              <div className="my-2 flex flex-col items-center">
                <div className="relative">
                  <span className="text-5xl block mb-1">{top3[0].avatar}</span>
                  <Crown className="size-4 fill-amber-500 text-amber-500 absolute -top-1 -right-1 animate-bounce" />
                </div>
                <div className="font-extrabold text-base text-[var(--bv-ink)] flex items-center gap-1">
                  {top3[0].name}
                  {top3[0].isCurrentUser && <span className="text-[10px] bg-[var(--bv-brand)] text-white px-1.5 py-0.2 rounded-full">You</span>}
                </div>
                <span className="text-xs font-medium text-[var(--bv-brand)]">{top3[0].specialty}</span>
              </div>

              <div className="w-full pt-3 border-t border-[var(--bv-line)]/60 flex items-center justify-between text-xs font-bold">
                <span className="text-amber-600 flex items-center gap-0.5">
                  <Flame className="size-3.5 fill-amber-500 text-amber-500" /> {top3[0].streak}d streak
                </span>
                <span className="text-base font-black text-amber-600 dark:text-amber-400">
                  {top3[0].xp} XP
                </span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <div className={`order-3 p-5 rounded-3xl border transition-all text-center flex flex-col items-center justify-between min-h-[220px] ${
              top3[2].isCurrentUser
                ? 'bg-[var(--bv-brand-soft)]/40 border-[var(--bv-brand)] shadow-md'
                : 'bg-[var(--bv-surface)] border-[var(--bv-line)] shadow-xs'
            }`}>
              <div className="w-full flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-600/15 text-amber-800 dark:text-amber-300 flex items-center gap-1">
                  🥉 3rd Place
                </span>
                <span className="text-sm">{top3[2].countryEmoji}</span>
              </div>

              <div className="my-3 flex flex-col items-center">
                <span className="text-4xl mb-1">{top3[2].avatar}</span>
                <div className="font-bold text-sm text-[var(--bv-ink)] flex items-center gap-1">
                  {top3[2].name}
                  {top3[2].isCurrentUser && <span className="text-[10px] bg-[var(--bv-brand)] text-white px-1.5 py-0.2 rounded-full">You</span>}
                </div>
                <span className="text-[11px] text-[var(--bv-muted)]">{top3[2].level}</span>
              </div>

              <div className="w-full pt-3 border-t border-[var(--bv-line)]/60 flex items-center justify-between text-xs font-bold">
                <span className="text-amber-600 flex items-center gap-0.5">
                  <Flame className="size-3.5 fill-amber-500 text-amber-500" /> {top3[2].streak}d
                </span>
                <span className="text-[var(--bv-brand)] font-extrabold">{top3[2].xp} XP</span>
              </div>
            </div>
          )}
        </div>

        {/* Leaderboard Table (Ranks 4 to End) */}
        <div className="rounded-3xl border border-[var(--bv-line)] bg-[var(--bv-surface)] overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-[var(--bv-line)] bg-[var(--bv-surface-2)]/30 flex items-center justify-between">
            <span className="text-xs font-extrabold text-[var(--bv-ink)] uppercase tracking-wider flex items-center gap-2">
              <Award className="size-4 text-[var(--bv-brand)]" /> Leaderboard Rankings
            </span>
            <span className="text-xs text-[var(--bv-muted)] font-medium">
              Showing top {rankedEntries.length} active builders
            </span>
          </div>

          <div className="divide-y divide-[var(--bv-line)]">
            {rankedEntries.map((builder, index) => {
              const rank = index + 1;
              const badge = getRankBadge(rank);
              const isUser = builder.isCurrentUser;
              const percentOfTop = Math.round((builder.xp / maxXp) * 100);

              return (
                <div
                  key={builder.id}
                  className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors ${
                    isUser
                      ? 'bg-[var(--bv-brand-soft)]/50 font-bold border-l-4 border-l-[var(--bv-brand)]'
                      : 'hover:bg-[var(--bv-surface-2)]/40'
                  }`}
                >
                  {/* Rank & Builder Profile */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <span className={`grid place-items-center size-8 rounded-xl font-extrabold text-xs shrink-0 border ${badge.bg}`}>
                      {badge.icon}
                    </span>

                    <span className="text-2xl shrink-0 select-none">{builder.avatar}</span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs sm:text-sm truncate ${isUser ? 'font-black text-[var(--bv-brand)]' : 'font-bold text-[var(--bv-ink)]'}`}>
                          {builder.name}
                        </span>
                        {isUser && (
                          <span className="text-[10px] font-extrabold bg-[var(--bv-brand)] text-white px-2 py-0.2 rounded-full">
                            YOU
                          </span>
                        )}
                        <span className="text-[11px] text-[var(--bv-muted)] hidden sm:inline">
                          {builder.countryEmoji}
                        </span>
                      </div>
                      <div className="text-[11px] text-[var(--bv-muted)] font-normal truncate">
                        {builder.level} · <span className="italic">{builder.specialty}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats: Streak & XP Bar */}
                  <div className="flex items-center gap-4 sm:gap-8 shrink-0">
                    <div className="hidden sm:flex items-center gap-1 text-xs text-amber-600 font-bold">
                      <Flame className="size-3.5 fill-amber-500 text-amber-500" />
                      <span>{builder.streak}d</span>
                    </div>

                    <div className="text-right w-24 sm:w-32">
                      <div className="text-xs sm:text-sm font-black text-[var(--bv-ink)]">
                        {builder.xp} XP
                      </div>
                      <div className="w-full bg-[var(--bv-surface-2)] h-1.5 rounded-full overflow-hidden mt-1 border border-[var(--bv-line)]/50">
                        <div
                          className={`h-full rounded-full ${isUser ? 'bg-[var(--bv-brand)]' : 'bg-[var(--bv-brand)]/60'}`}
                          style={{ width: `${percentOfTop}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivational Callout to Earn XP */}
        <div className="p-6 rounded-3xl border border-[var(--bv-line)] bg-gradient-to-r from-[var(--bv-surface-2)]/60 to-[var(--bv-surface)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-extrabold text-sm text-[var(--bv-ink)] flex items-center gap-2 justify-center sm:justify-start">
              <Sparkles className="size-4 text-[var(--bv-brand)]" /> Want to climb higher on the leaderboard?
            </h4>
            <p className="text-xs text-[var(--bv-muted)]">
              Complete lessons (+25 XP), untangle bugs in Error Companion (+35 XP), or build guided projects (+150-300 XP)!
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center shrink-0">
            <a
              href="#learn"
              className="px-3.5 py-2 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition shadow-xs flex items-center gap-1.5"
            >
              <span>Start Lessons</span>
              <ArrowUpRight className="size-3.5" />
            </a>
            <a
              href="#think"
              className="px-3.5 py-2 rounded-xl bg-[var(--bv-surface)] border border-[var(--bv-line)] text-xs font-bold text-[var(--bv-ink)] hover:bg-[var(--bv-surface-2)] transition"
            >
              Thinking Gym
            </a>
            <a
              href="#build"
              className="px-3.5 py-2 rounded-xl bg-[var(--bv-surface)] border border-[var(--bv-line)] text-xs font-bold text-[var(--bv-ink)] hover:bg-[var(--bv-surface-2)] transition"
            >
              Guided Projects
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
