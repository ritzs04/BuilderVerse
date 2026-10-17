/**
 * Frontend authentication helpers.
 *
 * Uses Supabase Auth when configured (email/password + Google OAuth).
 * Falls back to a localStorage-only "guest" mode when Supabase is not
 * configured, preserving the original BuilderVerse experience.
 *
 * Usage in App.tsx:
 *   const { user, signIn, signUp, signOut, loading } = useAuth();
 */

import { useEffect, useState, useCallback } from "react";
import { getSupabase, isSupabaseConfigured } from "./supabaseClient";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarEmoji: string;
  /** True when using localStorage guest mode (not a real server session). */
  isGuest: boolean;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}

const GUEST_KEY = "bv_user";

function loadGuestUser(): AuthUser | null {
  try {
    const saved = localStorage.getItem(GUEST_KEY);
    if (!saved) return null;
    const { displayName, avatarEmoji } = JSON.parse(saved);
    return {
      id: "guest-" + (localStorage.getItem("bv_builder_id") || "local"),
      email: "",
      displayName: displayName || "Builder",
      avatarEmoji: avatarEmoji || "🌱",
      isGuest: true,
    };
  } catch {
    return null;
  }
}

function saveGuestUser(displayName: string, avatarEmoji: string) {
  localStorage.setItem(
    GUEST_KEY,
    JSON.stringify({ displayName, avatarEmoji })
  );
  if (!localStorage.getItem("bv_builder_id")) {
    localStorage.setItem(
      "bv_builder_id",
      "builder-" + Math.random().toString(36).slice(2, 10)
    );
  }
}

/**
 * React hook for authentication. Works with or without Supabase.
 *
 * Without Supabase: uses localStorage guest mode (original behavior).
 * With Supabase: uses real server-side auth with sessions.
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    const supabase = getSupabase();

    if (!supabase) {
      // Guest mode — no Supabase configured
      setState({ user: loadGuestUser(), loading: false });
      return;
    }

    // Supabase mode — check existing session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        fetchProfile(supabase, data.session.user.id, data.session.user.email || "")
          .then((user) => setState({ user, loading: false }));
      } else {
        setState({ user: null, loading: false });
      }
    });

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          fetchProfile(supabase, session.user.id, session.user.email || "")
            .then((user) => setState({ user, loading: false }));
        } else {
          setState({ user: null, loading: false });
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      const supabase = getSupabase();

      if (!supabase) {
        // Guest mode — accept any credentials, store locally
        saveGuestUser(email.split("@")[0] || "Builder", "🌱");
        setState({ user: loadGuestUser(), loading: false });
        return {};
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error: error.message };
      return {};
    },
    []
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      displayName: string
    ): Promise<{ error?: string }> => {
      const supabase = getSupabase();

      if (!supabase) {
        // Guest mode
        saveGuestUser(displayName || email.split("@")[0] || "Builder", "🌱");
        setState({ user: loadGuestUser(), loading: false });
        return {};
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });

      if (error) return { error: error.message };

      // If email confirmation is disabled, session is created immediately.
      if (data.session?.user) {
        // Profile is auto-created by the trigger in schema.sql
        return {};
      }

      return { error: "Check your email to confirm your account." };
    },
    []
  );

  const signOut = useCallback(async () => {
    const supabase = getSupabase();

    if (supabase) {
      await supabase.auth.signOut();
    }

    // Always clear local guest state too
    setState({ user: null, loading: false });
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<{ error?: string }> => {
    const supabase = getSupabase();
    if (!supabase) {
      return { error: "Supabase is not configured" };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) return { error: error.message };
    return {};
  }, []);

  return {
    user: state.user,
    loading: state.loading,
    isConfigured: isSupabaseConfigured(),
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };
}

/** Fetch a user's profile from the database. */
async function fetchProfile(
  supabase: ReturnType<typeof getSupabase>,
  userId: string,
  email: string
): Promise<AuthUser> {
  try {
    const { data } = await supabase!
      .from("profiles")
      .select("display_name, avatar_emoji")
      .eq("id", userId)
      .maybeSingle();

    return {
      id: userId,
      email,
      displayName: data?.display_name || email.split("@")[0] || "Builder",
      avatarEmoji: data?.avatar_emoji || "🌱",
      isGuest: false,
    };
  } catch {
    return {
      id: userId,
      email,
      displayName: email.split("@")[0] || "Builder",
      avatarEmoji: "🌱",
      isGuest: false,
    };
  }
}
