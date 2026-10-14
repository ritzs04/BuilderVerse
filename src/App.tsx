/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LEARNING_PATHS, THINKING_PUZZLES, DEBUG_PUZZLES, GUIDED_PROJECTS, 
  LearningPath, ThinkingPuzzle, DebugPuzzle, GuidedProject, BADGES 
} from './data/builderVerseData';
import { DailyGoal } from './components/DailyGoal';
import { WeeklyGoalStreak } from './components/WeeklyGoalStreak';
import { AvatarGalleryModal, AVATAR_OPTIONS } from './components/AvatarGalleryModal';
import { BuilderCardModal } from './components/BuilderCardModal';
import { LearningGardenModal } from './components/LearningGardenModal';
import { LearningJournalModal } from './components/LearningJournalModal';
import { MascotTip } from './components/MascotTip';
import { ThinkingGymModal } from './components/ThinkingGymModal';
import { DebugGymModal } from './components/DebugGymModal';
import { LessonModal } from './components/LessonModal';
import { ProjectModal } from './components/ProjectModal';
import { AuthModal } from './components/AuthModal';
import { BadgesModal } from './components/BadgesModal';
import { AiMentorModal } from './components/AiMentorModal';
import { RubberDuckModal } from './components/RubberDuckModal';
import { ScratchpadModal } from './components/ScratchpadModal';
import { QaFlashcardsModal } from './components/QaFlashcardsModal';
import { StudyBreakModal } from './components/StudyBreakModal';
import { LevelUpModal } from './components/LevelUpModal';
import { SuggestionModal } from './components/SuggestionModal';
import { GlobalLeaderboard } from './components/GlobalLeaderboard';
import { ProjectRoadmapModal } from './components/ProjectRoadmapModal';
import { BuildOwnProjectModal, OwnProject } from './components/BuildOwnProjectModal';
import { MyBuilderPortfolioModal, PortfolioEntry } from './components/MyBuilderPortfolioModal';
import { GraduationStudioModal } from './components/GraduationStudioModal';
import { CertificateVerifyView } from './components/CertificateVerifyView';
import { IdeaGeneratorModal, GeneratedIdea } from './components/IdeaGeneratorModal';
import { ShowcaseModal } from './components/ShowcaseModal';
import { WeeklyChallengesModal } from './components/WeeklyChallengesModal';
import { triggerProjectConfetti, triggerPathCompleteConfetti } from './utils/confetti';

