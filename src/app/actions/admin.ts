"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { first, run, ROLES } from "@/lib/db";
import { requireAdminOrThrow } from "@/lib/auth";
import { firstIssue } from "@/lib/validation";

/**
 * Administrator actions (§3).
 *
 * Every action starts with `requireAdminOrThrow()`, so the role is verified
 * server-side against the session's database row on each call. Hiding a button
 * in the UI is not the security boundary — this is.
 */

const roleSchema = z.object({
  userId: z.string().min(1, "Pick a user."),
  role: z.enum(ROLES),
});

export type ActionResult<T = object> =
  | ({ ok: true } & T)
  | { ok: false; error: string };

/** Counts the administrators left, so we never remove the last one. */
function adminCount(): number {
  return first<{ count: number }>("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'")
    ?.count ?? 0;
}

/**
 * Changes a user's role. Guarded so an administrator cannot lock themselves
 * out: you may not change your own role, and you may not demote the last admin.
 */
export async function setUserRoleAction(
  userId: string,
  role: string,
): Promise<ActionResult> {
  const actor = await requireAdminOrThrow();

  const parsed = roleSchema.safeParse({ userId, role });
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

  if (actor.id === userId) {
    return { ok: false, error: "You cannot change your own role." };
  }

  const target = first<{ id: string; role: string }>(
    "SELECT id, role FROM users WHERE id = ?",
    userId,
  );
  if (!target) return { ok: false, error: "That account no longer exists." };

  if (target.role === "admin" && role !== "admin" && adminCount() <= 1) {
    return { ok: false, error: "This is the last administrator. Promote another admin first." };
  }

  run("UPDATE users SET role = ? WHERE id = ?", role, userId);
  revalidatePath("/admin");
  return { ok: true };
}

/**
 * Deletes an account. Cascade rules in the schema remove its progress rows;
 * sessions are cleared first because the sessions table references users.
 */
export async function deleteUserAction(userId: string): Promise<ActionResult> {
  const actor = await requireAdminOrThrow();

  if (actor.id === userId) {
    return { ok: false, error: "You cannot delete your own account." };
  }

  const target = first<{ id: string; role: string }>(
    "SELECT id, role FROM users WHERE id = ?",
    userId,
  );
  if (!target) return { ok: false, error: "That account no longer exists." };

  if (target.role === "admin" && adminCount() <= 1) {
    return { ok: false, error: "This is the last administrator, so it cannot be deleted." };
  }

  run("DELETE FROM sessions WHERE user_id = ?", userId);
  run("DELETE FROM users WHERE id = ?", userId);
  revalidatePath("/admin");
  return { ok: true };
}
