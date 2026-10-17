/**
 * Frontend Supabase client.
 *
 * Uses the ANON / PUBLIC key (safe to expose in browser code).
 * The service-role key is NEVER imported here — it's only used by
 * api/ server-side endpoints.
 *
 * When VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not set
 * (e.g. local dev without Supabase configured), this returns null
 * and the app falls back to localStorage-only mode.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Returns the Supabase client, or null if Supabase is not configured.
 * Callers should check the return value before using.
 */
export function getSupabase(): SupabaseClient | null {
  if (client) return client;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null; // Supabase not configured — use localStorage fallback
  }

  client = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return client;
}

/** True when Supabase environment variables are present. */
export function isSupabaseConfigured(): boolean {
  return getSupabase() !== null;
}
