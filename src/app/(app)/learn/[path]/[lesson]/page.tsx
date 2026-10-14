import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getProgress } from "@/lib/queries";
import { getPath, getLesson, lessonsForPath } from "@/content";
import { Pill, LinkButton, ProgressBar } from "@/components/ui";
import { Icon } from "@/components/icon-registry";
import { CodeBlock } from "@/components/code-block";
import { LessonLab } from "@/components/lesson-lab";

interface Props {
  params: Promise<{ path: string; lesson: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson: slug } = await params;
  const lesson = getLesson(slug);
  return {
    title: lesson ? lesson.title : "Lesson",
    description: lesson?.summary,
  };
}

export default async function LessonPage({ params }: Props) {
  const { path: pathSlug, lesson: lessonSlug } = await params;
  const path = getPath(pathSlug);
  const lesson = getLesson(lessonSlug);
  if (!path || !lesson || lesson.pathSlug !== pathSlug) notFound();

  const user = await requireUser();
  const progress = getProgress(user.id);

  const siblings = lessonsForPath(pathSlug);
  const index = siblings.findIndex((l) => l.slug === lesson.slug);
  const previous = index > 0 ? siblings[index - 1] : null;
  const next = index < siblings.length - 1 ? siblings[index + 1] : null;
  const doneCount = siblings.filter((l) => progress.completedLessons.has(l.slug)).length;
  const score = progress.lessonScores.get(lesson.slug) ?? null;
  const complete = progress.completedLessons.has(lesson.slug);

  return (
    <div className="space-y-6">
      {/* -------------------------------------------------------- breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/learn" className="font-semibold text-brand hover:underline">
          Learn
        </Link>
        <Icon name="chevronRight" size={13} />
        <Link href={`/learn/${path.slug}`} className="font-semibold text-brand hover:underline">
          {path.title}
        </Link>
        <Icon name="chevronRight" size={13} />
        <span className="text-ink">{lesson.title}</span>
      </nav>

      {/* ----------------------------------------------------------- header */}
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="brand">
            Lesson {index + 1} of {siblings.length}
          </Pill>
          <Pill>
            <Icon name="clock" size={13} /> {lesson.minutes} min
          </Pill>
          <Pill tone="accent">{lesson.xp} XP</Pill>
          {complete && score && <Pill tone="success">✓ Quiz {score.score}/{score.total}</Pill>}
          {complete && !score && <Pill tone="success">✓ Completed</Pill>}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">{lesson.title}</h1>
        <p className="max-w-3xl text-base leading-relaxed text-muted">{lesson.summary}</p>
        <div className="max-w-md">
          <ProgressBar
            value={doneCount}
            max={siblings.length || 1}
            showValue={false}
            label={`${doneCount}/${siblings.length} in this path`}
          />
        </div>
      </header>

      <article className="max-w-3xl space-y-8">
        {/* ------------------------------------------------------- concept */}
        <section aria-labelledby="concept-heading">
          <h2 id="concept-heading" className="sr-only">Concept</h2>
          <p className="text-lg font-semibold leading-relaxed text-ink">{lesson.concept}</p>
        </section>

        <section className="space-y-4" aria-labelledby="explanation-heading">
          <h2 id="explanation-heading" className="text-base font-bold text-ink">
            The idea
          </h2>
          {lesson.explanation.map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-ink-soft">
              {paragraph}
            </p>
          ))}
        </section>

        {/* --------------------------------------------------------- analogy */}
        <section aria-labelledby="analogy-heading">
          <h2 id="analogy-heading" className="text-base font-bold text-ink">
            Think of it like…
          </h2>
          <div className="mt-3 rounded-2xl border border-accent/30 bg-brand-soft/60 p-5">
            <p className="leading-relaxed text-ink-soft">💡 {lesson.analogy}</p>
          </div>
        </section>

        {/* -------------------------------------------------------- example */}
        <section aria-labelledby="example-heading">
          <h2 id="example-heading" className="text-base font-bold text-ink">
            Example
          </h2>
          <div className="mt-3">
            <CodeBlock
              code={lesson.example.code}
              lang={lesson.example.lang}
              caption={lesson.example.caption}
            />
          </div>
        </section>

        {/* ------------------------------------------------------- sections */}
        {lesson.sections?.map((section, sectionIndex) => (
          <section key={sectionIndex} className="space-y-3">
            <h2 className="text-base font-bold text-ink">{section.heading}</h2>
            {section.body.map((paragraph, i) => (
              <p key={i} className="leading-relaxed text-ink-soft">
                {paragraph}
              </p>
            ))}
            {section.code && (
              <CodeBlock
                code={section.code.code}
                lang={section.code.lang}
                caption={section.code.caption}
              />
            )}
          </section>
        ))}

        {/* -------------------------------------------------- common mistakes */}
        <section aria-labelledby="mistakes-heading">
          <h2 id="mistakes-heading" className="text-base font-bold text-ink">
            Common mistakes
          </h2>
          <ul className="mt-3 space-y-3">
            {lesson.commonMistakes.map((item, i) => (
              <li key={i} className="rounded-2xl border border-line bg-surface-2 p-4">
                <p className="flex items-start gap-2 text-sm font-semibold text-danger">
                  <Icon name="alertTriangle" size={16} className="mt-0.5 shrink-0" />
                  {item.mistake}
                </p>
                <p className="mt-1.5 flex items-start gap-2 text-sm text-ink-soft">
                  <Icon name="check" size={16} className="mt-0.5 shrink-0 text-success" />
                  {item.fix}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </article>

      {/* --------------------------------------------------- interactive lab */}
      <div className="max-w-3xl">
        <LessonLab lesson={lesson} previousScore={score} wasCompleted={complete} />
      </div>

      {/* ----------------------------------------------------- prev / next */}
      <nav
        className="flex max-w-3xl flex-wrap items-center justify-between gap-3 border-t border-line pt-6"
        aria-label="Lesson navigation"
      >
        {previous ? (
          <LinkButton
            href={`/learn/${path.slug}/${previous.slug}`}
            variant="secondary"
            size="sm"
            aria-label={`Previous lesson: ${previous.title}`}
          >
            <Icon name="chevronLeft" size={16} /> Previous
          </LinkButton>
        ) : (
          <span />
        )}
        <div className="flex gap-3">
          <LinkButton href={`/learn/${path.slug}`} variant="ghost" size="sm">
            All {path.title} lessons
          </LinkButton>
          {next && (
            <LinkButton
              href={`/learn/${path.slug}/${next.slug}`}
              size="sm"
              aria-label={`Next lesson: ${next.title}`}
            >
              Next lesson <Icon name="chevronRight" size={16} />
            </LinkButton>
          )}
        </div>
      </nav>
    </div>
  );
}
