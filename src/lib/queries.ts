import {
  all,
  first,
  type NotificationRow,
  type PortfolioProjectRow,
  type PersonalIdeaRow,
  type XpEventRow,
} from "@/lib/db";

/**
 * Read-only data access for server components. Kept separate from server
 * actions (which must only export async functions).
 */

export function getNotifications(userId: string, limit = 12): NotificationRow[] {
  return all<NotificationRow>(
    "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
    userId,
    limit,
  );
}

export function unreadNotificationCount(userId: string): number {
  return (
    first<{ n: number }>(
      "SELECT COUNT(*) AS n FROM notifications WHERE user_id = ? AND is_read = 0",
      userId,
    )?.n ?? 0
  );
}

export function getPortfolioProjects(userId: string): PortfolioProjectRow[] {
  return all<PortfolioProjectRow>(
    "SELECT * FROM portfolio_projects WHERE user_id = ? ORDER BY created_at DESC",
    userId,
  );
}

export function getBookmarks(userId: string): { ref_type: string; ref_slug: string }[] {
  return all<{ ref_type: string; ref_slug: string }>(
    "SELECT ref_type, ref_slug FROM bookmarks WHERE user_id = ?",
    userId,
  );
}

export function missionDoneToday(userId: string, missionSlug: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return Boolean(
    first(
      "SELECT 1 AS x FROM mission_completions WHERE user_id = ? AND mission_slug = ? AND date = ?",
      userId,
      missionSlug,
      today,
    ),
  );
}

export function getRecentBadges(userId: string, limit = 4): { badge_slug: string; earned_at: string }[] {
  return all<{ badge_slug: string; earned_at: string }>(
    "SELECT badge_slug, earned_at FROM user_badges WHERE user_id = ? ORDER BY earned_at DESC LIMIT ?",
    userId,
    limit,
  );
}

/** Completed daily missions, newest day first (drives /missions history). */
export function getMissionHistory(
  userId: string,
  limit = 31,
): { mission_slug: string; date: string }[] {
  return all<{ mission_slug: string; date: string }>(
    "SELECT mission_slug, date FROM mission_completions WHERE user_id = ? ORDER BY date DESC LIMIT ?",
    userId,
    limit,
  );
}

/* ------------------------------------------------------------ XP ledger */

export interface XpSummaryRow {
  kind: string;
  amount: number;
  entries: number;
}

/**
 * XP earned per activity kind — lets the progress-history page show a student
 * exactly where their points came from (§13: "understand how they earned").
 */
export function getXpByKind(userId: string): XpSummaryRow[] {
  return all<XpSummaryRow>(
    `SELECT kind, SUM(amount) AS amount, COUNT(*) AS entries
       FROM xp_events
      WHERE user_id = ?
      GROUP BY kind
      ORDER BY amount DESC`,
    userId,
  );
}

export interface ProgressMaps {
  startedLessons: Set<string>;
  completedLessons: Set<string>;
  lessonScores: Map<string, { score: number; total: number }>;
  solvedThinking: Set<string>;
  solvedDebug: Set<string>;
  bookmarkedIdeas: Set<string>;
  projects: Map<string, { steps: number[]; completed: boolean }>;
  badges: Set<string>;
  missions: Set<string>;
}

export function getProgress(userId: string): ProgressMaps {
  const lessonRows = all<{
    lesson_slug: string;
    completed: number;
    quiz_score: number;
    quiz_total: number;
  }>(
    "SELECT lesson_slug, completed, quiz_score, quiz_total FROM lesson_progress WHERE user_id = ?",
    userId,
  );

  const thinking = all<{ challenge_slug: string }>(
    "SELECT DISTINCT challenge_slug FROM challenge_attempts WHERE user_id = ? AND correct = 1",
    userId,
  );

  const debug = all<{ debug_slug: string }>(
    "SELECT DISTINCT debug_slug FROM debug_attempts WHERE user_id = ? AND solved = 1",
    userId,
  );

  const bookmarkRows = getBookmarks(userId);

  const projectRows = all<{ project_slug: string; steps_done: string; completed: number }>(
    "SELECT project_slug, steps_done, completed FROM project_progress WHERE user_id = ?",
    userId,
  );

  const badgeRows = all<{ badge_slug: string }>(
    "SELECT badge_slug FROM user_badges WHERE user_id = ?",
    userId,
  );

  const missionRows = all<{ mission_slug: string; date: string }>(
    "SELECT mission_slug, date FROM mission_completions WHERE user_id = ?",
    userId,
  );

  return {
    startedLessons: new Set(lessonRows.map((r) => r.lesson_slug)),
    completedLessons: new Set(
      lessonRows.filter((r) => r.completed === 1).map((r) => r.lesson_slug),
    ),
    lessonScores: new Map(
      lessonRows.map((r) => [r.lesson_slug, { score: r.quiz_score, total: r.quiz_total }]),
    ),
    solvedThinking: new Set(thinking.map((r) => r.challenge_slug)),
    solvedDebug: new Set(debug.map((r) => r.debug_slug)),
    bookmarkedIdeas: new Set(
      bookmarkRows.filter((b) => b.ref_type === "idea").map((b) => b.ref_slug),
    ),
    projects: new Map(
      projectRows.map((r) => [
        r.project_slug,
        { steps: JSON.parse(r.steps_done) as number[], completed: r.completed === 1 },
      ]),
    ),
    badges: new Set(badgeRows.map((r) => r.badge_slug)),
    missions: new Set(missionRows.map((r) => r.mission_slug)),
  };
}

