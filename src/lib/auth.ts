import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { first, run, isoNow, type UserRow } from "@/lib/db";

const SESSION_COOKIE = "bv_session";
const SESSION_DAYS = 30;
const RESET_MINUTES = 30;

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

function expiresAt(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

/** Creates a session row and sets the httpOnly session cookie. */
export async function startSession(userId: string): Promise<void> {
  const token = crypto.randomBytes(32).toString("hex");
  run(
    "INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)",
    token,
    userId,
    isoNow(),
    expiresAt(SESSION_DAYS),
  );
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    run("DELETE FROM sessions WHERE token = ?", token);
    store.delete(SESSION_COOKIE);
  }
}

/** Returns the signed-in user, or null. Safe to call anywhere on the server. */
export async function getSessionUser(): Promise<UserRow | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = first<{ user_id: string; expires_at: string }>(
    "SELECT user_id, expires_at FROM sessions WHERE token = ?",
    token,
  );
  if (!session) return null;
  if (new Date(session.expires_at).getTime() < Date.now()) {
    run("DELETE FROM sessions WHERE token = ?", token);
    return null;
  }

  const user = first<UserRow>("SELECT * FROM users WHERE id = ?", session.user_id);
  return user ?? null;
}

/** For protected pages: redirects to /login when there is no session. */
export async function requireUser(): Promise<UserRow> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

/** For server actions: returns the user or null (never throws redirects). */
export async function requireUserOrThrow(): Promise<UserRow> {
  const user = await getSessionUser();
  if (!user) throw new Error("You need to be signed in to do that.");
  return user;
}

/** Creates a single-use password reset token (valid for 30 minutes). */
export function createPasswordReset(userId: string): string {
  const token = crypto.randomBytes(24).toString("hex");
  run("DELETE FROM password_resets WHERE user_id = ?", userId);
  run(
    "INSERT INTO password_resets (token, user_id, expires_at, used) VALUES (?, ?, ?, 0)",
    token,
    userId,
    new Date(Date.now() + RESET_MINUTES * 60 * 1000).toISOString(),
  );
  return token;
}

export function consumePasswordReset(token: string): string | null {
  const row = first<{ user_id: string; expires_at: string; used: number }>(
    "SELECT user_id, expires_at, used FROM password_resets WHERE token = ?",
    token,
  );
  if (!row || row.used === 1) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) return null;
  run("UPDATE password_resets SET used = 1 WHERE token = ?", token);
  return row.user_id;
}
