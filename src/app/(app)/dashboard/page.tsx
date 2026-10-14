import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getStats } from "@/lib/gamification";
import { getProgress, getRecentBadges, missionDoneToday } from "@/lib/queries";
import {
  allLessons,
  getBadge,
  learningPaths,
  lessonsForPath,
  levelForXp,
  levelProgress,
  missionForDate,
} from "@/content";
import { todayKey } from "@/lib/db";
import { Card, Pill, ProgressBar, Avatar, LinkButton, SectionHeading } from "@/components/ui";
import { Icon } from "@/components/icon-registry";
import { MissionCard } from "@/components/mission-card";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await requireUser();
  const stats = getStats(user.id);
  const progress = getProgress(user.id);
  const level = levelForXp(stats.xp);
  const mission = missionForDate(todayKey());
  const missionDone = missionDoneToday(user.id, mission.slug);

  const resumeLesson =
    allLessons.find(
      (lesson) => progress.startedLessons.has(lesson.slug) && !progress.completedLessons.has(lesson.slug),
    ) ?? allLessons.find((lesson) => !progress.completedLessons.has(lesson.slug));

  const pathProgress = learningPaths.map((path) => {
    const lessons = lessonsForPath(path.slug);
    const done = lessons.filter((lesson) => progress.completedLessons.has(lesson.slug)).length;
    return { path, done, total: lessons.length };
  });

  const recentBadges = getRecentBadges(user.id, 4)
    .map((row) => getBadge(row.badge_slug))
    .filter((badge): badge is NonNullable<typeof badge> => Boolean(badge));

  const recommendation = !missionDone
    ? { title: "Finish today's mission", body: mission.description, href: "#mission" }
    : resumeLesson
      ? {
          title: `Continue: ${resumeLesson.title}`,
          body: `${resumeLesson.pathTitle} path · about ${resumeLesson.minutes} minutes`,
          href: `/learn/${resumeLesson.pathSlug}/${resumeLesson.slug}`,
        }
      : stats.debugSolved < 5
        ? {
            title: "Sharpen your debugging",
            body: "Solve a few Error Companion puzzles — employers notice this skill.",
            href: "/debug",
          }
        : {
            title: "Start a guided project",
            body: "Lessons are done. Put them to work in a real build.",
            href: "/build",
          };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------ welcome */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar emoji={user.avatar} size="lg" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">
              Welcome back, {user.name.split(" ")[0]} 👋
            </h1>
            <p className="mt-0.5 text-sm text-muted">
              Level {level.level} · {level.title} · {level.motto}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="warning">🔥 {stats.streak} day streak</Pill>
          <Pill tone="brand">⚡ {stats.xp} XP</Pill>
          <Pill tone="accent">🏆 {stats.badgesEarned} badges</Pill>
        </div>
      </section>

      {/* -------------------------------------------------------- main column */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div id="mission">
          <MissionCard mission={mission} done={missionDone} />
        </div>

        <Card className="flex flex-col">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
            Continue learning
          </p>
          {resumeLesson ? (
            <>
              <h3 className="mt-1.5 text-lg font-bold text-ink">{resumeLesson.title}</h3>
              <p className="mt-1 text-sm text-muted">
                {resumeLesson.pathTitle} path · {resumeLesson.summary}
              </p>
              <div className="mt-auto pt-4">
                <LinkButton href={`/learn/${resumeLesson.pathSlug}/${resumeLesson.slug}`}>
                  Resume lesson <Icon name="chevronRight" size={16} />
                </LinkButton>
              </div>
            </>
          ) : (
            <>
              <h3 className="mt-1.5 text-lg font-bold text-ink">Every lesson completed 🎉</h3>
              <p className="mt-1 text-sm text-muted">
                You have finished the whole curriculum. Time to build something of your own.
              </p>
              <div className="mt-auto pt-4">
                <LinkButton href="/build">Pick a project</LinkButton>
              </div>
            </>
          )}
        </Card>

        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-success">
            Builder stats
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-3">
            {[
              { label: "XP", value: stats.xp },
              { label: "Level", value: level.level },
              { label: "Streak", value: `${stats.streak}d` },
              { label: "Projects", value: stats.projectsCompleted },
              { label: "Problems solved", value: stats.debugSolved + stats.thinkingSolved },
              { label: "Lessons", value: stats.lessonsCompleted },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-surface-2 px-3 py-2.5">
                <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted">
                  {stat.label}
                </dt>
                <dd className="text-lg font-bold text-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4">
            <ProgressBar value={levelProgress(stats.xp)} label={`Next: ${level.title}`} />
          </div>
        </Card>
      </section>

      {/* ----------------------------------------------------------- progress */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-ink">Learning progress</h2>
            <Link href="/learn" className="text-sm font-semibold text-brand hover:underline">
              Open learning paths
            </Link>
          </div>

          <div className="space-y-4">
            {pathProgress.map(({ path, done, total }) => (
              <ProgressBar
                key={path.slug}
                label={path.title}
                value={done}
                max={total || 1}
                tone={done === total && total > 0 ? "success" : "brand"}
              />
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Thinking solved", value: `${stats.thinkingSolved}` },
              { label: "Debug puzzles", value: `${stats.debugSolved}` },
              { label: "Missions done", value: `${stats.missionsCompleted}` },
              { label: "Portfolio projects", value: `${stats.portfolioProjects}` },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-line px-3 py-2.5 text-center">
                <p className="text-lg font-bold text-ink">{item.value}</p>
                <p className="text-[0.7rem] font-semibold text-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <SectionHeading eyebrow="Next step" title="What to do today" />
            <div className="mt-3 rounded-xl border border-brand/25 bg-brand-soft p-4">
              <p className="font-bold text-brand">{recommendation.title}</p>
              <p className="mt-1 line-clamp-3 text-sm text-ink-soft">{recommendation.body}</p>
              {recommendation.href !== "#mission" && (
                <Link
                  href={recommendation.href}
                  className="mt-2 inline-block text-sm font-semibold text-accent hover:underline"
                >
                  Go there →
                </Link>
              )}
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-ink">Recent achievements</h2>
              <Link href="/profile" className="text-sm font-semibold text-brand hover:underline">
                All badges
              </Link>
            </div>
            {recentBadges.length > 0 ? (
              <ul className="space-y-2">
                {recentBadges.map((badge) => (
                  <li
                    key={badge.slug}
                    className="flex items-center gap-3 rounded-xl bg-surface-2 px-3 py-2.5"
                  >
                    <span className="text-xl" aria-hidden>
                      {badge.icon}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{badge.name}</p>
                      <p className="text-xs text-muted">{badge.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-dashed border-line px-4 py-6 text-center">
                <p className="text-sm font-semibold text-ink">No badges yet</p>
                <p className="mt-1 text-xs text-muted">
                  Finish your first lesson and one will land here.
                </p>
                <LinkButton href="/learn" variant="secondary" size="sm" className="mt-3">
                  Start learning
                </LinkButton>
              </div>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}
