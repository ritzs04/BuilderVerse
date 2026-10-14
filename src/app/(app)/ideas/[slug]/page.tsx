import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getProgress } from "@/lib/queries";
import { projectIdeas } from "@/content";
import { Pill, LinkButton } from "@/components/ui";
import { Icon } from "@/components/icon-registry";
import { BookmarkButton } from "@/components/bookmark-button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const idea = projectIdeas.find((i) => i.slug === slug);
  return { title: idea ? `${idea.title} · Ideas Vault` : "Idea" };
}

export default async function IdeaPage({ params }: Props) {
  const { slug } = await params;
  const idea = projectIdeas.find((i) => i.slug === slug);
  if (!idea) notFound();

  const user = await requireUser();
  const progress = getProgress(user.id);
  const saved = progress.bookmarkedIdeas.has(idea.slug);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/ideas" className="font-semibold text-brand hover:underline">
          Ideas Vault
        </Link>
        <Icon name="chevronRight" size={13} />
        <span className="text-ink">{idea.title}</span>
      </nav>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Pill
            tone={
              idea.difficulty === "Beginner"
                ? "success"
                : idea.difficulty === "Intermediate"
                  ? "brand"
                  : "warning"
            }
          >
            {idea.difficulty}
          </Pill>
          {idea.categories.map((category) => (
            <Pill key={category}>{category}</Pill>
          ))}
          <BookmarkButton refType="idea" refSlug={idea.slug} initialSaved={saved} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">{idea.title}</h1>
        <p className="text-base leading-relaxed text-ink-soft">{idea.problem}</p>
        <div className="flex flex-wrap gap-1.5">
          {idea.tech.map((tech) => (
            <Pill key={tech}>{tech}</Pill>
          ))}
        </div>
      </header>

      <section className="bv-card p-5" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-base font-bold text-ink">
          Core features
        </h2>
        <ul className="mt-3 space-y-2">
          {idea.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-ink-soft">
              <Icon name="list" size={16} className="mt-0.5 shrink-0 text-brand" />
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <section className="bv-card p-5" aria-labelledby="goals-heading">
        <h2 id="goals-heading" className="text-base font-bold text-ink">
          What this teaches you
        </h2>
        <ul className="mt-3 space-y-2">
          {idea.learningGoals.map((goal, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-ink-soft">
              <Icon name="target" size={16} className="mt-0.5 shrink-0 text-success" />
              {goal}
            </li>
          ))}
        </ul>
      </section>

      <section className="bv-card p-5" aria-labelledby="extensions-heading">
        <h2 id="extensions-heading" className="text-base font-bold text-ink">
          Stretch goals
        </h2>
        <ul className="mt-3 space-y-2">
          {idea.extensions.map((extension, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-ink-soft">
              <Icon name="sparkles" size={16} className="mt-0.5 shrink-0 text-accent" />
              {extension}
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <LinkButton href="/ideas" variant="secondary" size="sm">
          <Icon name="chevronLeft" size={16} /> All ideas
        </LinkButton>
        <LinkButton href="/build" size="sm">
          Try a guided project instead <Icon name="chevronRight" size={16} />
        </LinkButton>
      </div>
    </div>
  );
}