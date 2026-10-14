import { all, first, run, isoNow, todayKey, type UserRow } from "@/lib/db";
import { getBadge, levelForXp, learningPaths, lessonsForPath, type Badge } from "@/content";
import { randomUUID } from "node:crypto";

export interface BuilderStats {
  xp: number;
  streak: number;
  longestStreak: number;
  level: ReturnType<typeof levelForXp>;
  lessonsCompleted: number;
  lessonsStarted: number;
  projectsCompleted: number;
  projectsStarted: number;
  thinkingSolved: number;
  debugSolved: number;
  missionsCompleted: number;
  badgesEarned: number;
  portfolioProjects: number;
  quizCorrect: number;
  perfectQuizzes: number;
  ideasBookmarked: number;
}

function count(sql: string, ...params: unknown[]): number {
  const row = first<{ n: number }>(sql, ...params);
  return row?.n ?? 0;
}

export function getStats(userId: string): BuilderStats {
  const user = first<UserRow>("SELECT * FROM users WHERE id = ?", userId);
  const xp = user?.xp ?? 0;

  const stats: BuilderStats = {
    xp,
    streak: user?.streak ?? 0,
    longestStreak: user?.longest_streak ?? 0,
    level: levelForXp(xp),
    lessonsCompleted: count(
      "SELECT COUNT(*) AS n FROM lesson_progress WHERE user_id = ? AND completed = 1",
      userId,
    ),
    lessonsStarted: count(
      "SELECT COUNT(*) AS n FROM lesson_progress WHERE user_id = ?",
      userId,
    ),
    projectsCompleted: count(
      "SELECT COUNT(*) AS n FROM project_progress WHERE user_id = ? AND completed = 1",
      userId,
    ),
    projectsStarted: count(
      "SELECT COUNT(*) AS n FROM project_progress WHERE user_id = ?",
      userId,
    ),
    thinkingSolved: count(
      "SELECT COUNT(DISTINCT challenge_slug) AS n FROM challenge_attempts WHERE user_id = ? AND correct = 1",
      userId,
    ),
    debugSolved: count(
      "SELECT COUNT(DISTINCT debug_slug) AS n FROM debug_attempts WHERE user_id = ? AND solved = 1",
      userId,
    ),
    missionsCompleted: count(
      "SELECT COUNT(*) AS n FROM mission_completions WHERE user_id = ?",
      userId,
    ),
    badgesEarned: count("SELECT COUNT(*) AS n FROM user_badges WHERE user_id = ?", userId),
    portfolioProjects: count(
      "SELECT COUNT(*) AS n FROM portfolio_projects WHERE user_id = ?",
      userId,
    ),
    quizCorrect: count(
      "SELECT COALESCE(SUM(quiz_score), 0) AS n FROM lesson_progress WHERE user_id = ?",
      userId,
    ),
    perfectQuizzes: count(
      "SELECT COUNT(*) AS n FROM lesson_progress WHERE user_id = ? AND quiz_total > 0 AND quiz_score = quiz_total",
      userId,
    ),
    ideasBookmarked: count(
      "SELECT COUNT(*) AS n FROM bookmarks WHERE user_id = ? AND ref_type = 'idea'",
      userId,
    ),
  };

  return stats;
}

/**
 * Updates the daily streak. Called once whenever a builder does meaningful work.
 * Returns the current streak length.
 */
export function touchActivity(userId: string): number {
  const user = first<{ streak: number; longest_streak: number; last_active_date: string | null }>(
    "SELECT streak, longest_streak, last_active_date FROM users WHERE id = ?",
    userId,
  );
  if (!user) return 0;

  const today = todayKey();
  if (user.last_active_date === today) return user.streak;

  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const streak = user.last_active_date === yesterday ? user.streak + 1 : 1;
  const longest = Math.max(user.longest_streak, streak);

  run(
    "UPDATE users SET streak = ?, longest_streak = ?, last_active_date = ? WHERE id = ?",
    streak,
    longest,
    today,
    userId,
  );
  return streak;
}

export interface XpResult {
  xp: number;
  gained: number;
  levelUp: boolean;
  newLevelTitle: string;
}

