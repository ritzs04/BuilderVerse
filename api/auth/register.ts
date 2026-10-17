/**
 * POST /api/auth/register
 *
 * Creates a new user account via Supabase Auth.
 *
 * Body: { email: string, password: string, displayName?: string }
 * Returns: { ok: true, user: { id, email } } or { ok: false, error: string }
 *
 * Note: Supabase handles password hashing and session creation.
 * The frontend uses the Supabase JS client directly for the actual
 * signUp() call and session management. This endpoint exists for
 * server-side registration flows and is a thin wrapper.
 */

import { getServerSupabase } from "../../shared/supabaseServer";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return res
      .status(500)
      .json({ ok: false, error: "Database not configured" });
  }

  const { email, password, displayName } = req.body || {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ ok: false, error: "Email and password are required" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ ok: false, error: "Password must be at least 8 characters" });
  }

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { display_name: displayName || "Builder" },
    });

    if (error) {
      return res.status(400).json({ ok: false, error: error.message });
    }

    return res.status(201).json({
      ok: true,
      user: { id: data.user.id, email: data.user.email },
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ ok: false, error: "Registration failed" });
  }
}
