import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getProgress } from "@/lib/queries";
import { getPath, lessonsForPath } from "@/content";
import { SectionHeading, Card, ProgressBar, Pill, LinkButton, EmptyState } from "@/components/ui";
import { Icon } from "@/components/icon-registry";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path: string }>;
}): Promise<Metadata> {
  const { path: pathSlug } = await params;
  const path = getPath(pathSlug);
  return { title: path ? `${path.title} path` : "Learning path" };
}

export default async function PathPage({ params }: { params: Promise<{ path: string }> }) {
  const { path: pathSlug } = await params;
  const path = getPath(pathSlug);
  if (!path) notFound();

  const user = await requireUser();
  const progress = getProgress(user.id);
  const lessons = lessonsForPath(pathSlug);
  const done = lessons.filter((lesson) => progress.completedLessons.has(lesson.slug));
  const nextLesson = lessons.find((lesson) => !progress.completedLessons.has(lesson.slug));

  return (
    <div className="space-y-6">
      <section>
        <Link href="/learn" className="text-sm font-semibold text-brand hover:underline">
          ← All learning paths
        </Link>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <SectionHeading level="h1" eyebrow={path.tagline} title={path.title} sub={path.description} />
          <span className="grid size-14 place-items-center rounded-2xl bg-surface-2 text-brand ring-1 ring-line">
            <Icon name={path.icon} size={26} />
          </span>
        </div>

        <div className="mt-4 max-w-xl">
          <ProgressBar
            value={done.length}
            max={lessons.length || 1}
            label={`${done.length} of ${lessons.length} lessons complete`}
          />
        </div>
      </section>

      {nextLesson && (
        <Card className="flex flex-wrap items-center justify-between gap-3 bg-brand-soft/60">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand">Up next</p>
            <p className="mt-0.5 font-bold text-ink">{nextLesson.title}</p>
            <p className="text-sm text-muted">{nextLesson.summary}</p>
          </div>
          <LinkButton href={`/learn/${path.slug}/${nextLesson.slug}`}>
            Continue <Icon name="chevronRight" size={16} />
          </LinkButton>
        </Card>
      )}

      {lessons.length === 0 ? (
        <EmptyState
          icon="📚"
          title="Lessons are being written"
          body="This path exists, but its lessons have not been added yet. Pick another path for now."
          action={<LinkButton href="/learn" variant="secondary">Back to learning</LinkButton>}
        />
      ) : (
        <ol className="space-y-3">
          {lessons.map((lesson, index) => {
            const complete = progress.completedLessons.has(lesson.slug);
            const started = progress.startedLessons.has(lesson.slug);
            const score = progress.lessonScores.get(lesson.slug);
            return (
              <li key={lesson.slug}>
                <Link
                  href={`/learn/${path.slug}/${lesson.slug}`}
                  className="bv-card-flat flex items-center gap-4 p-4 transition hover:border-brand/40 hover:shadow-[var(--bv-shadow)]"
                >
                  <span
                    className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
                      complete
                        ? "bg-success-soft text-success"
                        : started
                          ? "bg-brand-soft text-brand"
                          : "bg-surface-2 text-muted"
                    }`}
                    aria-hidden
                  >
                    {complete ? "✓" : index + 1}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-ink">{lesson.title}</span>
                      {complete && score && (
                        <Pill tone="success">
                          Quiz {score.score}/{score.total}
                        </Pill>
                      )}
                      {started && !complete && <Pill tone="brand">In progress</Pill>}
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-muted">
                      {lesson.summary}
                    </span>
                  </span>

                  <span className="hidden shrink-0 items-center gap-1 text-xs text-muted sm:flex">
                    <Icon name="clock" size={13} /> {lesson.minutes} min
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