/* ------------------------------------------------------- XP history ledger */

export interface XpDay {
  date: string;
  total: number;
  events: XpEventRow[];
}

/**
 * Progress history (§13): every XP award grouped by day, newest first, so a
 * student can see exactly how they earned each point. Nothing here is
 * fabricated — it is a direct read of the ledger written by `reward()`.
 */
export function getXpHistory(userId: string, limit = 60): XpDay[] {
  const rows = all<XpEventRow>(
    `SELECT * FROM xp_events WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
    userId,
    limit,
  );

  const days: XpDay[] = [];
  for (const row of rows) {
    const date = row.created_at.slice(0, 10);
    const last = days[days.length - 1];
    if (last && last.date === date) {
      last.events.push(row);
      last.total += row.amount;
    } else {
      days.push({ date, total: row.amount, events: [row] });
    }
  }
  return days;
}

/* --------------------------------------------------------- personal ideas */

export function getPersonalIdeas(userId: string): PersonalIdeaRow[] {
  return all<PersonalIdeaRow>(
    "SELECT * FROM personal_ideas WHERE user_id = ? ORDER BY created_at DESC",
    userId,
  );
}

/* -------------------------------------------------- administrator reads (§3) */

/** Aggregate platform statistics for the administrator overview. */
export function getPlatformStats() {
  const totals = first<{
    users: number;
    admins: number;
    xp: number;
    active_today: number;
    new_this_week: number;
  }>(
    `SELECT
       (SELECT COUNT(*) FROM users) AS users,
       (SELECT COUNT(*) FROM users WHERE role = 'admin') AS admins,
       (SELECT COALESCE(SUM(xp), 0) FROM users) AS xp,
       (SELECT COUNT(*) FROM users WHERE last_active_date = date('now')) AS active_today,
       (SELECT COUNT(*) FROM users WHERE created_at >= datetime('now', '-7 days')) AS new_this_week`,
  );

  const counts = first<{
    lessons: number;
    thinking: number;
    debug: number;
    projects: number;
    missions: number;
    badges: number;
  }>(
    `SELECT
       (SELECT COUNT(*) FROM lesson_progress WHERE completed = 1) AS lessons,
       (SELECT COUNT(*) FROM challenge_attempts WHERE solved = 1) AS thinking,
       (SELECT COUNT(*) FROM debug_attempts WHERE solved = 1) AS debug,
       (SELECT COUNT(*) FROM project_progress WHERE completed = 1) AS projects,
       (SELECT COUNT(*) FROM mission_completions) AS missions,
       (SELECT COUNT(*) FROM user_badges) AS badges`,
  );

  const idea = first<{ ideas: number }>("SELECT COUNT(*) AS ideas FROM personal_ideas");

  return {
    users: totals?.users ?? 0,
    admins: totals?.admins ?? 0,
    totalXp: totals?.xp ?? 0,
    activeToday: totals?.active_today ?? 0,
    newThisWeek: totals?.new_this_week ?? 0,
    lessonsCompleted: counts?.lessons ?? 0,
    thinkingSolved: counts?.thinking ?? 0,
    debugSolved: counts?.debug ?? 0,
    projectsCompleted: counts?.projects ?? 0,
    missionsCompleted: counts?.missions ?? 0,
    badgesEarned: counts?.badges ?? 0,
    personalIdeas: idea?.ideas ?? 0,
  };
}

export interface AdminUserRow {
  id: string;
  builder_id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  xp: number;
  streak: number;
  created_at: string;
  last_active_date: string | null;
}

/** Account list for the administrator table, newest accounts first. */
export function listUsersForAdmin(limit = 200): AdminUserRow[] {
  return all<AdminUserRow>(
    `SELECT id, builder_id, name, username, email, role, xp, streak, created_at, last_active_date
      FROM users
      ORDER BY created_at DESC
      LIMIT ?`,
    limit,
  );
}
