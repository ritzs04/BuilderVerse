import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getProgress } from "@/lib/queries";
import { thinkingChallenges, thinkingCategoryLabels } from "@/content";
import { Pill, LinkButton } from "@/components/ui";
import { Icon } from "@/components/icon-registry";
import { ThinkingLab } from "@/components/thinking/thinking-lab";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const challenge = thinkingChallenges.find((c) => c.slug === slug);
  return { title: challenge ? `${challenge.title} · Thinking Gym` : "Challenge" };
}

export default async function ThinkingChallengePage({ params }: Props) {
  const { slug } = await params;
  const index = thinkingChallenges.findIndex((c) => c.slug === slug);
  if (index === -1) notFound();

  const challenge = thinkingChallenges[index];
  const previous = index > 0 ? thinkingChallenges[index - 1] : null;
  const next = index < thinkingChallenges.length - 1 ? thinkingChallenges[index + 1] : null;

  const user = await requireUser();
  const progress = getProgress(user.id);
  const solved = progress.solvedThinking.has(challenge.slug);

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/think" className="font-semibold text-brand hover:underline">
          Thinking Gym
        </Link>
        <Icon name="chevronRight" size={13} />
        <span className="text-ink">{challenge.title}</span>
      </nav>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="brand">{thinkingCategoryLabels[challenge.category]}</Pill>
          <Pill tone={challenge.difficulty === "Hard" || challenge.difficulty === "Expert" ? "warning" : "neutral"}>
            {challenge.difficulty}
          </Pill>
          <Pill tone="accent">⚡ {challenge.xp} XP</Pill>
          {solved && <Pill tone="success">✓ Solved</Pill>}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">{challenge.title}</h1>
        <p className="max-w-3xl text-base leading-relaxed text-ink-soft">{challenge.prompt}</p>
      </header>

      <div className="max-w-3xl space-y-6">
        {challenge.context && (
          <section className="rounded-2xl border border-accent/30 bg-brand-soft/60 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-brand">Why this matters</p>
            <p className="mt-1.5 leading-relaxed text-ink-soft">{challenge.context}</p>
          </section>
        )}

        <ThinkingLab
          challengeSlug={challenge.slug}
          hints={challenge.hints}
          initiallySolved={solved}
        />

        <nav
          className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6"
          aria-label="Challenge navigation"
        >
          {previous ? (
            <LinkButton href={`/think/${previous.slug}`} variant="secondary" size="sm">
              <Icon name="chevronLeft" size={16} /> Previous
            </LinkButton>
          ) : (
            <span />
          )}
          <LinkButton href="/think" variant="ghost" size="sm">
            All challenges
          </LinkButton>
          {next ? (
            <LinkButton href={`/think/${next.slug}`} size="sm">
              Next challenge <Icon name="chevronRight" size={16} />
            </LinkButton>
          ) : (
            <LinkButton href="/debug" size="sm">
              Try the Error Companion <Icon name="chevronRight" size={16} />
            </LinkButton>
          )}
        </nav>
      </div>
    </div>
  );
}