/** Adds XP, detects level-ups and notifies the user. */
export function awardXp(userId: string, amount: number): XpResult {
  if (amount <= 0) {
    const current = first<{ xp: number }>("SELECT xp FROM users WHERE id = ?", userId);
    const xp = current?.xp ?? 0;
    return { xp, gained: 0, levelUp: false, newLevelTitle: levelForXp(xp).title };
  }

  const before = first<{ xp: number }>("SELECT xp FROM users WHERE id = ?", userId)?.xp ?? 0;
  run("UPDATE users SET xp = xp + ? WHERE id = ?", amount, userId);
  const xp = before + amount;

  const beforeLevel = levelForXp(before);
  const afterLevel = levelForXp(xp);

  if (afterLevel.level > beforeLevel.level) {
    notify(userId, {
      type: "level",
      title: `Level up — ${afterLevel.title}`,
      body: `You reached level ${afterLevel.level}. ${afterLevel.motto}`,
      href: "/profile",
    });
  }

  return {
    xp,
    gained: amount,
    levelUp: afterLevel.level > beforeLevel.level,
    newLevelTitle: afterLevel.title,
  };
}

export interface NotifyInput {
  type: string;
  title: string;
  body: string;
  href?: string;
}

/** Creates an in-app notification (used sparingly: badges, levels, milestones). */
export function notify(userId: string, input: NotifyInput): void {
  run(
    "INSERT INTO notifications (id, user_id, type, title, body, href, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?)",
    randomUUID(),
    userId,
    input.type,
    input.title,
    input.body,
    input.href ?? null,
    isoNow(),
  );
}

export function grantBadge(userId: string, badgeSlug: string): boolean {
  const exists = first(
    "SELECT 1 AS x FROM user_badges WHERE user_id = ? AND badge_slug = ?",
    userId,
    badgeSlug,
  );
  if (exists) return false;

  run(
    "INSERT INTO user_badges (user_id, badge_slug, earned_at) VALUES (?, ?, ?)",
    userId,
    badgeSlug,
    isoNow(),
  );

  const badge = getBadge(badgeSlug);
  if (badge) {
    notify(userId, {
      type: "badge",
      title: `Badge earned — ${badge.name}`,
      body: badge.description,
      href: "/profile",
    });
  }
  return true;
}

/**
 * Evaluates every badge rule against the user's real stats and grants the
 * ones that are now true. Returns badges earned during this call.
 */
export function evaluateBadges(userId: string): Badge[] {
  const stats = getStats(userId);
  const earned: Badge[] = [];

  const grant = (slug: string, condition: boolean) => {
    if (condition && grantBadge(userId, slug)) {
      const badge = getBadge(slug);
      if (badge) earned.push(badge);
    }
  };

  grant("first-lesson", stats.lessonsCompleted >= 1);
  grant("first-debug", stats.debugSolved >= 1);
  grant("first-build", stats.projectsCompleted >= 1);
  grant("thinker", stats.thinkingSolved >= 5);
  grant("streak-3", stats.streak >= 3);
  grant("streak-7", stats.streak >= 7);
  grant("quiz-ace", stats.perfectQuizzes >= 1);
  grant("debugger-5", stats.debugSolved >= 5);
  grant("project-3", stats.projectsCompleted >= 3);
  grant("ideas-collector", stats.ideasBookmarked >= 5);
  grant("sharpshooter", stats.quizCorrect >= 10);
  grant("independent", stats.portfolioProjects >= 3);
  grant("mission-streak", stats.missionsCompleted >= 5);

  const completedLessons = new Set(
    all<{ lesson_slug: string }>(
      "SELECT lesson_slug FROM lesson_progress WHERE user_id = ? AND completed = 1",
      userId,
    ).map((r) => r.lesson_slug),
  );
  const finishedPath = learningPaths.some((path) => {
    const lessons = lessonsForPath(path.slug);
    return lessons.length > 0 && lessons.every((lesson) => completedLessons.has(lesson.slug));
  });
  grant("path-finisher", finishedPath);

  return earned;
}

/** Full "what happened" result after a rewarded action. */
export interface RewardResult {
  xpGained: number;
  totalXp: number;
  levelUp: boolean;
  newLevelTitle: string;
  streak: number;
  badges: Badge[];
}

export function reward(
  userId: string,
  xp: number,
  options: { touchStreak?: boolean } = {},
): RewardResult {
  const streak = options.touchStreak === false ? readStreak(userId) : touchActivity(userId);
  const xpResult = awardXp(userId, xp);
  const newBadges = evaluateBadges(userId);

  return {
    xpGained: xpResult.gained,
    totalXp: xpResult.xp,
    levelUp: xpResult.levelUp,
    newLevelTitle: xpResult.newLevelTitle,
    streak,
    badges: newBadges,
  };
}

export function readStreak(userId: string): number {
  return first<{ streak: number }>("SELECT streak FROM users WHERE id = ?", userId)?.streak ?? 0;
}
