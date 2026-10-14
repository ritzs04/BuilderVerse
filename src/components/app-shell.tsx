"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { clsx } from "clsx";
import { Avatar, Pill } from "@/components/ui";
import { Icon } from "@/components/icon-registry";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell, type BellNotification } from "@/components/notification-bell";
import { logoutAction } from "@/app/actions/auth";

export interface ShellUser {
  name: string;
  username: string;
  avatar: string;
  xp: number;
  levelNumber: number;
  levelTitle: string;
  levelProgress: number;
  streak: number;
}

const primaryNav = [
  { href: "/dashboard", label: "Dashboard", icon: "home" },
  { href: "/learn", label: "Learn", icon: "book" },
  { href: "/think", label: "Thinking Gym", icon: "brain" },
  { href: "/debug", label: "Debugging", icon: "bug" },
  { href: "/build", label: "Projects", icon: "hammer" },
  { href: "/ideas", label: "Ideas Vault", icon: "lightbulb" },
  { href: "/assistant", label: "Builder AI", icon: "sparkles" },
  { href: "/profile", label: "Profile", icon: "user" },
];

const bottomNav = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/learn", label: "Learn", icon: "book" },
  { href: "/build", label: "Build", icon: "hammer" },
  { href: "/think", label: "Think", icon: "brain" },
  { href: "/profile", label: "Profile", icon: "user" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({
  user,
  notifications,
  children,
}: {
  user: ShellUser;
  notifications: BellNotification[];
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg">
      {/* ---------------------------------------------------------- sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-bg-elevated lg:flex">
        <Link href="/dashboard" className="flex items-center gap-2 px-5 pt-5 pb-4">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-accent text-sm font-black text-white">
            B
          </span>
          <span className="text-[0.95rem] font-extrabold tracking-tight text-ink">
            Builder<span className="text-brand">Verse</span>
          </span>
        </Link>

        <nav aria-label="Main" className="flex-1 space-y-1 px-3 py-2">
          {primaryNav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                  active
                    ? "bg-brand-soft text-brand"
                    : "text-ink-soft hover:bg-surface-2 hover:text-ink",
                )}
              >
                <Icon name={item.icon} size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-4">
          <div className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink">Level {user.levelNumber}</span>
              <span className="font-mono text-xs text-muted">{user.xp} XP</span>
            </div>
            <p className="mt-0.5 text-sm font-semibold text-brand">{user.levelTitle}</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand to-accent"
                style={{ width: `${user.levelProgress}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <Link href="/settings" className="font-semibold text-muted hover:text-ink">
                Settings
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="font-semibold text-muted transition hover:text-danger"
                >
                  Log out
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------ topbar */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-md">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
              <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-brand to-accent text-xs font-black text-white">
                B
              </span>
              <span className="text-sm font-extrabold text-ink">
                Builder<span className="text-brand">Verse</span>
              </span>
            </Link>

            <form action="/search" method="get" className="hidden flex-1 sm:block sm:max-w-md">
              <label htmlFor="shell-search" className="sr-only">
                Search lessons, projects and ideas
              </label>
              <input
                id="shell-search"
                type="search"
                name="q"
                placeholder="Search lessons, projects, ideas…"
                className="bv-input !py-2 !text-sm"
                autoComplete="off"
              />
            </form>

            <div className="ml-auto flex items-center gap-1">
              <Link
                href="/search"
                className="bv-btn bv-btn-ghost !p-2 sm:hidden"
                aria-label="Search"
              >
                <Icon name="search" size={17} />
              </Link>
              <NotificationBell notifications={notifications} />
              <ThemeToggle />
              <Link
                href="/profile"
                className="ml-1 flex items-center gap-2 rounded-full p-0.5 transition hover:bg-surface-2"
                aria-label="Open profile"
              >
                <Avatar emoji={user.avatar} size="sm" />
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-28 sm:px-6 lg:pb-12">
          {children}
        </main>
      </div>

      {/* ------------------------------------------------------- bottom nav */}
      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg-elevated/95 backdrop-blur-md lg:hidden"
      >
        <ul className="mx-auto flex max-w-md items-stretch justify-between">
          {bottomNav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "flex flex-col items-center gap-1 py-2.5 text-[0.68rem] font-semibold transition",
                    active ? "text-brand" : "text-muted",
                  )}
                >
                  <Icon name={item.icon} size={19} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Floating streak pill for small screens */}
      {user.streak > 0 && (
        <div className="fixed right-4 bottom-20 z-30 lg:hidden">
          <Pill tone="warning" className="shadow-[var(--bv-shadow)]">
            🔥 {user.streak} day{user.streak === 1 ? "" : "s"}
          </Pill>
        </div>
      )}
    </div>
  );
}
