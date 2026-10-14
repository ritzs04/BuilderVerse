import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getStats } from "@/lib/gamification";
import { getPortfolioProjects, getProgress } from "@/lib/queries";
import {
  badges,
  getIdea,
  levelForXp,
  levelProgress,
  nextLevel,
} from "@/content";
import { Card, Pill, Avatar, ProgressBar, SectionHeading, EmptyState, LinkButton } from "@/components/ui";
import { Icon } from "@/components/icon-registry";
import { PortfolioManager } from "@/components/profile/portfolio-manager";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your Builder ID, badges, portfolio and saved ideas.",
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default async function ProfilePage() {
  const user = await requireUser();
  const stats = getStats(user.id);
  const progress = getProgress(user.id);
  const portfolio = getPortfolioProjects(user.id);
  const level = levelForXp(stats.xp);

  const bookmarkedIdeas = [...progress.bookmarkedIdeas]
    .map((slug) => ({ slug, idea: getIdea(slug) }))
    .filter((entry) => entry.idea);

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Your space" title="Builder ID" sub="Everything you have built and earned on BuilderVerse lives here." />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ------------------------------------------------ identity card */}
        <Card className="flex flex-col items-center text-center">
          <Avatar emoji={user.avatar} size="xl" />
          <h1 className="mt-3 text-xl font-bold text-ink">{user.name}</h1>
          <p className="text-sm text-muted">@{user.username}</p>
          <p className="mt-2 text-sm text-ink-soft">{user.headline}</p>

          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {user.github_url && (
              <a
                href={user.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
              >
                <Icon name="github" size={15} /> GitHub
              </a>
            )}
            {user.website_url && (
              <a
                href={user.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
              >
                <Icon name="globe" size={15} /> Website
              </a>
            )}
          </div>

          <div className="mt-5 w-full">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-bold text-ink">
                Level {level.level} · {level.title}
              </span>
              <span className="text-muted">{stats.xp} XP</span>
            </div>
            <div className="mt-2">
              <ProgressBar
                value={levelProgress(stats.xp)}
                showValue={false}
                label=""
              />
            </div>
            <p className="mt-2 text-xs italic text-muted">“{level.motto}”</p>
          </div>

          <div className="mt-5 grid w-full grid-cols-3 gap-2">
            {[
              { label: "XP", value: stats.xp },
              { label: "Streak", value: `${stats.streak}d` },
              { label: "Badges", value: stats.badgesEarned },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-surface-2 px-2 py-3">
                <p className="text-lg font-bold text-ink">{item.value}</p>
                <p className="text-[0.7rem] font-semibold text-muted">{item.label}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-muted">Member since {formatDate(user.created_at)}</p>
          <div className="mt-3">
            <LinkButton href="/settings" variant="secondary" size="sm">
              <Icon name="pencil" size={14} /> Edit profile
            </LinkButton>
          </div>
        </Card>

        {/* -------------------------------------------------- main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* stats */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Progress stats">
            {[
              { label: "Lessons completed", value: stats.lessonsCompleted, icon: "book" as const },
              { label: "Thinking solved", value: stats.thinkingSolved, icon: "brain" as const },
              { label: "Debug puzzles", value: stats.debugSolved, icon: "bug" as const },
              { label: "Projects finished", value: stats.projectsCompleted, icon: "rocket" as const },
              { label: "Missions done", value: stats.missionsCompleted, icon: "target" as const },
              { label: "Portfolio projects", value: portfolio.length, icon: "layers" as const },
              { label: "Longest streak", value: `${stats.longestStreak}d`, icon: "flame" as const },
              { label: "Next level at", value: `${nextLevel(stats.xp)?.minXp ?? stats.xp} XP`, icon: "trophy" as const },
            ].map((item) => (
              <Card key={item.label} className="!p-4">
                <Icon name={item.icon} size={18} className="text-brand" />
                <p className="mt-2 text-lg font-bold text-ink">{item.value}</p>
                <p className="text-xs font-medium text-muted">{item.label}</p>
              </Card>
            ))}
          </section>

          {/* badges */}
          <section aria-labelledby="badges-heading">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="badges-heading" className="text-base font-bold text-ink">
                Badges
              </h2>
              <Pill>{progress.badges.size}/{badges.length} earned</Pill>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {badges.map((badge) => {
                const earned = progress.badges.has(badge.slug);
                return (
                  <div
                    key={badge.slug}
                    className={`rounded-2xl border p-3 text-center transition ${
                      earned
                        ? "border-gold/40 bg-gradient-to-br from-brand-soft to-accent-soft"
                        : "border-line bg-surface-2 opacity-45 grayscale"
                    }`}
                    title={badge.description}
                  >
                    <p className="text-2xl" aria-hidden>
                      {badge.icon}
                    </p>
                    <p className="mt-1 text-[0.65rem] font-bold leading-tight text-ink">
                      {badge.name}
                    </p>
                    <p className="mt-0.5 text-[0.6rem] text-muted">{badge.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* portfolio */}
          <section id="portfolio" aria-labelledby="portfolio-heading" className="scroll-mt-24">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="portfolio-heading" className="text-base font-bold text-ink">
                Portfolio
              </h2>
              <Pill tone="accent">{portfolio.length} projects</Pill>
            </div>
            <PortfolioManager
              projects={portfolio.map((p) => ({
                id: p.id,
                name: p.name,
                description: p.description,
                tech: p.tech,
                difficulty: p.difficulty,
                github_url: p.github_url,
                live_url: p.live_url,
                completed_date: p.completed_date,
              }))}
            />
          </section>

          {/* bookmarks */}
          <section aria-labelledby="bookmarks-heading">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="bookmarks-heading" className="text-base font-bold text-ink">
                Saved ideas
              </h2>
              <Pill>🔖 {bookmarkedIdeas.length}</Pill>
            </div>
            {bookmarkedIdeas.length > 0 ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {bookmarkedIdeas.map(({ slug, idea }) => (
                  <li key={slug}>
                    <Link
                      href={`/ideas/${slug}`}
                      className="bv-card-flat flex items-center gap-3 !p-4 transition hover:border-brand/40"
                    >
                      <Icon name="bookmark" size={16} className="shrink-0 text-brand" />
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-ink">{idea!.title}</span>
                        <span className="block truncate text-xs text-muted">
                          {idea!.difficulty} · {idea!.categories.join(", ")}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon="🔖"
                title="Nothing saved yet"
                body="Browse the Ideas Vault and bookmark the projects you want to build."
                action={<LinkButton href="/ideas" variant="secondary" size="sm">Open Ideas Vault</LinkButton>}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}