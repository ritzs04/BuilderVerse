import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getProgress } from "@/lib/queries";
import { debugChallenges, debugLanguageLabels } from "@/content";
import { Pill, LinkButton } from "@/components/ui";
import { Icon } from "@/components/icon-registry";
import { CodeBlock } from "@/components/code-block";
import { DebugLab } from "@/components/debug/debug-lab";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const challenge = debugChallenges.find((c) => c.slug === slug);
  return { title: challenge ? `${challenge.title} · Error Companion` : "Puzzle" };
}

export default async function DebugPuzzlePage({ params }: Props) {
  const { slug } = await params;
  const index = debugChallenges.findIndex((c) => c.slug === slug);
  if (index === -1) notFound();

  const challenge = debugChallenges[index];
  const previous = index > 0 ? debugChallenges[index - 1] : null;
  const next = index < debugChallenges.length - 1 ? debugChallenges[index + 1] : null;

  const user = await requireUser();
  const progress = getProgress(user.id);
  const solved = progress.solvedDebug.has(challenge.slug);

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/debug" className="font-semibold text-brand hover:underline">
          Error Companion
        </Link>
        <Icon name="chevronRight" size={13} />
        <span className="text-ink">{challenge.title}</span>
      </nav>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="brand">{debugLanguageLabels[challenge.language]}</Pill>
          <Pill
            tone={
              challenge.difficulty === "Hard" || challenge.difficulty === "Expert"
                ? "warning"
                : "neutral"
            }
          >
            {challenge.difficulty}
          </Pill>
          <Pill tone="accent">⚡ {challenge.xp} XP</Pill>
          {solved && <Pill tone="success">✓ Squashed</Pill>}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">{challenge.title}</h1>
        <p className="max-w-3xl text-base leading-relaxed text-ink-soft">{challenge.symptom}</p>
      </header>

      <div className="max-w-3xl space-y-6">
        <section aria-labelledby="buggy-heading">
          <h2 id="buggy-heading" className="text-base font-bold text-ink">
            The code
          </h2>
          <div className="mt-3">
            <CodeBlock code={challenge.buggyCode} lang={challenge.language} caption="Buggy version" />
          </div>
        </section>

        <DebugLab
          debugSlug={challenge.slug}
          hints={challenge.hints}
          canSubmit={Boolean(challenge.checks)}
          initiallySolved={solved}
          guidingQuestion={challenge.guidingQuestion}
          whatHappened={challenge.whatHappened}
          whyItHappened={challenge.whyItHappened}
          explanation={challenge.explanation}
          fixedCode={challenge.fixedCode}
          fixSummary={challenge.fixSummary}
        />

        <nav
          className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6"
          aria-label="Puzzle navigation"
        >
          {previous ? (
            <LinkButton href={`/debug/${previous.slug}`} variant="secondary" size="sm">
              <Icon name="chevronLeft" size={16} /> Previous
            </LinkButton>
          ) : (
            <span />
          )}
          <LinkButton href="/debug" variant="ghost" size="sm">
            All puzzles
          </LinkButton>
          {next ? (
            <LinkButton href={`/debug/${next.slug}`} size="sm">
              Next puzzle <Icon name="chevronRight" size={16} />
            </LinkButton>
          ) : (
            <LinkButton href="/build" size="sm">
              Start a project <Icon name="chevronRight" size={16} />
            </LinkButton>
          )}
        </nav>
      </div>
    </div>
  );
}
