import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Sparkles, Award, Flame, Zap, FolderGit2, BookOpen, Heart, Calendar, Users, Radio, MessageCircle } from 'lucide-react';
import { AVATAR_OPTIONS } from './AvatarGalleryModal';
import { BADGES } from '../data/builderVerseData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  avatarId: string;
  builderId: string;
  level: string;
  xp: number;
  streak: number;
  completedLessonsCount: number;
  completedProjectsCount: number;
  badgesCount: number;
}

const LEVEL_MILESTONES = [
  { title: 'Curious Beginner', xpRequired: 0, icon: '🌱' },
  { title: 'Idea Explorer', xpRequired: 50, icon: '💡' },
  { title: 'Logic Learner', xpRequired: 120, icon: '⚙️' },
  { title: 'Project Builder', xpRequired: 250, icon: '🛠️' },
  { title: 'Creative Coder', xpRequired: 450, icon: '✨' },
  { title: 'Confident Creator', xpRequired: 700, icon: '🌷' },
];

const MOCK_ONLINE_BUILDERS = [
  { id: 'b1', name: 'Maya S.', level: 'Creative Coder', avatar: '🌸', status: 'Looking for pair programming partner 🚀', online: true },
  { id: 'b2', name: 'Leo K.', level: 'Logic Learner', avatar: '⚡', status: 'Building a React Todo app 🛠️', online: true },
  { id: 'b3', name: 'Zoe R.', level: 'Project Builder', avatar: '🎨', status: 'Reviewing CSS animations ✨', online: true },
  { id: 'b4', name: 'Sam T.', level: 'Idea Explorer', avatar: '💡', status: 'Learning JavaScript fundamentals 📚', online: true },
];

