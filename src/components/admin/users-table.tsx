"use client";

import { useState, useTransition } from "react";
import { setUserRoleAction, deleteUserAction } from "@/app/actions/admin";
import { Button, Pill } from "@/components/ui";

export interface TableUser {
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

/**
 * Accounts table. This is a convenience layer only — the security lives in the
 * server actions, which re-check the caller's role on every call (§3).
 */
export function AdminUsersTable({
  users,
  currentAdminId,
}: {
  users: TableUser[];
  currentAdminId: string;
}) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function runAction(id: string, action: () => Promise<{ ok: boolean; error?: string }>) {
    setPendingId(id);
    setMessage(null);
    startTransition(async () => {
      const result = await action();
      setMessage(
        result.ok
          ? { kind: "ok", text: "Done." }
          : { kind: "error", text: result.error ?? "That did not work." },
      );
      setPendingId(null);
    });
  }

  return (
    <div className="space-y-3">
      {message && (
        <p
          role="status"
          className={
            message.kind === "ok"
              ? "rounded-xl bg-success-soft px-4 py-2.5 text-sm font-medium text-success"
              : "rounded-xl bg-danger-soft px-4 py-2.5 text-sm font-medium text-danger"
          }
        >
          {message.text}
        </p>
      )}

      <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
        <caption className="sr-only">BuilderVerse accounts with role controls</caption>
        <thead>
          <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
            <th scope="col" className="px-4 py-3 font-bold">Builder</th>
            <th scope="col" className="px-4 py-3 font-bold">Builder ID</th>
            <th scope="col" className="px-4 py-3 font-bold">Email</th>
            <th scope="col" className="px-4 py-3 font-bold">XP</th>
            <th scope="col" className="px-4 py-3 font-bold">Streak</th>
            <th scope="col" className="px-4 py-3 font-bold">Role</th>
            <th scope="col" className="px-4 py-3 font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelf = user.id === currentAdminId;
            const busy = isPending && pendingId === user.id;
            return (
              <tr key={user.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <span className="block font-semibold text-ink">{user.name}</span>
                  <span className="block text-xs text-muted">@{user.username}</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{user.builder_id}</td>
                <td className="px-4 py-3 text-xs text-muted">{user.email}</td>
                <td className="px-4 py-3 font-mono text-ink-soft">{user.xp}</td>
                <td className="px-4 py-3 text-ink-soft">{user.streak > 0 ? `🔥 ${user.streak}` : "—"}</td>
                <td className="px-4 py-3">
                  {user.role === "admin" ? (
                    <Pill tone="brand">🛡️ Admin</Pill>
                  ) : (
                    <Pill>Student</Pill>
                  )}
                </td>
                <td className="px-4 py-3">
                  {isSelf ? (
                    <span className="text-xs text-muted">This is you</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.role === "admin" ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={busy}
                          onClick={() => runAction(user.id, () => setUserRoleAction(user.id, "student"))}
                        >
                          {busy ? "Working…" : "Make student"}
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={busy}
                          onClick={() => runAction(user.id, () => setUserRoleAction(user.id, "admin"))}
                        >
                          {busy ? "Working…" : "Make admin"}
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={busy}
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete ${user.name}'s account and all their progress? This cannot be undone.`,
                            )
                          ) {
                            runAction(user.id, () => deleteUserAction(user.id));
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {users.length === 0 && <p className="px-4 py-8 text-center text-sm text-muted">No accounts yet.</p>}
    </div>
  );
}
