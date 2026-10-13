import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui";

/**
 * Administrator shell.
 *
 * `requireAdmin()` is the security boundary for every route under here: it
 * reads the role from the session's database row and redirects anyone who is
 * not an administrator. Students who type /admin directly land on /dashboard.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-dvh bg-surface-1">
      <header className="border-b border-line bg-surface-2">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-5 py-3.5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-accent text-base text-white"
            >
              🛡️
            </span>
            <span>
              <span className="block text-sm font-bold text-ink">BuilderVerse Admin</span>
              <span className="block text-xs text-muted">Platform management</span>
            </span>
          </Link>

          <nav aria-label="Administrator" className="ml-auto flex items-center gap-1">
            <Link
              href="/admin"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-soft transition hover:bg-surface-3 hover:text-ink"
            >
              Overview
            </Link>
            <Link
              href="/admin/users"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-soft transition hover:bg-surface-3 hover:text-ink"
            >
              Accounts
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-soft transition hover:bg-surface-3 hover:text-ink"
            >
              Student view
            </Link>
          </nav>

          <div className="flex items-center gap-2.5 border-l border-line pl-4">
            <span className="hidden text-xs text-muted sm:block">{admin.name}</span>
            <form action={logoutAction}>
              <Button variant="ghost" size="sm" type="submit">
                Log out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
