import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth";
import { getStats } from "@/lib/gamification";
import { getNotifications } from "@/lib/queries";
import { levelForXp, levelProgress } from "@/content";
import { AppShell } from "@/components/app-shell";

/**
 * All routes inside this group are protected: no session → redirect to /login.
 * The layout owns the shell (sidebar, topbar, mobile navigation).
 */
export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  const stats = getStats(user.id);
  const level = levelForXp(stats.xp);

  return (
    <AppShell
      user={{
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        xp: stats.xp,
        levelNumber: level.level,
        levelTitle: level.title,
        levelProgress: levelProgress(stats.xp),
        streak: stats.streak,
      }}
      notifications={getNotifications(user.id).map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        href: n.href,
        is_read: n.is_read,
        created_at: n.created_at,
      }))}
    >
      {children}
    </AppShell>
  );
}
