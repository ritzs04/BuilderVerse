/**
 * GET /api/auth/me
 *
 * Returns the currently authenticated user's profile, using the
 * Bearer token in the Authorization header.
 *
 * Returns:
 *   200 { ok: true, user: { id, email, displayName } }
 *   401 { ok: false, error: "Not authenticated" }
 */

import { getServerSupabase, getAuthenticatedUserId } from "../../shared/supabaseServer";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

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

  try {
    // Fetch profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, avatar_emoji")
      .eq("id", userId)
      .maybeSingle();

    // Fetch auth user for email
    const { data: authUser } = await supabase.auth.admin.getUserById(userId);

    return res.status(200).json({
      ok: true,
      user: {
        id: userId,
        email: authUser?.user?.email || "",
        displayName: profile?.display_name || "Builder",
        avatarEmoji: profile?.avatar_emoji || "🌱",
      },
    });
  } catch {
    return res.status(500).json({ ok: false, error: "Failed to fetch user" });
  }
}