import { 
  Terminal, Brain, Bug, FolderGit2, BookOpen, Flame, Zap, Trophy, 
  Sun, Moon, ArrowRight, CheckCircle2, Sparkles, Layout, Code2, 
  Globe, GitBranch, MousePointer, ShieldCheck, Play, Heart, User, 
  Calendar, Award, Sprout, Filter, Check, Compass, MapPin
} from 'lucide-react';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('bv_is_dark');
    if (saved !== null) {
      return saved === 'true';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // User progression state with LocalStorage.
  // New builders always start honestly at 0 — no fake demo progress.
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('bv_xp');
    return saved ? parseInt(saved) : 0;
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('bv_streak');
    return saved ? parseInt(saved) : 0;
  });
  const [streakPulse, setStreakPulse] = useState<boolean>(false);

  // 6 PM Daily Goal Reminder state & effect
  const [showGoalReminderBanner, setShowGoalReminderBanner] = useState<boolean>(false);

  useEffect(() => {
    const checkDailyGoalReminder = () => {
      const now = new Date();
      const hour = now.getHours();
      const todayKey = now.toISOString().slice(0, 10);
      const isCompleted = localStorage.getItem('bv_daily_goal_completed') === 'true';
      const alreadyNotified = localStorage.getItem('bv_daily_goal_notified_date') === todayKey;

      if (hour >= 18 && !isCompleted && !alreadyNotified) {
        setShowGoalReminderBanner(true);
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification("BuilderVerse Daily Goal Reminder 🌷", {
            body: "It's past 6 PM! You haven't completed your daily goal yet today. Take 5 minutes to keep your streak alive!",
            icon: "🌷"
          });
        }
        localStorage.setItem('bv_daily_goal_notified_date', todayKey);
      }
    };

    checkDailyGoalReminder();
    const interval = setInterval(checkDailyGoalReminder, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCompleteDailyGoal = () => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const lastStreakDate = localStorage.getItem('bv_last_streak_date');
    if (lastStreakDate !== todayKey) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('bv_streak', newStreak.toString());
      localStorage.setItem('bv_last_streak_date', todayKey);
    }
    setStreakPulse(true);
    setTimeout(() => setStreakPulse(false), 1200);
  };

  // Avatar & Nickname & Builder ID
  const [avatarId, setAvatarId] = useState<string>(() => {
    return localStorage.getItem('bv_user_avatar') || 'student-maya';
  });

  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem('bv_user') || 'Alex';
  });

  const [builderId] = useState<string>(() => {
    let id = localStorage.getItem('bv_builder_id');
    if (!id) {
      id = 'BV-' + Math.floor(1000 + Math.random() * 9000);
      localStorage.setItem('bv_builder_id', id);
    }
    return id;
  });

  const [solvedThinkingIds, setSolvedThinkingIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('bv_solved_thinking');
    return saved ? JSON.parse(saved) : [];
  });

  const [solvedDebugIds, setSolvedDebugIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('bv_solved_debug');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('bv_completed_lessons');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedProjectIds, setCompletedProjectIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('bv_completed_projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [manuallyCompletedPathIds, setManuallyCompletedPathIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('bv_manual_completed_paths');
    return saved ? JSON.parse(saved) : [];
  });

  // Modals state
  const [activePath, setActivePath] = useState<LearningPath | null>(null);
  const [activeThinkingPuzzle, setActiveThinkingPuzzle] = useState<ThinkingPuzzle | null>(null);
  const [activeDebugPuzzle, setActiveDebugPuzzle] = useState<DebugPuzzle | null>(null);
  const [activeProject, setActiveProject] = useState<GuidedProject | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isAvatarGalleryOpen, setIsAvatarGalleryOpen] = useState(false);
  const [isBuilderCardOpen, setIsBuilderCardOpen] = useState(false);
  const [isGardenOpen, setIsGardenOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isAiMentorOpen, setIsAiMentorOpen] = useState(false);
  const [aiMode, setAiMode] = useState<'debug' | 'explain' | 'hint' | 'project'>('explain');
  const [aiContext, setAiContext] = useState('');
  const [aiCode, setAiCode] = useState('');
  const [aiError, setAiError] = useState('');

  const [isRubberDuckOpen, setIsRubberDuckOpen] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isQaFlashcardsOpen, setIsQaFlashcardsOpen] = useState(false);
  const [isStudyBreakOpen, setIsStudyBreakOpen] = useState(false);
  const [studyBreakReason, setStudyBreakReason] = useState("Take a 5-minute breather. The best debugging often happens away from the screen! 🌸");
  const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [isBuildOwnOpen, setIsBuildOwnOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isGraduationOpen, setIsGraduationOpen] = useState(false);
  const [isIdeasOpen, setIsIdeasOpen] = useState(false);
  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);
  const [isChallengesOpen, setIsChallengesOpen] = useState(false);
  const [verifyCertId, setVerifyCertId] = useState<string | null>(null);
  const [ownProjects, setOwnProjects] = useState<OwnProject[]>([]);
  const [portfolioEntries, setPortfolioEntries] = useState<PortfolioEntry[]>([]);
  const [projectDifficultyFilter, setProjectDifficultyFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [levelUpData, setLevelUpData] = useState({
    oldXp: 0,
    newXp: 0,
    oldTitle: 'Curious Beginner',
    newTitle: 'Curious Beginner'
  });

  const handleTriggerBreak = (reason: string) => {
    setStudyBreakReason(reason);
    setIsStudyBreakOpen(true);
  };

  const handleOpenAi = (
    mode: 'debug' | 'explain' | 'hint' | 'project' = 'explain',
    context = '',
    code = '',
    error = ''
  ) => {
    setAiMode(mode);
    setAiContext(context);
    setAiCode(code);
    setAiError(error);
    setIsAiMentorOpen(true);
  };

  // Sync dark class on document and persist to localStorage
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('bv_is_dark', isDark.toString());
  }, [isDark]);

  // Save progress
  useEffect(() => {
    localStorage.setItem('bv_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('bv_solved_thinking', JSON.stringify(solvedThinkingIds));
  }, [solvedThinkingIds]);

  useEffect(() => {
    localStorage.setItem('bv_solved_debug', JSON.stringify(solvedDebugIds));
  }, [solvedDebugIds]);

  useEffect(() => {
    localStorage.setItem('bv_completed_lessons', JSON.stringify(completedLessonIds));
  }, [completedLessonIds]);

  useEffect(() => {
    localStorage.setItem('bv_completed_projects', JSON.stringify(completedProjectIds));
  }, [completedProjectIds]);

  useEffect(() => {
    localStorage.setItem('bv_manual_completed_paths', JSON.stringify(manuallyCompletedPathIds));
  }, [manuallyCompletedPathIds]);

  // Keep own-projects + portfolio entries in sync for cross-feature quick-add.
  useEffect(() => {
    const read = (key: string) => {
      try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    };
    if (isPortfolioOpen || isGraduationOpen) setOwnProjects(read('bv_own_projects'));
    if (isShowcaseOpen) setPortfolioEntries(read('bv_portfolio_entries'));
  }, [isPortfolioOpen, isGraduationOpen, isShowcaseOpen]);

  // Certificate verification route (?verify=CERT_ID) — full-screen view.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('verify');
      if (id) setVerifyCertId(id);
    } catch { /* verification link is best-effort */ }
  }, []);

  /** Save a generated idea as a planning draft in Build My Own Project. */
  const handleSaveIdea = (idea: GeneratedIdea) => {
    let existing: OwnProject[] = [];
    try {
      const saved = localStorage.getItem('bv_own_projects');
      existing = saved ? JSON.parse(saved) : [];
    } catch { /* start fresh */ }
    const draft: OwnProject = {
      id: 'own-idea-' + Date.now(),
      title: idea.title,
      problemStatement: idea.problem,
      whoHasProblem: idea.users,
      whyItMatters: idea.whyUseful,
      features: idea.features,
      technology: idea.language,
      mvpDescription: idea.milestones[0] || '',
      designNotes: '',
      milestones: idea.milestones.map((m, i) => ({ id: `ms-idea-${Date.now()}-${i}`, text: m, done: false })),
      testNotes: '',
      blockers: '',
      reflection: '',
      status: 'planning',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    localStorage.setItem('bv_own_projects', JSON.stringify([draft, ...existing]));
    setOwnProjects([draft, ...existing]);
    onEarnXpRef.current?.(10);
  };

  const handleEarnXp = (amount: number) => {
    const currentXp = xp;
    const nextXp = currentXp + amount;
    const oldTitle = getBuilderLevelRef.current(currentXp);
    const newTitle = getBuilderLevelRef.current(nextXp);

    setXp(nextXp);

    if (newTitle !== oldTitle) {
      setLevelUpData({
        oldXp: currentXp,
        newXp: nextXp,
        oldTitle,
        newTitle
      });
      setIsLevelUpOpen(true);
    }
  };

  const handleSolveThinking = (id: string, reward: number) => {
    if (!solvedThinkingIds.includes(id)) {
      setSolvedThinkingIds(prev => [...prev, id]);
      handleEarnXp(reward);
    }
  };

  const handleSolveDebug = (id: string, reward: number) => {
    if (!solvedDebugIds.includes(id)) {
      setSolvedDebugIds(prev => [...prev, id]);
      handleEarnXp(reward);
    }
  };

  const handleCompleteLesson = (id: string, reward: number) => {
    if (!completedLessonIds.includes(id)) {
      const nextCompleted = [...completedLessonIds, id];
      setCompletedLessonIds(nextCompleted);
      handleEarnXp(reward);

      // Check if any learning path was just fully completed
      const pathFinished = LEARNING_PATHS.some(path => {
        const hasThisLesson = path.lessons.some(l => l.id === id);
        if (!hasThisLesson) return false;
        return path.lessons.every(l => nextCompleted.includes(l.id));
      });

      if (pathFinished) {
        triggerPathCompleteConfetti();
      }
    }
  };

  const handleCompleteProject = (id: string, reward: number) => {
    if (!completedProjectIds.includes(id)) {
      setCompletedProjectIds(prev => [...prev, id]);
      handleEarnXp(reward);
      triggerProjectConfetti();
    }
  };

  const handleTogglePathManualComplete = (pathId: string, xpReward: number) => {
    setManuallyCompletedPathIds(prev => {
      const isAlreadyComplete = prev.includes(pathId);
      if (isAlreadyComplete) {
        return prev.filter(id => id !== pathId);
      } else {
        handleEarnXp(Math.round(xpReward * 0.4));
        triggerPathCompleteConfetti();
        return [...prev, pathId];
      }
    });
  };

  // Determine Builder Level per Master Prompt Section 16
  const getBuilderLevelRef = React.useRef<(points: number) => string>(() => 'Curious Beginner');

  const getBuilderLevel = (points: number) => {
    if (points < 50) return 'Curious Beginner';
    if (points < 120) return 'Idea Explorer';
    if (points < 250) return 'Logic Learner';
    if (points < 450) return 'Project Builder';
    if (points < 700) return 'Creative Coder';
    return 'Confident Creator';
  };

  const currentAvatar = AVATAR_OPTIONS.find(a => a.id === avatarId) || AVATAR_OPTIONS[0];

  // Certificate verification route: render the verify view INSTEAD of the app.
  // placed after all hooks so hooks order stays stable across renders.
  if (verifyCertId) {
    return (
      <CertificateVerifyView
        certId={verifyCertId}
        onBack={() => {
          setVerifyCertId(null);
          window.history.replaceState({}, '', window.location.pathname);
        }}
      />
    );
  }

  // Stable refs so cross-feature callbacks (idea save, challenge submit)
  // always use the latest XP handler and level function.
  getBuilderLevelRef.current = getBuilderLevel;
  const onEarnXpRef = React.useRef(handleEarnXp);
  onEarnXpRef.current = handleEarnXp;

  /** Submit a finished challenge build into Build My Own Project + award XP. */
  const handleSubmitChallengeBuild = (title: string, reflection: string, xpReward: number) => {
    let existing: OwnProject[] = [];
    try {
      const saved = localStorage.getItem('bv_own_projects');
      existing = saved ? JSON.parse(saved) : [];
    } catch { /* start fresh */ }
    const draft: OwnProject = {
      id: 'own-challenge-' + Date.now(),
      title: '[Challenge] ' + title,
      problemStatement: reflection,
      whoHasProblem: '',
      whyItMatters: '',
      features: [],
      technology: '',
      mvpDescription: reflection,
      designNotes: '',
      milestones: [],
      testNotes: '',
      blockers: '',
      reflection,
      status: 'testing',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    localStorage.setItem('bv_own_projects', JSON.stringify([draft, ...existing]));
    setOwnProjects([draft, ...existing]);
    onEarnXpRef.current?.(xpReward);
  };

  const renderPathIcon = (iconName: string) => {
    switch (iconName) {
      case 'layout': return <Layout className="size-5" />;
      case 'code': return <Code2 className="size-5" />;
      case 'sparkles': return <Sparkles className="size-5" />;
      case 'mouse-pointer': return <MousePointer className="size-5" />;
      case 'globe': return <Globe className="size-5" />;
      case 'git-branch': return <GitBranch className="size-5" />;
      default: return <BookOpen className="size-5" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      {/* TOP NAVIGATION BAR */}
      <header 
        className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors"
        style={{
          backgroundColor: isDark ? 'rgba(26, 18, 23, 0.90)' : 'rgba(255, 245, 246, 0.90)',
          borderColor: 'var(--bv-line)'
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a href="#" className="flex items-center gap-2 group whitespace-nowrap shrink-0">
            <span className="grid size-9 place-items-center rounded-xl bg-[var(--bv-brand)] text-white font-extrabold text-base shadow-sm group-hover:scale-105 transition">
              🌷
            </span>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-[var(--bv-ink)]">
                BuilderVerse
              </span>
              <span className="text-[10px] font-semibold text-[var(--bv-muted)] -mt-1 hidden sm:block">
                Learn. Think. Build.
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-[var(--bv-ink-soft)]">
            <a href="#learn" className="hover:text-[var(--bv-brand)] transition whitespace-nowrap shrink-0">Learn</a>
            <a href="#think" className="hover:text-[var(--bv-brand)] transition whitespace-nowrap shrink-0">Thinking Gym</a>
            <a href="#debug" className="hover:text-[var(--bv-brand)] transition whitespace-nowrap shrink-0">Error Companion</a>
            <a href="#build" className="hover:text-[var(--bv-brand)] transition whitespace-nowrap shrink-0">Projects</a>
            <button
              onClick={() => setIsRoadmapOpen(true)}
              className="hover:text-[var(--bv-brand)] transition whitespace-nowrap shrink-0 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Roadmap 🗺️</span>
            </button>
            <a href="#leaderboard" className="hover:text-[var(--bv-brand)] transition whitespace-nowrap shrink-0 flex items-center gap-1">
              <span>Leaderboard 🏆</span>
            </a>
            <a href="#stuck-support" className="text-[var(--bv-brand)] font-bold hover:underline transition whitespace-nowrap shrink-0 flex items-center gap-1">
              <span>Stuck Kit 🧰</span>
            </a>
            <button
              onClick={() => setIsBuildOwnOpen(true)}
              className="hover:text-[var(--bv-brand)] transition whitespace-nowrap shrink-0 flex items-center gap-1"
            >
              <span>Build Mine 🛠️</span>
            </button>
            <button
              onClick={() => setIsPortfolioOpen(true)}
              className="hover:text-[var(--bv-brand)] transition whitespace-nowrap shrink-0 flex items-center gap-1"
            >
              <span>Portfolio 🖼️</span>
            </button>
            <button
              onClick={() => setIsGraduationOpen(true)}
              className="hover:text-[var(--bv-brand)] transition whitespace-nowrap shrink-0 flex items-center gap-1"
            >
              <span>Graduate 🎓</span>
            </button>
            <button
              onClick={() => setIsShowcaseOpen(true)}
              className="hover:text-[var(--bv-brand)] transition whitespace-nowrap shrink-0 flex items-center gap-1"
            >
              <span>Showcase 📣</span>
            </button>
            <button
              onClick={() => setIsChallengesOpen(true)}
              className="hover:text-[var(--bv-brand)] transition whitespace-nowrap shrink-0 flex items-center gap-1"
            >
              <span>Challenges 🏁</span>
            </button>
            <button
              onClick={() => setIsIdeasOpen(true)}
              className="hover:text-[var(--bv-brand)] transition whitespace-nowrap shrink-0 flex items-center gap-1"
            >
              <span>Ideas 💡</span>
            </button>
            <button 
              onClick={() => setIsGardenOpen(true)}
              className="hover:text-[var(--bv-brand)] transition whitespace-nowrap shrink-0"
            >
              Garden 🌸
            </button>
            <button 
              onClick={() => setIsJournalOpen(true)}
              className="hover:text-[var(--bv-brand)] transition whitespace-nowrap shrink-0"
            >
              Journal 📖
            </button>
            <button 
              onClick={() => handleOpenAi('explain', 'General Guidance')}
              className="px-2.5 py-1 rounded-full bg-[var(--bv-brand-soft)] text-[var(--bv-brand)] font-bold hover:bg-[var(--bv-brand)] hover:text-white transition whitespace-nowrap shrink-0 flex items-center gap-1 shadow-xs"
            >
              <span>🌷 Ask AI</span>
            </button>
          </nav>

          {/* Zone 3: Actions & Profile */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* XP & Streak button */}
            <button
              onClick={() => setIsBadgesOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-[var(--bv-line)] bg-[var(--bv-surface)] hover:border-[var(--bv-brand)]/40 transition text-xs ${streakPulse ? 'animate-streak-bounce ring-2 ring-rose-500/50 bg-rose-500/10' : ''}`}
              title="View badges & rewards"
            >
              <Zap className="size-3.5 text-amber-500 fill-amber-500" />
              <span className="font-bold text-[var(--bv-ink)]">{xp} XP</span>
              <span className="text-[var(--bv-line)]">|</span>
              <Flame className={`size-3.5 text-rose-500 fill-rose-500 ${streakPulse ? 'scale-125 transition-transform' : ''}`} />
              <span className={`font-bold text-[var(--bv-ink)] ${streakPulse ? 'text-rose-600 dark:text-rose-400' : ''}`}>{streak}d</span>
            </button>

            {/* Dark Mode Switcher */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl border border-[var(--bv-line)] bg-[var(--bv-surface)] text-[var(--bv-ink-soft)] hover:text-[var(--bv-ink)] transition"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="size-4 text-amber-300" /> : <Moon className="size-4 text-[var(--bv-muted)]" />}
            </button>

            {/* Avatar & Profile Card Shortcut */}
            <button
              onClick={() => setIsBuilderCardOpen(true)}
              className="flex items-center gap-2 p-1 sm:pr-3 sm:pl-1.5 rounded-xl bg-[var(--bv-surface)] border border-[var(--bv-line)] hover:border-[var(--bv-brand)]/50 transition"
              title="Open My Builder Card"
            >
              <div 
                className="size-7 rounded-lg grid place-items-center text-sm shadow-xs"
                style={{ backgroundColor: currentAvatar.badgeBg }}
              >
                {currentAvatar.emoji}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-[var(--bv-ink)]">
                {username}
              </span>
            </button>

            {/* Avatar customization button */}
            <button
              onClick={() => setIsAvatarGalleryOpen(true)}
              className="hidden lg:flex px-3 py-1.5 rounded-xl bg-[var(--bv-surface-2)] text-[var(--bv-brand)] hover:bg-[var(--bv-brand)] hover:text-white text-xs font-bold transition items-center gap-1"
            >
              <span>Change Avatar</span>
            </button>

            {/* Primary Action Button */}
            <a
              href="#learn"
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition shadow-sm whitespace-nowrap"
            >
              Start Free
            </a>
          </div>
        </div>
      </header>

      {/* ⏰ 6 PM DAILY GOAL REMINDER BANNER */}
      {showGoalReminderBanner && localStorage.getItem('bv_daily_goal_completed') !== 'true' && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-3 text-xs text-[var(--bv-ink)] flex items-center justify-between gap-4 sticky top-16 z-30 backdrop-blur-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-base">⏰</span>
            <span>Reminder: It's past 6 PM and your Daily Goal isn't checked off yet today! Take 5 minutes to earn +20 XP and keep your streak going. 🌸</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="#learn"
              onClick={() => setShowGoalReminderBanner(false)}
              className="px-3 py-1.5 rounded-lg bg-[var(--bv-brand)] text-white font-bold hover:bg-[var(--bv-brand-strong)] transition shadow-xs"
            >
              Do Goal Now
            </a>
            <button
              onClick={() => setShowGoalReminderBanner(false)}
              className="text-[var(--bv-muted)] hover:text-[var(--bv-ink)] px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            {/* Supporting phrase from Part 3 */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--bv-surface-2)] text-[var(--bv-brand)] text-xs font-bold border border-[var(--bv-line)]">
              <span>🌸 Beginner today. Builder tomorrow.</span>
            </div>

            {/* Main Title from Part 3 */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--bv-ink)] leading-[1.18]">
              Your ideas deserve to <span className="text-[var(--bv-brand)]">become real. 🌷</span>
            </h1>

            {/* Description from Part 3 */}
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-[var(--bv-muted)] leading-relaxed">
              Learn to code, strengthen your thinking, and build real projects one small step at a time. You don't need to know everything to begin.
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="#learn"
                className="px-6 py-3 rounded-2xl bg-[var(--bv-brand)] text-white text-sm font-bold hover:bg-[var(--bv-brand-strong)] transition shadow-md flex items-center gap-2"
              >
                Start Building Free <ArrowRight className="size-4" />
              </a>
              <a
                href="#think"
                className="px-6 py-3 rounded-2xl bg-[var(--bv-surface)] border border-[var(--bv-line)] text-sm font-bold hover:bg-[var(--bv-surface-2)] transition text-[var(--bv-ink)]"
              >
                Explore Lessons & Puzzles
              </a>
            </div>

            {/* 3-Step Journey from Part 3 */}
            <div className="pt-6 flex items-center justify-center gap-3 text-xs font-bold text-[var(--bv-ink-soft)]">
              <span className="px-3 py-1 rounded-lg bg-[var(--bv-surface)] border border-[var(--bv-line)]">1. Learn</span>
              <span className="text-[var(--bv-muted)]">→</span>
              <span className="px-3 py-1 rounded-lg bg-[var(--bv-surface)] border border-[var(--bv-line)]">2. Practise</span>
              <span className="text-[var(--bv-muted)]">→</span>
              <span className="px-3 py-1 rounded-lg bg-[var(--bv-surface)] border border-[var(--bv-line)]">3. Build</span>
            </div>
          </div>
        </section>

        {/* 🌟 DAILY GOAL COMPONENT — DIRECTLY BELOW HERO 🌟 */}
        <DailyGoal onEarnXp={handleEarnXp} userXp={xp} onGoalCompleted={handleCompleteDailyGoal} />

        {/* 🌟 WEEKLY GOAL STREAK (7-DAY HABIT CALENDAR) 🌟 */}
        <WeeklyGoalStreak 
          streak={streak} 
          onCompleteToday={handleCompleteDailyGoal} 
          onEarnXp={handleEarnXp} 
        />

        {/* MASCOT TIP */}
        <MascotTip 
          level={getBuilderLevel(xp)} 
          onOpenGarden={() => setIsGardenOpen(true)}
          onOpenAvatar={() => setIsAvatarGalleryOpen(true)}
        />

        {/* 🆘 STUCK STUDENT SUPPORT & DIAGNOSTIC HUB 🆘 */}
        <section id="stuck-support" className="py-14 px-4 sm:px-6 border-t border-[var(--bv-line)] bg-gradient-to-b from-[var(--bv-surface-2)]/50 to-[var(--bv-surface)]">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bv-brand-soft)] text-[var(--bv-brand)] text-xs font-bold border border-[var(--bv-brand)]/20">
                  <span>🧰 Stuck Student Emergency Kit</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--bv-ink)]">
                  Stuck or confused? We’ve got your back. 🌷
                </h2>
                <p className="text-xs sm:text-sm text-[var(--bv-muted)] max-w-2xl leading-relaxed">
                  Every programmer gets stuck. Don’t panic or stare at the screen — use these 5 interactive diagnosis tools to untangle your code one clear step at a time.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAi('explain', 'Stuck Student Guidance')}
                  className="px-4 py-2 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition shadow-sm flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Ask Sprout AI</span>
                  <Sparkles className="size-3.5" />
                </button>
              </div>
            </div>

            {/* 6 Diagnostic Support Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Tool 1: Explain this Line Code Hover */}
              <div className="p-6 rounded-3xl border border-[var(--bv-line)] bg-[var(--bv-surface)] shadow-xs hover:shadow-md transition flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-2xl bg-amber-500/10 text-2xl">
                      🔍
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
                      Line Explainer
                    </span>
                  </div>

                  <h3 className="mt-4 font-bold text-base text-[var(--bv-ink)] group-hover:text-[var(--bv-brand)] transition">
                    "Explain this Line" Code Hover
                  </h3>
                  <p className="mt-1 text-xs text-[var(--bv-muted)] leading-relaxed">
                    Hover or tap any line of code in lesson blueprints for a one-sentence human explanation of what that exact line does.
                  </p>

                  {/* Interactive Mini Demo */}
                  <div className="mt-4 p-3 rounded-xl bg-zinc-950 font-mono text-[11px] border border-zinc-800 text-zinc-300 space-y-1">
                    <div 
                      onClick={() => setActivePath(LEARNING_PATHS[1])}
                      className="p-1 rounded hover:bg-zinc-800/80 cursor-pointer text-emerald-400 flex items-center justify-between"
                      title="Click to open lesson"
                    >
                      <code>const ready = users.filter(u =&gt; u.active);</code>
                      <span className="text-[10px] text-amber-300 font-sans">💡 Hover tip</span>
                    </div>
                    <p className="text-[10px] text-purple-300 font-sans italic border-t border-zinc-800 pt-1">
                      "Evaluates a truthy check and keeps matching elements."
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActivePath(LEARNING_PATHS[0])}
                  className="mt-5 pt-3 border-t border-[var(--bv-line)] text-xs font-bold text-[var(--bv-brand)] flex items-center justify-between group-hover:translate-x-0.5 transition"
                >
                  <span>Open Code Blueprint Lessons</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>

              {/* Tool 2: Interactive Scratchpad / Sandbox */}
              <div className="p-6 rounded-3xl border border-[var(--bv-line)] bg-[var(--bv-surface)] shadow-xs hover:shadow-md transition flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-2xl bg-indigo-500/10 text-2xl">
                      🧪
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600">
                      Live Playground
                    </span>
                  </div>

                  <h3 className="mt-4 font-bold text-base text-[var(--bv-ink)] group-hover:text-[var(--bv-brand)] transition">
                    Interactive Scratchpad & Lab
                  </h3>
                  <p className="mt-1 text-xs text-[var(--bv-muted)] leading-relaxed">
                    Test a single JavaScript function or tweak real-time CSS Flexbox & Box Model rules safely before adding them to your project.
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-[11px] text-[var(--bv-ink-soft)] space-y-1">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--bv-brand)]">
                      <span>✓</span> <span>Safe Function Sandbox</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--bv-brand)]">
                      <span>✓</span> <span>Live Visual Box Model & Flex Centering</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsScratchpadOpen(true)}
                  className="mt-5 pt-3 border-t border-[var(--bv-line)] text-xs font-bold text-[var(--bv-brand)] flex items-center justify-between group-hover:translate-x-0.5 transition"
                >
                  <span>Launch Scratchpad Sandbox</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>

              {/* Tool 3: Step-by-Step Rubber Duck Debugger */}
              <div className="p-6 rounded-3xl border border-[var(--bv-line)] bg-[var(--bv-surface)] shadow-xs hover:shadow-md transition flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-2xl bg-amber-500/15 text-2xl">
                      🐥
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-700 dark:text-amber-300">
                      3-Step Checklist
                    </span>
                  </div>

                  <h3 className="mt-4 font-bold text-base text-[var(--bv-ink)] group-hover:text-[var(--bv-brand)] transition">
                    Rubber Duck 3-Step Debugger
                  </h3>
                  <p className="mt-1 text-xs text-[var(--bv-muted)] leading-relaxed">
                    The interactive 3-step diagnostic routine: check console, test bracket balancing {"{, (, ["}, and log variables right before the error.
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs text-[var(--bv-ink-soft)]">
                    <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[var(--bv-surface-2)]/60 text-[11px]">
                      <span className="font-bold text-[var(--bv-brand)]">1.</span> DevTools Console Checker
                    </div>
                    <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[var(--bv-surface-2)]/60 text-[11px]">
                      <span className="font-bold text-[var(--bv-brand)]">2.</span> Live Bracket Matcher Scanner
                    </div>
                    <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[var(--bv-surface-2)]/60 text-[11px]">
                      <span className="font-bold text-[var(--bv-brand)]">3.</span> console.log() Placement Guide
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsRubberDuckOpen(true)}
                  className="mt-5 pt-3 border-t border-[var(--bv-line)] text-xs font-bold text-[var(--bv-brand)] flex items-center justify-between group-hover:translate-x-0.5 transition"
                >
                  <span>Start Duck Diagnosis</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>

              {/* Tool 4: Peer Help / Guided Q&A Flashcards */}
              <div className="p-6 rounded-3xl border border-[var(--bv-line)] bg-[var(--bv-surface)] shadow-xs hover:shadow-md transition flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-2xl bg-rose-500/10 text-2xl">
                      🗂️
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600">
                      FAQ Flashcards
                    </span>
                  </div>

                  <h3 className="mt-4 font-bold text-base text-[var(--bv-ink)] group-hover:text-[var(--bv-brand)] transition">
                    Peer Help & Guided Q&A
                  </h3>
                  <p className="mt-1 text-xs text-[var(--bv-muted)] leading-relaxed">
                    Interactive flip cards for common beginner traps: "Why did my image not load?", "Why isn't click firing?", "Why 10 + '5' is 105?".
                  </p>

                  <div className="mt-4 p-3 rounded-2xl border border-[var(--bv-line)] bg-[var(--bv-surface-2)]/50 text-xs space-y-1">
                    <p className="font-semibold text-[var(--bv-ink)] text-[11px]">Featured card:</p>
                    <p className="text-[11px] text-[var(--bv-muted)] italic">
                      "Why does my form submit reload the whole webpage?"
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsQaFlashcardsOpen(true)}
                  className="mt-5 pt-3 border-t border-[var(--bv-line)] text-xs font-bold text-[var(--bv-brand)] flex items-center justify-between group-hover:translate-x-0.5 transition"
                >
                  <span>Browse Q&A Cards (6 Topics)</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>

              {/* Tool 5: Study Break & Breathing Reminder */}
              <div className="p-6 rounded-3xl border border-[var(--bv-line)] bg-[var(--bv-surface)] shadow-xs hover:shadow-md transition flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-2xl bg-emerald-500/10 text-2xl">
                      🍵
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                      Mindful Reset
                    </span>
                  </div>

                  <h3 className="mt-4 font-bold text-base text-[var(--bv-ink)] group-hover:text-[var(--bv-brand)] transition">
                    Study Break & Breathing Reminder
                  </h3>
                  <p className="mt-1 text-xs text-[var(--bv-muted)] leading-relaxed">
                    A gentle 4-7-8 breathing circle. Activates automatically if you attempt a puzzle 3+ times without success, or whenever your brain needs rest.
                  </p>

                  <div className="mt-4 p-3 rounded-2xl bg-[var(--bv-surface-2)]/50 border border-[var(--bv-line)] text-[11px] text-[var(--bv-ink-soft)] space-y-1">
                    <p className="font-semibold text-[var(--bv-brand)]">The Subconscious Effect:</p>
                    <p className="text-[10px] text-[var(--bv-muted)]">
                      The best debugging often happens away from the screen when your mind enters diffuse mode!
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleTriggerBreak("Take a 5-minute tea break. The best debugging often happens away from the screen. 🌸")}
                  className="mt-5 pt-3 border-t border-[var(--bv-line)] text-xs font-bold text-[var(--bv-brand)] flex items-center justify-between group-hover:translate-x-0.5 transition"
                >
                  <span>Take a 5-Min Reset Now</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>

              {/* Tool 6: Sprout AI Coding Companion */}
              <div className="p-6 rounded-3xl border border-[var(--bv-brand)]/40 bg-[var(--bv-brand-soft)]/20 shadow-xs hover:shadow-md transition flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-2xl bg-[var(--bv-brand-soft)] text-2xl">
                      🌷
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--bv-brand)] text-white">
                      Gemini 3.8 Flash
                    </span>
                  </div>

                  <h3 className="mt-4 font-bold text-base text-[var(--bv-ink)] group-hover:text-[var(--bv-brand)] transition">
                    Sprout AI Companion
                  </h3>
                  <p className="mt-1 text-xs text-[var(--bv-muted)] leading-relaxed">
                    Ask questions with zero fear. Sprout explains confusing code with relatable everyday analogies (cooking recipes, watering plants).
                  </p>

                  <div className="mt-4 p-3 rounded-2xl bg-[var(--bv-surface)] border border-[var(--bv-line)] text-[11px] text-[var(--bv-ink-soft)] space-y-1">
                    <span className="font-bold text-[var(--bv-brand)]">Modes available:</span>
                    <p className="text-[10px] text-[var(--bv-muted)]">
                      💡 Explain Concept · 🐛 Diagnose Bug · 🧠 Socratic Hint · 🛠️ Break Down Steps
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenAi('explain', 'Stuck Student Guidance')}
                  className="mt-5 pt-3 border-t border-[var(--bv-line)] text-xs font-bold text-[var(--bv-brand)] flex items-center justify-between group-hover:translate-x-0.5 transition"
                >
                  <span>Open Sprout AI Chat</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: STRUCTURED PATHS */}
        <section id="learn" className="py-14 px-4 sm:px-6 border-t border-[var(--bv-line)] bg-[var(--bv-surface-2)]/30">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)]">
                Structured Paths
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--bv-ink)]">
                Nine paths. One goal: real skill.
              </h2>
              <p className="text-sm text-[var(--bv-muted)] max-w-2xl">
                Every lesson ends with a supportive mini quiz, so completing a path means you can actually use it — not just recognize it.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {LEARNING_PATHS.map(path => {
                const totalLessons = path.lessons.length;
                const completedCount = path.lessons.filter(l => completedLessonIds.includes(l.id)).length;
                const isLessonsComplete = completedCount === totalLessons && totalLessons > 0;
                const isManuallyCompleted = manuallyCompletedPathIds.includes(path.id);
                const isCompleted = isLessonsComplete || isManuallyCompleted;
                const rawPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
                const percent = isCompleted ? 100 : rawPercent;

                return (
                  <div
                    key={path.id}
                    onClick={() => setActivePath(path)}
                    className="group relative cursor-pointer p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
                    style={{
                      backgroundColor: 'var(--bv-surface)',
                      borderColor: isCompleted ? 'var(--bv-success)' : 'var(--bv-line)'
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span 
                          className="grid size-11 place-items-center rounded-xl text-white shadow-xs"
                          style={{ backgroundColor: path.badgeColor }}
                        >
                          {renderPathIcon(path.icon)}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          {/* Manual Completion Toggle Button / Checkbox */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTogglePathManualComplete(path.id, path.xpReward);
                            }}
                            className={`group/btn flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border select-none ${
                              isCompleted
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 shadow-xs'
                                : 'bg-[var(--bv-surface-2)]/80 border-[var(--bv-line)] text-[var(--bv-muted)] hover:text-[var(--bv-ink)] hover:border-[var(--bv-brand)]/40'
                            }`}
                            title={isCompleted ? "Click to unmark complete" : "Manually mark this learning path as complete"}
                            aria-label={`Mark ${path.title} complete`}
                          >
                            <span className={`size-3.5 rounded flex items-center justify-center border transition ${
                              isCompleted
                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                : 'border-[var(--bv-line-strong)] bg-[var(--bv-surface)] group-hover/btn:border-[var(--bv-brand)]'
                            }`}>
                              {isCompleted && <Check className="size-2.5 stroke-[3]" />}
                            </span>
                            <span className="text-[11px] font-bold">
                              {isCompleted ? 'Complete' : 'Mark Done'}
                            </span>
                          </button>

                          <span className="text-xs font-bold text-[var(--bv-brand)] bg-[var(--bv-brand-soft)] px-2.5 py-1 rounded-full">
                            {totalLessons} {totalLessons === 1 ? 'Lesson' : 'Lessons'}
                          </span>
                        </div>
                      </div>

                      <h3 className="mt-4 text-lg font-bold text-[var(--bv-ink)] group-hover:text-[var(--bv-brand)] transition">
                        {path.title}
                      </h3>
                      <p className="text-xs font-semibold text-[var(--bv-brand)] mt-0.5">
                        {path.tagline}
                      </p>
                      <p className="mt-2 text-xs text-[var(--bv-muted)] leading-relaxed line-clamp-2">
                        {path.description}
                      </p>

                      {/* Visual Progress Bar Section */}
                      <div className="mt-4 p-3 rounded-xl bg-[var(--bv-surface-2)]/60 border border-[var(--bv-line)]/70 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[var(--bv-ink-soft)] text-[11px]">
                            {isManuallyCompleted && !isLessonsComplete ? (
                              <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                                {completedCount} of {totalLessons} lessons · Manually complete ✨
                              </span>
                            ) : (
                              <span>{completedCount} of {totalLessons} lessons completed</span>
                            )}
                          </span>
                          <span className={`text-xs font-extrabold ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--bv-brand)]'}`}>
                            {percent}%
                          </span>
                        </div>
                        {/* Progress Bar Track */}
                        <div className="w-full bg-[var(--bv-surface)] h-2 rounded-full overflow-hidden border border-[var(--bv-line)]">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ease-out ${
                              isCompleted 
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                                : percent > 0 
                                  ? 'bg-[var(--bv-brand)]' 
                                  : 'bg-transparent'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-[var(--bv-line)] flex items-center justify-between text-xs font-bold">
                      <span className="text-[var(--bv-ink-soft)]">+{path.xpReward} XP reward</span>
                      <span className="text-[var(--bv-brand)] flex items-center gap-1 group-hover:translate-x-1 transition">
                        {isCompleted ? 'Review Lessons' : percent > 0 ? 'Continue Path' : 'Start Lesson'} <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 2: THINKING GYM */}
        <section id="think" className="py-16 px-4 sm:px-6 border-t border-[var(--bv-line)]">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)]">
                  <Brain className="size-4" /> Thinking Gym
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--bv-ink)]">
                  Give your brain a little workout. 🧠
                </h2>
                <p className="text-sm text-[var(--bv-muted)] max-w-2xl">
                  Explore puzzles, discover patterns, and practise solving problems one step at a time.
                </p>
              </div>

              <div className="flex gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-xs font-semibold text-[var(--bv-ink-soft)]">
                  3 Interactive Puzzles Ready
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {THINKING_PUZZLES.map(puzzle => {
                const isSolved = solvedThinkingIds.includes(puzzle.id);

                return (
                  <div
                    key={puzzle.id}
                    onClick={() => setActiveThinkingPuzzle(puzzle)}
                    className="group cursor-pointer p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
                    style={{
                      backgroundColor: 'var(--bv-surface)',
                      borderColor: isSolved ? 'var(--bv-success)' : 'var(--bv-line)'
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">🧠</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                            +{puzzle.xp} XP
                          </span>
                          {isSolved && (
                            <span className="text-xs font-bold text-[var(--bv-success)] bg-[var(--bv-success-soft)] px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="size-3" /> Solved
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="mt-4 text-base font-bold text-[var(--bv-ink)] group-hover:text-[var(--bv-brand)] transition">
                        {puzzle.title}
                      </h3>
                      <p className="mt-2 text-xs text-[var(--bv-muted)] leading-relaxed line-clamp-3">
                        {puzzle.question}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[var(--bv-line)] flex items-center justify-between text-xs font-bold">
                      <span className="text-[var(--bv-brand)]">{puzzle.difficulty}</span>
                      <span className="text-[var(--bv-brand)] flex items-center gap-1 group-hover:translate-x-1 transition">
                        Try Puzzle <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 3: ERROR COMPANION & DEBUGGING */}
        <section id="debug" className="py-16 px-4 sm:px-6 border-t border-[var(--bv-line)] bg-[var(--bv-surface-2)]/30">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)]">
                <Bug className="size-4" /> Error Companion
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--bv-ink)]">
                Found a bug? Let's figure it out together.
              </h2>
              <p className="text-sm text-[var(--bv-muted)] max-w-2xl">
                An error doesn't mean you can't code. It gives us a clue about what to try next.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {DEBUG_PUZZLES.map(puzzle => {
                const isSolved = solvedDebugIds.includes(puzzle.id);

                return (
                  <div
                    key={puzzle.id}
                    onClick={() => setActiveDebugPuzzle(puzzle)}
                    className="cursor-pointer group p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
                    style={{
                      backgroundColor: 'var(--bv-surface)',
                      borderColor: isSolved ? 'var(--bv-success)' : 'var(--bv-line)'
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--bv-surface-2)] text-[var(--bv-brand)]">
                          {puzzle.bugType}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                            +{puzzle.xp} XP
                          </span>
                          {isSolved && <CheckCircle2 className="size-4 text-[var(--bv-success)]" />}
                        </div>
                      </div>

                      <h3 className="mt-3 font-bold text-sm text-[var(--bv-ink)]">{puzzle.title}</h3>

                      {/* Code preview block */}
                      <div className="mt-3 p-3 rounded-xl bg-zinc-950 font-mono text-[11px] text-zinc-300 overflow-x-auto leading-relaxed border border-zinc-800">
                        <pre><code>{puzzle.buggyCode}</code></pre>
                      </div>

                      <div className="mt-3 flex items-start gap-2 text-[11px] text-[var(--bv-danger)] font-mono">
                        <Terminal className="size-3.5 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{puzzle.consoleError}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[var(--bv-line)] flex items-center justify-between text-xs font-bold">
                      <span className="text-[var(--bv-muted)]">{isSolved ? 'Resolved' : 'Needs attention'}</span>
                      <span className="text-[var(--bv-brand)] flex items-center gap-1 group-hover:translate-x-1 transition">
                        Fix in Sandbox <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 4: GUIDED PROJECTS */}
        <section id="build" className="py-16 px-4 sm:px-6 border-t border-[var(--bv-line)]">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)]">
                  <FolderGit2 className="size-4" /> Guided Projects
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--bv-ink)]">
                  Small ideas can become amazing projects.
                </h2>
                <p className="text-sm text-[var(--bv-muted)] max-w-2xl">
                  Choose a project, follow the steps, and bring your idea to life. Filter by experience level to find the challenge that fits your goals today.
                </p>
              </div>

              {/* Quick completed counter & Roadmap Button */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsRoadmapOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Compass className="size-3.5" />
                  <span>Project Roadmap</span>
                </button>
                <span className="px-3.5 py-1.5 rounded-xl bg-[var(--bv-surface)] border border-[var(--bv-line)] text-xs font-semibold text-[var(--bv-ink-soft)] flex items-center gap-2 shadow-xs">
                  <Trophy className="size-3.5 text-amber-500" />
                  <span>{completedProjectIds.length} of {GUIDED_PROJECTS.length} Built</span>
                </span>
              </div>
            </div>

            {/* Filter System: Beginner, Intermediate, Advanced */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="p-1 rounded-2xl bg-[var(--bv-surface-2)]/60 border border-[var(--bv-line)] flex flex-wrap items-center gap-1.5">
                <div className="px-3 py-1 text-xs font-bold text-[var(--bv-muted)] flex items-center gap-1.5 hidden sm:flex">
                  <Filter className="size-3.5 text-[var(--bv-brand)]" />
                  <span>Level:</span>
                </div>
                {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(tab => {
                  const isActive = projectDifficultyFilter === tab;
                  const count = tab === 'All' 
                    ? GUIDED_PROJECTS.length 
                    : GUIDED_PROJECTS.filter(p => p.difficulty === tab).length;

                  return (
                    <button
                      key={tab}
                      onClick={() => setProjectDifficultyFilter(tab)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-[var(--bv-brand)] text-white shadow-xs'
                          : 'bg-[var(--bv-surface)] text-[var(--bv-ink-soft)] border border-[var(--bv-line)] hover:bg-[var(--bv-surface-2)]'
                      }`}
                    >
                      <span>{tab}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive 
                          ? 'bg-white/25 text-white' 
                          : 'bg-[var(--bv-surface-2)] text-[var(--bv-muted)]'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {projectDifficultyFilter !== 'All' && (
                <button
                  onClick={() => setProjectDifficultyFilter('All')}
                  className="text-xs text-[var(--bv-muted)] hover:text-[var(--bv-brand)] font-semibold px-2 py-1 transition cursor-pointer"
                >
                  Reset filter
                </button>
              )}
            </div>

            {/* Filtered Projects Grid or Empty State */}
            {(() => {
              const filteredProjects = GUIDED_PROJECTS.filter(project => {
                if (projectDifficultyFilter === 'All') return true;
                return project.difficulty === projectDifficultyFilter;
              });

              if (filteredProjects.length === 0) {
                return (
                  <div className="p-10 rounded-2xl border border-[var(--bv-line)] bg-[var(--bv-surface)] text-center space-y-3">
                    <p className="text-sm font-semibold text-[var(--bv-muted)]">
                      No projects currently found for "{projectDifficultyFilter}".
                    </p>
                    <button
                      onClick={() => setProjectDifficultyFilter('All')}
                      className="px-4 py-2 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)]"
                    >
                      View All Projects
                    </button>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProjects.map(project => {
                    const isCompleted = completedProjectIds.includes(project.id);
                    const difficultyBadgeClass = 
                      project.difficulty === 'Beginner'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25'
                        : project.difficulty === 'Intermediate'
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25'
                        : 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/25';

                    return (
                      <div
                        key={project.id}
                        onClick={() => setActiveProject(project)}
                        className="group cursor-pointer p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
                        style={{
                          backgroundColor: 'var(--bv-surface)',
                          borderColor: isCompleted ? 'var(--bv-success)' : 'var(--bv-line)'
                        }}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <span className="grid size-11 place-items-center rounded-xl bg-[var(--bv-surface-2)] text-[var(--bv-brand)] border border-[var(--bv-line)]">
                              <Play className="size-5" />
                            </span>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${difficultyBadgeClass}`}>
                                {project.difficulty}
                              </span>
                              {isCompleted && (
                                <span className="text-xs font-bold text-[var(--bv-success)] bg-[var(--bv-success-soft)] px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <CheckCircle2 className="size-3" /> Built
                                </span>
                              )}
                            </div>
                          </div>

                          <h3 className="mt-4 font-bold text-base text-[var(--bv-ink)] group-hover:text-[var(--bv-brand)] transition">
                            {project.title}
                          </h3>
                          <p className="mt-1 text-xs text-[var(--bv-muted)] line-clamp-2">
                            {project.tagline}
                          </p>
                          <p className="mt-3 text-xs text-[var(--bv-ink-soft)] line-clamp-2 leading-relaxed">
                            {project.bulletSummary.join(' · ')}
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-[var(--bv-line)] flex items-center justify-between text-xs font-bold">
                          <span className="text-amber-600">+{project.xp} XP</span>
                          <span className="text-[var(--bv-brand)] flex items-center gap-1 group-hover:translate-x-1 transition">
                            View Demo <ArrowRight className="size-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </section>

        {/* SECTION: GLOBAL LEADERBOARD */}
        <GlobalLeaderboard 
          currentUser={{
            username,
            xp,
            streak,
            avatar: currentAvatar.emoji,
            level: getBuilderLevel(xp),
            builderId
          }}
        />

        {/* SECTION 5: BUILDER WORLD DASHBOARD SHORTCUTS */}
        <section className="py-16 px-4 sm:px-6 border-t border-[var(--bv-line)] bg-[var(--bv-surface-2)]/30">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)]">
                Your Learning World
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--bv-ink)]">
                Explore your personal workspace
              </h2>
              <p className="text-sm text-[var(--bv-muted)]">
                Everything you need to reflect, personalize your identity, and nurture your growth.
              </p>
            </div>

            {/* AI Mentor Banner */}
            <div 
              onClick={() => handleOpenAi('explain', 'General Guidance')}
              className="p-6 rounded-3xl border border-[var(--bv-brand)]/30 bg-[var(--bv-surface)] cursor-pointer hover:shadow-md transition flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <span className="grid size-14 place-items-center rounded-2xl bg-[var(--bv-brand-soft)] text-3xl shrink-0">
                  🌷
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--bv-brand)]">Always Here For You</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bv-brand-soft)] text-[var(--bv-brand)] font-bold">Powered by Gemini AI</span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--bv-ink)] mt-0.5">Sprout AI — The Gentle Coding Mentor</h3>
                  <p className="text-xs text-[var(--bv-muted)] max-w-xl mt-1">
                    Feeling stuck? Get everyday analogies, step-by-step bug diagnostics, or gentle hints without spoilers. No judgment, only learning.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl bg-[var(--bv-brand)] text-white text-xs font-bold hover:bg-[var(--bv-brand-strong)] transition whitespace-nowrap shadow-sm shrink-0 flex items-center gap-2"
              >
                <span>Ask Sprout AI Now</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Avatar */}
              <div
                onClick={() => setIsAvatarGalleryOpen(true)}
                className="cursor-pointer p-5 rounded-2xl border transition hover:-translate-y-1 hover:shadow-sm flex flex-col justify-between"
                style={{ backgroundColor: 'var(--bv-surface)', borderColor: 'var(--bv-line)' }}
              >
                <div>
                  <div className="text-3xl mb-3">{currentAvatar.emoji}</div>
                  <h3 className="font-bold text-sm text-[var(--bv-ink)]">Builder Avatar</h3>
                  <p className="text-xs text-[var(--bv-muted)] mt-1.5 leading-relaxed">
                    Choose from friendly students, coding animals, and cute robots.
                  </p>
                </div>
                <span className="mt-4 text-xs font-bold text-[var(--bv-brand)] flex items-center gap-1">
                  Change Avatar <ArrowRight className="size-3" />
                </span>
              </div>

              {/* Card 2: Builder Card */}
              <div
                onClick={() => setIsBuilderCardOpen(true)}
                className="cursor-pointer p-5 rounded-2xl border transition hover:-translate-y-1 hover:shadow-sm flex flex-col justify-between"
                style={{ backgroundColor: 'var(--bv-surface)', borderColor: 'var(--bv-line)' }}
              >
                <div>
                  <div className="text-3xl mb-3">🪪</div>
                  <h3 className="font-bold text-sm text-[var(--bv-ink)]">My Builder Card</h3>
                  <p className="text-xs text-[var(--bv-muted)] mt-1.5 leading-relaxed">
                    Your personalized profile card with your unique ID ({builderId}).
                  </p>
                </div>
                <span className="mt-4 text-xs font-bold text-[var(--bv-brand)] flex items-center gap-1">
                  View Card <ArrowRight className="size-3" />
                </span>
              </div>

              {/* Card 3: Project Roadmap */}
              <div
                onClick={() => setIsRoadmapOpen(true)}
                className="cursor-pointer p-5 rounded-2xl border-2 border-[var(--bv-brand)]/40 bg-[var(--bv-brand-soft)]/20 transition hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl mb-3">🗺️</div>
                  <h3 className="font-bold text-sm text-[var(--bv-ink)] flex items-center gap-1">
                    <span>Project Roadmap</span>
                    <span className="text-[9px] font-extrabold bg-[var(--bv-brand)] text-white px-1.5 py-0.2 rounded-full">New</span>
                  </h3>
                  <p className="text-xs text-[var(--bv-muted)] mt-1.5 leading-relaxed">
                    Architectural milestones guiding you from syntax to production apps.
                  </p>
                </div>
                <span className="mt-4 text-xs font-bold text-[var(--bv-brand)] flex items-center gap-1">
                  Open Roadmap <ArrowRight className="size-3" />
                </span>
              </div>

              {/* Card 4: Learning Garden */}
              <div
                onClick={() => setIsGardenOpen(true)}
                className="cursor-pointer p-5 rounded-2xl border transition hover:-translate-y-1 hover:shadow-sm flex flex-col justify-between"
                style={{ backgroundColor: 'var(--bv-surface)', borderColor: 'var(--bv-line)' }}
              >
                <div>
                  <div className="text-3xl mb-3">🌸</div>
                  <h3 className="font-bold text-sm text-[var(--bv-ink)]">Learning Garden</h3>
                  <p className="text-xs text-[var(--bv-muted)] mt-1.5 leading-relaxed">
                    Watch your coding achievements bloom as flowers and trees.
                  </p>
                </div>
                <span className="mt-4 text-xs font-bold text-[var(--bv-brand)] flex items-center gap-1">
                  Visit Garden <ArrowRight className="size-3" />
                </span>
              </div>

              {/* Card 5: Journal & Idea Box */}
              <div
                onClick={() => setIsJournalOpen(true)}
                className="cursor-pointer p-5 rounded-2xl border transition hover:-translate-y-1 hover:shadow-sm flex flex-col justify-between"
                style={{ backgroundColor: 'var(--bv-surface)', borderColor: 'var(--bv-line)' }}
              >
                <div>
                  <div className="text-3xl mb-3">📖</div>
                  <h3 className="font-bold text-sm text-[var(--bv-ink)]">Journal & Ideas</h3>
                  <p className="text-xs text-[var(--bv-muted)] mt-1.5 leading-relaxed">
                    Private learning notes, tricky concepts to review, and project ideas.
                  </p>
                </div>
                <span className="mt-4 text-xs font-bold text-[var(--bv-brand)] flex items-center gap-1">
                  Open Space <ArrowRight className="size-3" />
                </span>
              </div>

              {/* Card 6: Build My Own Project */}
              <div
                onClick={() => setIsBuildOwnOpen(true)}
                className="cursor-pointer p-5 rounded-2xl border transition hover:-translate-y-1 hover:shadow-sm flex flex-col justify-between"
                style={{ backgroundColor: 'var(--bv-surface)', borderColor: 'var(--bv-line)' }}
              >
                <div>
                  <div className="text-3xl mb-3">🛠️</div>
                  <h3 className="font-bold text-sm text-[var(--bv-ink)]">Build My Own Project</h3>
                  <p className="text-xs text-[var(--bv-muted)] mt-1.5 leading-relaxed">
                    Guided from real problem to original project — with hints that never spoil.
                  </p>
                </div>
                <span className="mt-4 text-xs font-bold text-[var(--bv-brand)] flex items-center gap-1">
                  Start Building <ArrowRight className="size-3" />
                </span>
              </div>

              {/* Card 7: My Builder Portfolio */}
              <div
                onClick={() => setIsPortfolioOpen(true)}
                className="cursor-pointer p-5 rounded-2xl border transition hover:-translate-y-1 hover:shadow-sm flex flex-col justify-between"
                style={{ backgroundColor: 'var(--bv-surface)', borderColor: 'var(--bv-line)' }}
              >
                <div>
                  <div className="text-3xl mb-3">🖼️</div>
                  <h3 className="font-bold text-sm text-[var(--bv-ink)]">My Builder Portfolio</h3>
                  <p className="text-xs text-[var(--bv-muted)] mt-1.5 leading-relaxed">
                    Showcase what you actually built. Drafts stay private until you publish.
                  </p>
                </div>
                <span className="mt-4 text-xs font-bold text-[var(--bv-brand)] flex items-center gap-1">
                  Open Portfolio <ArrowRight className="size-3" />
                </span>
              </div>

              {/* Card 8: Graduation Studio */}
              <div
                onClick={() => setIsGraduationOpen(true)}
                className="cursor-pointer p-5 rounded-2xl border transition hover:-translate-y-1 hover:shadow-sm flex flex-col justify-between"
                style={{ backgroundColor: 'var(--bv-surface)', borderColor: 'var(--bv-line)' }}
              >
                <div>
                  <div className="text-3xl mb-3">🎓</div>
                  <h3 className="font-bold text-sm text-[var(--bv-ink)]">Graduation Studio</h3>
                  <p className="text-xs text-[var(--bv-muted)] mt-1.5 leading-relaxed">
                    Earn photo certificates for real achievements — download, verify, share.
                  </p>
                </div>
                <span className="mt-4 text-xs font-bold text-[var(--bv-brand)] flex items-center gap-1">
                  Graduate <ArrowRight className="size-3" />
                </span>
              </div>

              {/* Card 9: Weekly Challenges */}
              <div
                onClick={() => setIsChallengesOpen(true)}
                className="cursor-pointer p-5 rounded-2xl border transition hover:-translate-y-1 hover:shadow-sm flex flex-col justify-between"
                style={{ backgroundColor: 'var(--bv-surface)', borderColor: 'var(--bv-line)' }}
              >
                <div>
                  <div className="text-3xl mb-3">🏁</div>
                  <h3 className="font-bold text-sm text-[var(--bv-ink)]">Weekly Build Challenges</h3>
                  <p className="text-xs text-[var(--bv-muted)] mt-1.5 leading-relaxed">
                    Turn this week's knowledge into a finished, submittable build.
                  </p>
                </div>
                <span className="mt-4 text-xs font-bold text-[var(--bv-brand)] flex items-center gap-1">
                  Take a Challenge <ArrowRight className="size-3" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: SUPPORTIVE CALLOUT (Part 1 Vision) */}
        <section className="py-20 px-4 sm:px-6 border-t border-[var(--bv-line)]">
          <div 
            className="max-w-4xl mx-auto rounded-3xl border p-8 sm:p-12 text-center space-y-6 shadow-sm relative overflow-hidden"
            style={{
              backgroundColor: 'var(--bv-surface)',
              borderColor: 'var(--bv-line)'
            }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--bv-brand-soft)] text-[var(--bv-brand)] text-xs font-bold">
              <Heart className="size-3.5 fill-[var(--bv-brand)]" />
              <span>You don't have to be a perfect student</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--bv-ink)] tracking-tight">
              You do not have to be a perfect student to become a capable builder.
            </h2>

            <p className="max-w-xl mx-auto text-sm sm:text-base text-[var(--bv-muted)] leading-relaxed">
              Every student deserves the opportunity to learn. With supportive step-by-step guidance, gentle error explanations, and real building milestones, confidence comes naturally.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => { setAuthMode('signup'); setIsAuthOpen(true); }}
                className="px-6 py-3 rounded-2xl bg-[var(--bv-brand)] text-white text-sm font-bold hover:bg-[var(--bv-brand-strong)] transition shadow-sm"
              >
                Create Free Builder Profile
              </button>
              <button
                onClick={() => setIsBuilderCardOpen(true)}
                className="px-6 py-3 rounded-2xl bg-[var(--bv-surface-2)] border border-[var(--bv-line)] text-sm font-bold text-[var(--bv-ink)] hover:border-[var(--bv-brand)] transition"
              >
                View My Builder Card
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer 
        className="w-full border-t py-12 px-4 sm:px-6"
        style={{
          backgroundColor: 'var(--bv-surface)',
          borderColor: 'var(--bv-line)'
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-xl bg-[var(--bv-brand-soft)] text-[var(--bv-brand)] font-bold text-sm">
              🌷
            </span>
            <div className="text-xs font-semibold text-[var(--bv-ink-soft)]">
              BuilderVerse — Learn. Think. Build.
            </div>
          </div>

          <div className="text-xs text-[var(--bv-muted)] text-center md:text-right">
            Built for curious learners · No tracking, no ads · Made with care.
          </div>
        </div>
      </footer>

      {/* ALL MODALS */}
      <LessonModal
        path={activePath}
        onClose={() => setActivePath(null)}
        onCompleteLesson={handleCompleteLesson}
        completedLessonIds={completedLessonIds}
        onAskAi={(concept, content) => handleOpenAi('explain', concept, '', content)}
      />

      <ThinkingGymModal
        puzzle={activeThinkingPuzzle}
        onClose={() => setActiveThinkingPuzzle(null)}
        onSolve={handleSolveThinking}
        isSolved={activeThinkingPuzzle ? solvedThinkingIds.includes(activeThinkingPuzzle.id) : false}
        onAskAi={(question) => handleOpenAi('hint', 'Thinking Gym: ' + (activeThinkingPuzzle?.title || ''), '', question)}
        onTriggerBreak={handleTriggerBreak}
      />

      <DebugGymModal
        puzzle={activeDebugPuzzle}
        onClose={() => setActiveDebugPuzzle(null)}
        onSolve={handleSolveDebug}
        isSolved={activeDebugPuzzle ? solvedDebugIds.includes(activeDebugPuzzle.id) : false}
        onAskAi={(code, error) => handleOpenAi('debug', 'Error Companion: ' + (activeDebugPuzzle?.title || ''), code, error)}
        onTriggerBreak={handleTriggerBreak}
      />

      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onComplete={handleCompleteProject}
        isCompleted={activeProject ? completedProjectIds.includes(activeProject.id) : false}
      />

      <ProjectRoadmapModal
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
        completedProjectIds={completedProjectIds}
        onSelectProject={(project) => setActiveProject(project)}
        onTriggerConfetti={triggerProjectConfetti}
      />

      {/* 🛠️ BUILD MY OWN PROJECT WORKSPACE */}
      <BuildOwnProjectModal
        isOpen={isBuildOwnOpen}
        onClose={() => setIsBuildOwnOpen(false)}
        onEarnXp={handleEarnXp}
      />

      {/* 🖼️ MY BUILDER PORTFOLIO */}
      <MyBuilderPortfolioModal
        isOpen={isPortfolioOpen}
        onClose={() => setIsPortfolioOpen(false)}
        username={username}
        completedProjectIds={completedProjectIds}
        completedLessonIds={completedLessonIds}
        ownProjects={ownProjects}
      />

      {/* 🎓 GRADUATION STUDIO + CERTIFICATES */}
      <GraduationStudioModal
        isOpen={isGraduationOpen}
        onClose={() => setIsGraduationOpen(false)}
        username={username}
        completedLessonIds={completedLessonIds}
        completedProjectIds={completedProjectIds}
        ownProjects={ownProjects}
        onEarnXp={handleEarnXp}
      />

      {/* 💡 PROJECT IDEA GENERATOR */}
      <IdeaGeneratorModal
        isOpen={isIdeasOpen}
        onClose={() => setIsIdeasOpen(false)}
        completedLessonIds={completedLessonIds}
        onSaveIdea={(idea) => {
          handleSaveIdea(idea);
          setIsIdeasOpen(false);
          setIsBuildOwnOpen(true);
        }}
      />

      {/* 📣 MY SHOWCASE */}
      <ShowcaseModal
        isOpen={isShowcaseOpen}
        onClose={() => setIsShowcaseOpen(false)}
        username={username}
        completedProjectIds={completedProjectIds}
        completedLessonIds={completedLessonIds}
        ownProjects={ownProjects}
        portfolioEntries={portfolioEntries}
      />

      {/* 🏁 WEEKLY BUILD CHALLENGES */}
      <WeeklyChallengesModal
        isOpen={isChallengesOpen}
        onClose={() => setIsChallengesOpen(false)}
        onSubmitBuild={handleSubmitChallengeBuild}
      />

      <AvatarGalleryModal
        isOpen={isAvatarGalleryOpen}
        onClose={() => setIsAvatarGalleryOpen(false)}
        currentAvatarId={avatarId}
        currentNickname={username}
        onSave={(newAvatarId, newNick) => {
          setAvatarId(newAvatarId);
          setUsername(newNick);
          localStorage.setItem('bv_user_avatar', newAvatarId);
          localStorage.setItem('bv_user', newNick);
        }}
      />

      <BuilderCardModal
        isOpen={isBuilderCardOpen}
        onClose={() => setIsBuilderCardOpen(false)}
        username={username}
        avatarId={avatarId}
        builderId={builderId}
        level={getBuilderLevel(xp)}
        xp={xp}
        streak={streak}
        completedLessonsCount={completedLessonIds.length}
        completedProjectsCount={completedProjectIds.length}
        badgesCount={BADGES.filter(b => xp >= (b.unlockedAtXp || 0)).length}
      />

      <LearningGardenModal
        isOpen={isGardenOpen}
        onClose={() => setIsGardenOpen(false)}
        userXp={xp}
        completedLessonsCount={completedLessonIds.length}
        completedProjectsCount={completedProjectIds.length}
        thinkingSolvedCount={solvedThinkingIds.length}
      />

      <LearningJournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onLogin={(user) => {
          setUsername(user);
          localStorage.setItem('bv_user', user);
        }}
      />

      <BadgesModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        userXp={xp}
        streakDays={streak}
      />

      <AiMentorModal
        isOpen={isAiMentorOpen}
        onClose={() => setIsAiMentorOpen(false)}
        initialMode={aiMode}
        initialContext={aiContext}
        initialCode={aiCode}
        initialError={aiError}
      />

      {/* 🦆 RUBBER DUCK DIAGNOSTIC MODAL */}
      <RubberDuckModal
        isOpen={isRubberDuckOpen}
        onClose={() => setIsRubberDuckOpen(false)}
        onOpenAi={() => {
          setIsRubberDuckOpen(false);
          handleOpenAi('debug', 'Rubber Duck Diagnostic');
        }}
      />

      {/* 🧪 INTERACTIVE SCRATCHPAD / SANDBOX */}
      <ScratchpadModal
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
      />

      {/* 🗂️ PEER HELP & GUIDED Q&A FLASHCARDS */}
      <QaFlashcardsModal
        isOpen={isQaFlashcardsOpen}
        onClose={() => setIsQaFlashcardsOpen(false)}
      />

      {/* 🍵 STUDY BREAK & MINDFUL BREATHING RESET */}
      <StudyBreakModal
        isOpen={isStudyBreakOpen}
        onClose={() => setIsStudyBreakOpen(false)}
        reason={studyBreakReason}
      />

      <LevelUpModal
        isOpen={isLevelUpOpen}
        onClose={() => setIsLevelUpOpen(false)}
        oldXp={levelUpData.oldXp}
        newXp={levelUpData.newXp}
        oldTitle={levelUpData.oldTitle}
        newTitle={levelUpData.newTitle}
        onOpenCard={() => setIsBuilderCardOpen(true)}
      />

      <SuggestionModal
        isOpen={isSuggestionOpen}
        onClose={() => setIsSuggestionOpen(false)}
        username={username}
      />

      {/* Floating Ask Sprout AI Button */}
      <button
        onClick={() => handleOpenAi('explain', 'General Guidance')}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-2xl bg-[var(--bv-brand)] text-white font-bold text-xs shadow-xl hover:bg-[var(--bv-brand-strong)] transition-all flex items-center gap-2 hover:scale-105 active:scale-95 border-2 border-white dark:border-[var(--bv-surface)]"
        title="Stuck? Ask Sprout AI"
      >
        <span className="text-base">🌷</span>
        <span className="hidden sm:inline">Stuck? Ask Sprout AI</span>
        <span className="sm:hidden">Ask AI</span>
      </button>
    </div>
  );
}
