import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getProgress } from "@/lib/queries";
import { learningPaths, lessonsForPath, levelForXp } from "@/content";
import { Card, ProgressBar, Pill, LinkButton, SectionHeading } from "@/components/ui";
import { Icon } from "@/components/icon-registry";

export const metadata: Metadata = {
  title: "Learn",
  description: "Structured learning paths that take you from first tag to full project.",
};

export default async function LearnPage() {
  const user = await requireUser();
  const progress = getProgress(user.id);

  const rows = learningPaths.map((path) => {
    const lessons = lessonsForPath(path.slug);
    const done = lessons.filter((lesson) => progress.completedLessons.has(lesson.slug)).length;
    const inProgress = lessons.some(
      (lesson) =>
        progress.startedLessons.has(lesson.slug) && !progress.completedLessons.has(lesson.slug),
    );
    const nextLesson =
      lessons.find((lesson) => !progress.completedLessons.has(lesson.slug)) ?? null;
    return { path, lessons, done, inProgress, nextLesson };
  });

  const totalLessons = rows.reduce((sum, row) => sum + row.lessons.length, 0);
  const totalDone = rows.reduce((sum, row) => sum + row.done, 0);
  const level = levelForXp(0);

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          level="h1"
          eyebrow="Web development"
          title="Learning paths"
          sub="Short, practical lessons with examples, exercises and a quiz at the end. Finish one path and you have real skills — not just notes."
        />
        <div className="text-right">
          <p className="text-2xl font-bold text-ink">
            {totalDone}/{totalLessons}
          </p>
          <p className="text-xs text-muted">lessons completed</p>
        </div>
      </section>

      <ProgressBar value={totalDone} max={totalLessons || 1} label="Overall curriculum" />

      <section className="grid gap-4 sm:grid-cols-2">
        {rows.map(({ path, lessons, done, nextLesson }) => {
          const complete = lessons.length > 0 && done === lessons.length;
          return (
            <Card key={path.slug} className="flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <span
                  className="grid size-11 place-items-center rounded-xl bg-surface-2 text-brand ring-1 ring-line"
                  aria-hidden
                >
                  <Icon name={path.icon} size={20} />
                </span>
                {complete ? (
                  <Pill tone="success">✓ Complete</Pill>
                ) : done > 0 ? (
                  <Pill tone="brand">In progress</Pill>
                ) : (
                  <Pill>{lessons.length} lessons</Pill>
                )}
              </div>

              <h2 className="mt-3 text-lg font-bold text-ink">{path.title}</h2>
              <p className="text-sm font-medium text-brand">{path.tagline}</p>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                {path.description}
              </p>

              <div className="mt-4">
                <ProgressBar value={done} max={lessons.length || 1} showValue={false} />
                <p className="mt-1.5 text-xs text-muted">
                  {done} of {lessons.length} lessons
                </p>
              </div>

              <div className="mt-4 pt-1">
                <LinkButton
                  href={
                    nextLesson
                      ? `/learn/${path.slug}/${nextLesson.slug}`
                      : `/learn/${path.slug}`
                  }
                  variant={done > 0 && !complete ? "primary" : "secondary"}
                  size="sm"
                >
                  {done === 0 ? "Start path" : complete ? "Review path" : "Continue"}
                </LinkButton>
              </div>
            </Card>
          );
        })}
      </section>

      <Card flat className="flex flex-wrap items-center justify-between gap-3 bg-surface-2">
        <div>
          <p className="text-sm font-semibold text-ink">Not sure where to begin?</p>
          <p className="text-sm text-muted">
            Start with HTML — every other path builds on it. Level: {level.title}.
          </p>
        </div>
        <Link href="/learn/html/html-your-first-page" className="text-sm font-semibold text-brand hover:underline">
          Go to lesson 1 →
        </Link>
      </Card>
    </div>
  );
}
