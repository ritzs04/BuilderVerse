/**
 * GET  /api/progress    — load the authenticated user's learning progress
 * PUT  /api/progress    — save (merge) the authenticated user's learning progress
 *
 * Body (PUT): {
 *   completedLessonIds?: string[],
 *   completedProjectIds?: string[],
 *   xp?: number,
 *   streakDays?: number,
 *   lastActiveDate?: string,  // ISO date
 *   dailyGoalMinutes?: number,
 * }
 *
 * The PUT endpoint MERGES — it never deletes existing progress.
 * Arrays are unioned (new IDs added), numeric fields take the max of
 * existing and incoming so a stale tab can't overwrite newer data.
 */

import { getServerSupabase, getAuthenticatedUserId } from "../shared/supabaseServer";

export default async function handler(req: any, res: any) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return res
      .status(500)
      .json({ ok: false, error: "Database not configured" });
  }

  const userId = await getAuthenticatedUserId(supabase, req);
  if (!userId) {
    return res.status(401).json({ ok: false, error: "Not authenticated" });
  }

  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("learning_progress")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        return res
          .status(500)
          .json({ ok: false, error: "Failed to load progress" });
      }

      return res.status(200).json({
        ok: true,
        progress: data || {
          user_id: userId,
          completed_lesson_ids: [],
          completed_project_ids: [],
          xp: 0,
          streak_days: 0,
          last_active_date: null,
          daily_goal_minutes: 25,
        },
      });
    } catch {
      return res
        .status(500)
        .json({ ok: false, error: "Failed to load progress" });
    }
  }

  if (req.method === "PUT") {
    const body = req.body || {};

    try {
      // Load existing progress (if any)
      const { data: existing } = await supabase
        .from("learning_progress")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      // Merge arrays (union, dedup)
      const mergeArrays = (a: string[] = [], b: string[] = []) =>
        Array.from(new Set([...a, ...b]));

      // Take max of numeric fields
      const maxNum = (a: number = 0, b: number = 0) => Math.max(a, b);

      const merged = {
        user_id: userId,
        completed_lesson_ids: mergeArrays(
          existing?.completed_lesson_ids as string[],
          body.completedLessonIds
        ),
        completed_project_ids: mergeArrays(
          existing?.completed_project_ids as string[],
          body.completedProjectIds
        ),
        xp: maxNum(existing?.xp, body.xp),
        streak_days: maxNum(existing?.streak_days, body.streakDays),
        last_active_date: body.lastActiveDate || existing?.last_active_date || null,
        daily_goal_minutes: body.dailyGoalMinutes || existing?.daily_goal_minutes || 25,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("learning_progress")
        .upsert(merged, { onConflict: "user_id" })
        .select()
        .single();

      if (error) {
        return res
          .status(500)
          .json({ ok: false, error: "Failed to save progress" });
      }

      return res.status(200).json({ ok: true, progress: data });
    } catch {
      return res
        .status(500)
        .json({ ok: false, error: "Failed to save progress" });
    }
  }

  res.setHeader("Allow", "GET, PUT");
  return res.status(405).json({ ok: false, error: "Method not allowed" });
}
