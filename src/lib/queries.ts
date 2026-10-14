import { all, first, type NotificationRow, type PortfolioProjectRow } from "@/lib/db";

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
