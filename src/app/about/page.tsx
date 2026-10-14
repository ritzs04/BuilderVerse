import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon-registry";
import { ThemeToggle } from "@/components/theme-toggle";
import { builderLevels } from "@/content";

export const metadata: Metadata = {
  title: "About BuilderVerse",
  description: "Why BuilderVerse exists, how it works, and the stack behind it.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="border-b border-line bg-bg/80 backdrop-blur">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-accent text-white">
              <Icon name="braces" size={18} />
            </span>
            BuilderVerse
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="bv-btn bv-btn-ghost !px-4 !py-2 !text-[0.8rem]">
              Sign in
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl space-y-14 px-5 py-20">
        <section className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">About</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            “Watching tutorials doesn&apos;t build skills. Building does.”
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted">
            BuilderVerse is a hands-on learning platform for the fundamentals of web development.
            Instead of a passive course, it is a daily practice loop: read a little, escape a
            thinking trap, squash a bug, build something real.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold tracking-tight">The problem it solves</h2>
          <div className="mt-4 space-y-4 leading-relaxed text-ink-soft">
            <p>
              Most beginners fall into the same trap: they consume great content but never convert
              it into ability. They finish the course, open a blank editor, and freeze.
            </p>
            <p>
              Interviews make it worse. “Why should we hire you with no projects?” loops in their
              head, so they spend months grinding tutorials instead of making something shippable.
            </p>
            <p>
              BuilderVerse rebalances the effort: <strong className="text-ink">20% reading, 80%
              doing</strong>, with tiny activities that feel achievable on a busy day and
              compounding so a month later the learner has real, demonstrable skills.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
          <div className="mt-4 space-y-3">
            {[
              {
                icon: "book",
                title: "Learning paths",
                body: "HTML → CSS → JavaScript → DOM → HTTP APIs → Git. Short lessons with examples, a “try it”, a mini challenge and a quiz.",
              },
              {
                icon: "brain",
                title: "Thinking Gym",
                body: "Puzzles that train decomposition and edge-case hunting — no code required, just clear reasoning you have to type out.",
              },
              {
                icon: "bug",
                title: "Error Companion",
                body: "Realistic buggy snippets with a friendly symptom, guiding hints and a plain-English fix. Debugging is a literacy, not a talent.",
              },
              {
                icon: "rocket",
                title: "Guided projects",
                body: "Five complete builds with checklists and real-world requirements — the exact things a portfolio needs.",
              },
              {
                icon: "lightbulb",
                title: "Ideas Vault",
                body: "Twenty more concepts with broken-down features and learning goals, ready for version two of your portfolio.",
              },
              {
                icon: "sparkles",
                title: "Builder AI",
                body: "An optional AI mentor that answers at your level and never shames you. Fully optional — every feature works without it.",
              },
            ].map((feature) => (
              <div key={feature.title} className="bv-card-flat flex items-start gap-4 p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                  <Icon name={feature.icon} size={18} />
                </span>
                <div>
                  <h3 className="font-bold text-ink">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{feature.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold tracking-tight">The game behind the learning</h2>
          <div className="mt-4 space-y-4 leading-relaxed text-ink-soft">
            <p>
              XP is awarded only for genuine first-time wins, so there is no grinding. Streaks come
              from a single daily mission. Levels — from Apprentice to Maker and beyond — measure
              real output, not attendance.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {builderLevels.slice(0, 3).map((level) => (
                <div key={level.level} className="bv-card !p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-brand">
                    Level {level.level}
                  </p>
                  <p className="mt-1 font-bold text-ink">{level.title}</p>
                  <p className="text-xs italic text-muted">“{level.motto}”</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold tracking-tight">The stack</h2>
          <p className="mt-3 leading-relaxed text-muted">
            BuilderVerse is a single Next.js application built with React and TypeScript, styled
            with Tailwind CSS, and storing learner progress in SQLite. The curriculum lives as
            typed content files in the repo, which keeps lessons versionable and easy to review.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Next.js", "React", "TypeScript", "Tailwind CSS", "SQLite", "better-sqlite3", "bcrypt"].map(
              (tech) => (
                <span key={tech} className="bv-pill">
                  {tech}
                </span>
              ),
            )}
          </div>
        </section>

        <section className="bv-card text-center">
          <h2 className="text-xl font-bold text-ink">Ready to stop scrolling and start building?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            First lesson takes under 10 minutes. Your first real project is a few sessions away.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup" className="bv-btn bv-btn-primary">
              Create your free account
            </Link>
            <Link href="/" className="bv-btn bv-btn-ghost">
              ← Back to home
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-surface">
        <p className="mx-auto max-w-4xl px-5 py-8 text-center text-xs text-muted">
          BuilderVerse — a learning platform you build with. Built with Next.js, React, TypeScript
          and SQLite.
        </p>
      </footer>
    </div>
  );
}