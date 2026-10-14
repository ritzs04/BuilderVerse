import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { searchContent } from "@/content";
import { Card, Pill, EmptyState, SectionHeading, Input } from "@/components/ui";
import { Icon } from "@/components/icon-registry";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Search",
};

const TYPE_LABEL: Record<string, { label: string; tone: "brand" | "accent" | "success" | "warning" }> = {
  lesson: { label: "Lesson", tone: "brand" },
  project: { label: "Project", tone: "success" },
  challenge: { label: "Challenge", tone: "accent" },
  idea: { label: "Idea", tone: "warning" },
  path: { label: "Path", tone: "brand" },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireUser();
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const hits = query.length >= 2 ? searchContent(query) : [];

  const grouped = hits.reduce(
    (groups, hit) => {
      (groups[hit.type] ??= []).push(hit);
      return groups;
    },
    {} as Record<string, typeof hits>,
  );

  const total = hits.length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <SectionHeading level="h1" eyebrow="Search everything" title="Find your next step" />

      <form action="/search" role="search">
        <div className="relative">
          <Icon
            name="search"
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <Input
            name="q"
            defaultValue={query}
            placeholder="e.g. flexbox, closures, fetch, portfolio…"
            aria-label="Search BuilderVerse content"
            className="!pl-10 !py-3.5 !text-base"
            autoFocus
          />
        </div>
      </form>

      {query.length === 0 && (
        <EmptyState
          icon="🔍"
          title="Type something to search"
          body="Everything — lessons, projects, thinking puzzles, debugging practice and ideas — is searchable."
        />
      )}

      {query.length < 2 && query.length > 0 && (
        <EmptyState icon="⌨️" title="Keep typing…" body="Search needs at least two characters." />
      )}

      {query.length >= 2 && total === 0 && (
        <EmptyState
          icon="🤔"
          title={`Nothing matched “${query}”`}
          body="Try a broader word, or browse the learning paths directly."
          action={
            <Link href="/learn" className="text-sm font-semibold text-brand hover:underline">
              Browse lessons →
            </Link>
          }
        />
      )}

      {query.length >= 2
        ? Object.entries(grouped).map(([type, items]) => (
            <section key={type} aria-label={`${type} results`}>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="font-bold text-ink">{TYPE_LABEL[type]?.label ?? type}</h2>
                <Pill>{items.length}</Pill>
              </div>
              <div className="space-y-2">
                {items.map((hit, index) => (
                  <Link key={`${type}-${index}`} href={hit.href} className="block">
                    <Card className="flex items-center gap-3 !p-4 transition hover:border-brand/40 hover:shadow-[var(--bv-shadow)]">
                      <Pill tone={TYPE_LABEL[type]?.tone}>{TYPE_LABEL[type]?.label}</Pill>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">
                          <Icon name="chevronRight" size={12} className="mr-1 text-muted" />
                          {hit.title}
                        </p>
                        <p className="truncate text-sm text-muted">{hit.subtitle}</p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))
        : null}
    </div>
  );
}