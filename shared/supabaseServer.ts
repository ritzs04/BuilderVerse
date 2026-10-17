/**
 * Server-side Supabase client factory.
 *
 * Uses the SERVICE ROLE key — this bypasses Row Level Security and must
 * NEVER be imported into browser/frontend code. Only api/ endpoints use this.
 *
 * The frontend uses src/lib/supabaseClient.ts with the anon key instead.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Create a server-side Supabase client.
 * Returns null if env vars are not configured (e.g. local dev without Supabase).
 */
export function getServerSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/**
 * Extract the bearer token from an Express / Vercel request and verify
 * it against Supabase Auth. Returns the user's UUID or null.
 *
 * The frontend sends the Supabase access token (from supabase.auth.getSession())
 * in the Authorization header. The server validates it by calling
 * supabase.auth.getUser(token) — this checks the JWT signature server-side.
 */
export async function getAuthenticatedUserId(
  supabase: SupabaseClient,
  req: any
): Promise<string | null> {
  const authHeader = req.headers?.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) return null;

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) return null;
    return user.id;
  } catch {
    return null;
  }
}