export const BuilderCardModal: React.FC<Props> = ({
  isOpen,
  onClose,
  username,
  avatarId,
  builderId,
  level,
  xp,
  streak,
  completedLessonsCount,
  completedProjectsCount,
  badgesCount
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [levelDates, setLevelDates] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('bv_level_dates');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [lookingForPartner, setLookingForPartner] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('bv_looking_for_partner');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [connectedBuddies, setConnectedBuddies] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      localStorage.setItem('bv_looking_for_partner', JSON.stringify(lookingForPartner));
    } catch {}
  }, [lookingForPartner]);

  useEffect(() => {
    const updatedDates = { ...levelDates };
    let changed = false;
    LEVEL_MILESTONES.forEach(m => {
      if (xp >= m.xpRequired && !updatedDates[m.title]) {
        updatedDates[m.title] = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        changed = true;
      }
    });
    if (changed) {
      setLevelDates(updatedDates);
      localStorage.setItem('bv_level_dates', JSON.stringify(updatedDates));
    }
  }, [xp]);

  const avatar = AVATAR_OPTIONS.find(a => a.id === avatarId) || AVATAR_OPTIONS[0];

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.origin + '?builder=' + builderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const nextBadge = BADGES.find(b => (b.unlockedAtXp || 0) > xp);
  const prevBadgeXp = BADGES.slice().reverse().find(b => (b.unlockedAtXp || 0) <= xp)?.unlockedAtXp || 0;
  const xpNeeded = nextBadge ? Math.max(0, nextBadge.unlockedAtXp! - xp) : 0;
  const progressPercent = nextBadge 
    ? Math.min(100, Math.max(0, ((xp - prevBadgeXp) / (nextBadge.unlockedAtXp! - prevBadgeXp)) * 100))
    : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-3xl border shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
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
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--bv-brand)]">
            My Builder Card
          </span>
          <h2 className="text-lg font-bold text-[var(--bv-ink)]">
            Your Builder Identity
          </h2>
        </div>

        {/* The Pretty Card */}
        <div 
          className="rounded-3xl border p-6 relative overflow-hidden shadow-lg transition-transform"
          style={{
            backgroundColor: 'var(--bv-surface)',
            borderColor: 'var(--bv-brand)',
            boxShadow: '0 12px 30px -10px rgba(166, 95, 121, 0.2)'
          }}
        >
          {/* Top Decorative Sparkles */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--bv-line)]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--bv-brand)]">
              <span>🌷 BuilderVerse</span>
            </div>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--bv-surface-2)] text-[var(--bv-ink-soft)]">
              ID: {builderId}
            </span>
          </div>

          {/* Profile Header */}
          <div className="flex items-center gap-4 py-5">
            <div 
              className="size-16 rounded-2xl grid place-items-center text-3xl shadow-sm border border-white dark:border-[var(--bv-line)] shrink-0"
              style={{ backgroundColor: avatar.badgeBg }}
            >
              {avatar.emoji}
            </div>

            <div className="min-w-0">
              <h3 className="font-extrabold text-lg text-[var(--bv-ink)] truncate">
                {username}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[var(--bv-brand-soft)] text-[var(--bv-brand)]">
                  {level}
                </span>
                <span className="text-xs text-[var(--bv-muted)]">
                  {avatar.name}
                </span>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 py-4 border-y border-[var(--bv-line)] text-center text-xs">
            <div className="p-2 rounded-xl bg-[var(--bv-surface-2)]/60">
              <div className="flex items-center justify-center gap-1 text-amber-500 font-bold mb-0.5">
                <Zap className="size-3.5 fill-amber-500" />
                <span>{xp}</span>
              </div>
              <span className="text-[10px] text-[var(--bv-muted)]">Total XP</span>
            </div>

            <div className="p-2 rounded-xl bg-[var(--bv-surface-2)]/60">
              <div className="flex items-center justify-center gap-1 text-rose-500 font-bold mb-0.5">
                <Flame className="size-3.5 fill-rose-500" />
                <span>{streak}d</span>
              </div>
              <span className="text-[10px] text-[var(--bv-muted)]">Active Streak</span>
            </div>

            <div className="p-2 rounded-xl bg-[var(--bv-surface-2)]/60">
              <div className="flex items-center justify-center gap-1 text-[var(--bv-brand)] font-bold mb-0.5">
                <Award className="size-3.5" />
                <span>{badgesCount}</span>
              </div>
              <span className="text-[10px] text-[var(--bv-muted)]">Badges</span>
            </div>
          </div>

          {/* Activities Summary */}
          <div className="mt-4 space-y-1.5 text-xs text-[var(--bv-ink-soft)]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[var(--bv-muted)]">
                <BookOpen className="size-3.5" /> Lessons Completed:
              </span>
              <span className="font-bold">{completedLessonsCount} / 27</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[var(--bv-muted)]">
                <FolderGit2 className="size-3.5" /> Guided Builds Finished:
              </span>
              <span className="font-bold">{completedProjectsCount} / 5</span>
            </div>
          </div>

          {/* XP Threshold Visual Tracker for Next Badge Milestone */}
          <div className="mt-4 pt-4 border-t border-[var(--bv-line)]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-[var(--bv-muted)] flex items-center gap-1">
                <Sparkles className="size-3 text-[var(--bv-brand)]" /> Next Milestone
              </span>
              {nextBadge ? (
                <span className="text-[10px] font-semibold text-[var(--bv-brand)]">
                  {xpNeeded} XP needed
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  All Milestones Reached! 🌟
                </span>
              )}
            </div>

            {nextBadge ? (
              <div className="p-3 rounded-2xl bg-[var(--bv-surface-2)]/80 border border-[var(--bv-line)] flex items-center gap-3">
                <div className="size-10 rounded-xl bg-[var(--bv-brand-soft)] grid place-items-center text-lg shrink-0">
                  {nextBadge.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs font-bold text-[var(--bv-ink)] mb-1">
                    <span className="truncate">{nextBadge.title}</span>
                    <span className="font-mono text-[10px] text-[var(--bv-muted)]">{xp} / {nextBadge.unlockedAtXp} XP</span>
                  </div>
                  <div className="w-full bg-[var(--bv-surface)] h-2 rounded-full overflow-hidden border border-[var(--bv-line)]">
                    <div 
                      className="bg-[var(--bv-brand)] h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[var(--bv-muted)] mt-1 truncate">{nextBadge.description}</p>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-[var(--bv-surface-2)]/80 border border-[var(--bv-line)] text-center text-xs text-[var(--bv-brand)] font-semibold">
                Legendary Master Builder! You've unlocked all badge milestones. 🌷
              </div>
            )}
          </div>

          {/* 7-Day Visual Streak Calendar */}
          <div className="mt-4 pt-4 border-t border-[var(--bv-line)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[var(--bv-muted)] flex items-center gap-1">
                <Calendar className="size-3" /> Past 7 Days Activity
              </span>
              <span className="text-[10px] font-semibold text-[var(--bv-brand)]">
                {Math.min(streak, 7)} / 7 active
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: 7 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
                const isActive = i >= (7 - Math.min(streak, 7));
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="text-[9px] text-[var(--bv-muted)] font-medium">{dayName}</span>
                    <div 
                      className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        isActive 
                          ? 'bg-[var(--bv-brand)] text-white shadow-sm ring-2 ring-[var(--bv-brand-soft)]' 
                          : 'bg-[var(--bv-surface-2)] text-[var(--bv-muted)] border border-[var(--bv-line)]'
                      }`}
                      title={`${d.toLocaleDateString()}: ${isActive ? 'Active 🌷' : 'No activity'}`}
                    >
                      {isActive ? '✓' : '·'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Level Achievements Checklist Section */}
          <div className="mt-4 pt-4 border-t border-[var(--bv-line)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[var(--bv-muted)] flex items-center gap-1">
                <Award className="size-3 text-[var(--bv-brand)]" /> Level Achievements
              </span>
              <span className="text-[10px] font-semibold text-[var(--bv-brand)]">
                {LEVEL_MILESTONES.filter(m => xp >= m.xpRequired).length} / {LEVEL_MILESTONES.length} unlocked
              </span>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {LEVEL_MILESTONES.map((milestone) => {
                const isUnlocked = xp >= milestone.xpRequired;
                const dateStr = levelDates[milestone.title] || (isUnlocked ? 'Today' : `Requires ${milestone.xpRequired} XP`);
                return (
                  <div 
                    key={milestone.title}
                    className={`p-2 rounded-xl border flex items-center justify-between text-xs transition-all ${
                      isUnlocked 
                        ? 'bg-[var(--bv-surface-2)]/90 border-[var(--bv-brand)]/40 text-[var(--bv-ink)]' 
                        : 'bg-[var(--bv-surface-2)]/40 border-[var(--bv-line)] text-[var(--bv-muted)] opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">{milestone.icon}</span>
                      <div className="min-w-0">
                        <div className="font-bold truncate text-xs flex items-center gap-1.5">
                          <span>{milestone.title}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--bv-surface)] border border-[var(--bv-line)]">
                            {milestone.xpRequired} XP
                          </span>
                        </div>
                        <span className="text-[10px] text-[var(--bv-muted)]">
                          {isUnlocked ? `Completed: ${dateStr}` : `Locked (${milestone.xpRequired - xp} XP needed)`}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 pl-2">
                      {isUnlocked ? (
                        <span className="size-5 rounded-full bg-[var(--bv-brand)] text-white text-[10px] font-bold grid place-items-center shadow-sm">
                          ✓
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-[var(--bv-muted)] px-2 py-0.5 rounded-full bg-[var(--bv-surface)] border border-[var(--bv-line)]">
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coding Buddies Section */}
          <div className="mt-4 pt-4 border-t border-[var(--bv-line)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[var(--bv-muted)] flex items-center gap-1">
                <Users className="size-3 text-[var(--bv-brand)]" /> Coding Buddies
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`size-2 rounded-full ${lookingForPartner ? 'bg-emerald-500 animate-pulse' : 'bg-[var(--bv-muted)]'}`} />
                <span className="text-[10px] font-semibold text-[var(--bv-ink)]">
                  {lookingForPartner ? 'Partner Search: ON' : 'Partner Search: OFF'}
                </span>
              </div>
            </div>

            {/* Toggle Status Card */}
            <div className="p-3 rounded-2xl bg-[var(--bv-surface-2)]/80 border border-[var(--bv-line)] mb-3 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <div className="text-xs font-bold text-[var(--bv-ink)] flex items-center gap-1">
                  <span>Looking for Partner</span>
                  {lookingForPartner && <Radio className="size-3 text-emerald-500 animate-pulse" />}
                </div>
                <p className="text-[10px] text-[var(--bv-muted)] mt-0.5">
                  {lookingForPartner ? "You're visible to other online builders!" : "Toggle on to match with coding partners."}
                </p>
              </div>
              <button
                onClick={() => setLookingForPartner(!lookingForPartner)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  lookingForPartner ? 'bg-[var(--bv-brand)]' : 'bg-gray-300 dark:bg-zinc-700'
                }`}
                role="switch"
                aria-checked={lookingForPartner}
              >
                <span
                  className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    lookingForPartner ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Online Builders List */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-[var(--bv-muted)] uppercase tracking-wider flex items-center justify-between">
                <span>Builders Online Now ({MOCK_ONLINE_BUILDERS.length})</span>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-normal">Active sync</span>
              </div>
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {MOCK_ONLINE_BUILDERS.map((buddy) => {
                  const isConnected = connectedBuddies[buddy.id];
                  return (
                    <div 
                      key={buddy.id}
                      className="p-2.5 rounded-xl border border-[var(--bv-line)] bg-[var(--bv-surface-2)]/50 hover:bg-[var(--bv-surface-2)] transition flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-8 rounded-xl bg-[var(--bv-surface)] border border-[var(--bv-line)] grid place-items-center text-sm shrink-0 relative">
                          <span>{buddy.avatar}</span>
                          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--bv-surface)]" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-[var(--bv-ink)] truncate flex items-center gap-1.5">
                            <span>{buddy.name}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[var(--bv-surface)] text-[var(--bv-brand)] border border-[var(--bv-line)]">
                              {buddy.level}
                            </span>
                          </div>
                          <p className="text-[10px] text-[var(--bv-muted)] truncate">{buddy.status}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setConnectedBuddies(prev => ({ ...prev, [buddy.id]: true }));
                        }}
                        disabled={isConnected}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition shrink-0 ${
                          isConnected 
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                            : 'bg-[var(--bv-brand)] text-white hover:bg-[var(--bv-brand-strong)] shadow-sm'
                        }`}
                      >
                        {isConnected ? 'Connected! 🎉' : 'Say Hi 👋'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sweet motto */}
          <div className="mt-4 p-2.5 rounded-xl bg-[var(--bv-surface-2)] text-center text-xs font-medium text-[var(--bv-brand)] flex items-center justify-center gap-1.5">
            <Heart className="size-3.5 fill-[var(--bv-brand)]" />
            <span>Progress, not perfection. Every step counts.</span>
          </div>
        </div>

        {/* Share Button */}
        <div className="mt-5">
          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition shadow-sm flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="size-4" /> Link Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="size-4" /> Share My Builder Card
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
