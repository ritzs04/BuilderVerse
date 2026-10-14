import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getProgress } from "@/lib/queries";
import { projectIdeas } from "@/content";
import { SectionHeading, Pill } from "@/components/ui";
import { IdeaBrowser } from "@/components/ideas/idea-browser";

export const metadata: Metadata = {
  title: "Ideas Vault",
  description: "20 real-world project ideas with broken-down features and learning goals.",
};

export default async function IdeasPage() {
  const user = await requireUser();
  const progress = getProgress(user.id);

  const items = projectIdeas.map((idea) => ({
    slug: idea.slug,
    title: idea.title,
    difficulty: idea.difficulty,
    categories: idea.categories,
    tech: idea.tech,
    problem: idea.problem,
  }));

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          level="h1"
          eyebrow="Portfolio fuel"
          title="Ideas Vault"
          sub="A drawer of real-world projects — each one broken into features and learning goals so you always know what to build next. Bookmark the ones that excite you."
        />
        <div className="flex gap-2">
          <Pill tone="accent">💡 {items.length} ideas</Pill>
          <Pill>🔖 {progress.bookmarkedIdeas.size} saved</Pill>
        </div>
      </section>

      <IdeaBrowser
        items={items}
        initiallyBookmarked={[...progress.bookmarkedIdeas]}
      />
    </div>
  );
}