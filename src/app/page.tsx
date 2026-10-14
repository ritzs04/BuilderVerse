import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icon-registry";
import { ThemeToggle } from "@/components/theme-toggle";
import { learningPaths, guidedProjects, thinkingChallenges, debugChallenges } from "@/content";

export const metadata: Metadata = {
  title: "BuilderVerse — Learn to code by building",
  description:
    "Interactive lessons, thinking puzzles, debugging practice and guided projects — turn coding from a theory into a skill you can show.",
};

const NAV = [
  { href: "#learn", label: "Learn" },
  { href: "#think", label: "Thinking Gym" },
  { href: "#debug", label: "Error Companion" },
  { href: "#build", label: "Projects" },
  { href: "#gamify", label: "Motivation" },
  { href: "/about", label: "About" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-accent text-white">
              <Icon name="braces" size={18} />
            </span>
            BuilderVerse
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-ink-soft sm:flex">
            {NAV.map((item) => (
              <Link key={item.label} href={item.href} className="transition hover:text-ink">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="bv-btn bv-btn-ghost !px-4 !py-2 !text-[0.8rem]">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="bv-btn bv-btn-primary !px-4 !py-2 !text-[0.8rem] hidden sm:inline-flex"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* ------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden">
        <div className="bv-grid-bg absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5 py-20 text-center sm:py-28">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
            <Icon name="zap" size={13} /> Learn by building, not just reading
          </p>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            Go from your first HTML tag to a{" "}
            <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
              portfolio you built yourself
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            BuilderVerse turns “I watched the tutorials” into “I can actually do this.” Interactive
            lessons, mental-puzzle challenges, friendly debugging practice and guided projects —
            with XP, streaks and badges keeping you honest.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup" className="bv-btn bv-btn-primary !px-6 !py-3.5 !text-base">
              Start building free
            </Link>
            <Link href="/learn" className="bv-btn bv-btn-secondary !px-6 !py-3.5 !text-base">
              Browse lessons
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {[
              { icon: "book", label: "27 lessons" },
              { icon: "brain", label: "10 thinking puzzles" },
              { icon: "bug", label: "10 debug puzzles" },
              { icon: "rocket", label: "5 guided projects" },
            ].map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink-soft"
              >
                <Icon name={chip.icon} size={13} className="text-brand" /> {chip.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ learn paths */}
      <section id="learn" className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
              Structured paths
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Six paths. One goal: real skill.</h2>
            <p className="mt-3 text-muted">
              Every lesson ends with a quiz, so completing a path means you can actually use it —
              not just recognize it.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {learningPaths.map((path) => (
              <Link
                key={path.slug}
                href={`/learn/${path.slug}`}
                className="bv-card p-5 transition hover:border-brand/40 hover:shadow-[var(--bv-shadow)]"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-surface-2 text-brand ring-1 ring-line">
                  <Icon name={path.icon} size={20} />
                </span>
                <h3 className="mt-3 font-bold text-ink">{path.title}</h3>
                <p className="text-sm font-medium text-brand">{path.tagline}</p>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                  {path.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- thinking */}
      <section id="think" className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Thinking Gym</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Employers hire how you think — not how fast you type.
            </h2>
            <p className="mt-3 leading-relaxed text-muted">{thinkingChallenges[0]?.prompt}</p>
            <ul className="mt-6 space-y-3">
              {[
                "Decomposition: a scary problem becomes small doable steps",
                "Edge cases: the inputs everyone forgets",
                "Explaining out loud — the number one interview skill",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
                  <Icon name="checkCircle" size={17} className="mt-0.5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            {thinkingChallenges.slice(0, 3).map((challenge) => (
              <Link key={challenge.slug} href={`/think/${challenge.slug}`} className="block">
                <div className="bv-card-flat flex items-center gap-4 p-4 transition hover:border-brand/40">
                  <span className="text-2xl" aria-hidden>🧠</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ink">{challenge.title}</p>
                    <p className="truncate text-sm text-muted">{challenge.prompt}</p>
                  </div>
                  <span className="text-xs font-bold text-accent">{challenge.difficulty}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ debug */}
      <section id="debug" className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="bv-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wide text-danger">Bug 1 of 10</p>
                <span className="text-xs font-bold text-success">+30 XP</span>
              </div>
              <pre className="bv-pre !m-0">{`const user = { name: "Ava" };
const greeting = "Hello, " + nam;
console.log(greeting);`}</pre>
              <p className="mt-4 rounded-xl bg-warning-soft px-3 py-2 text-sm text-ink-soft">
                🐛 Console says <code className="text-warning">nam is not defined</code>…
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
              Error Companion
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Every bug is a puzzle — never a scolding.
            </h2>
            <p className="mt-3 leading-relaxed text-muted">{debugChallenges[0]?.explanation}</p>
            <Link href="/debug" className="bv-btn bv-btn-secondary mt-6">
              Try a debugging puzzle
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- projects */}
      <section id="build" className="mx-auto max-w-6xl px-5 py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
            Guided projects
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Finish one. You&apos;ll shock yourself.
          </h2>
          <p className="mt-3 text-muted">
            A mini app is worth more on your resume than a certificate. Each project comes with a
            checklist, real-world requirements and a step-by-step path.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guidedProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/build/${project.slug}`}
              className="bv-card p-5 transition hover:border-brand/40 hover:shadow-[var(--bv-shadow)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-surface-2 text-brand ring-1 ring-line">
                  <Icon name={project.icon} size={20} />
                </span>
                <span className="bv-pill">{project.difficulty}</span>
              </div>
              <h3 className="mt-3 font-bold text-ink">{project.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{project.tagline}</p>
              <p className="mt-3 text-xs text-muted">
                {project.youWillLearn.slice(0, 2).join(" · ")}…
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------ gamification */}
      <section id="gamify" className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: "zap",
              title: "XP",
              body: "Earn points for every first-time win: lessons, puzzles, missions and builds.",
            },
            {
              icon: "flame",
              title: "Streaks",
              body: "A daily mission keeps you coming back — small steps compound fast.",
            },
            {
              icon: "trophy",
              title: "Levels",
              body: "Apprentice → Maker. Your level reflects real progress, not attendance.",
            },
            {
              icon: "star",
              title: "Badges",
              body: "Teach someone, debug like a pro, ship a project — collect the proof.",
            },
          ].map((item) => (
            <div key={item.title}>
              <span className="grid size-11 place-items-center rounded-xl bg-brand-soft text-brand">
                <Icon name={item.icon} size={20} />
              </span>
              <h3 className="mt-3 font-bold text-ink">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- CTA */}
      <section className="mx-auto max-w-6xl px-5 py-24 text-center">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
          Your resume needs a project.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Create a free account, complete your first lesson in under 10 minutes, and give yourself
          something to show for that “I can learn anything” claim.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup" className="bv-btn bv-btn-primary !px-6 !py-3.5 !text-base">
            Create your free account
          </Link>
          <Link href="/about" className="bv-btn bv-btn-ghost !px-6 !py-3.5 !text-base">
            Learn more about the project
          </Link>
        </div>
      </section>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
            <span className="grid size-7 place-items-center rounded-lg bg-brand-soft text-brand">
              <Icon name="braces" size={14} />
            </span>
            BuilderVerse — a learning platform you build with.
          </p>
          <p className="text-xs text-muted">
            Built with Next.js, React, TypeScript and SQLite · No tracking, no ads.
          </p>
        </div>
      </footer>
    </div>
  );
}