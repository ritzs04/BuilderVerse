import type { ReactNode } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-bg">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bv-grid-bg" aria-hidden />

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-accent text-sm font-black text-white">
            B
          </span>
          <span className="text-[0.95rem] font-extrabold tracking-tight text-ink">
            Builder<span className="text-brand">Verse</span>
          </span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        <div className="bv-card bv-fade-up w-full max-w-md p-6 sm:p-8">
          {children}
        </div>
      </main>

      <footer className="relative z-10 pb-6 text-center text-xs text-muted">
        BuilderVerse · Learn. Think. Build.
      </footer>
    </div>
  );
}
