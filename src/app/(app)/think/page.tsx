import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getProgress } from "@/lib/queries";
import { thinkingChallenges, thinkingCategoryLabels } from "@/content";
import { SectionHeading, Pill } from "@/components/ui";
import { ChallengeBrowser } from "@/components/thinking/challenge-browser";

export const metadata: Metadata = {
  title: "Thinking Gym",
  description:
    "Puzzles that train the mental habits of programming — before you touch a keyboard.",
};

export default async function ThinkingPage() {
  const user = await requireUser();
  const progress = getProgress(user.id);

  const items = thinkingChallenges.map((challenge) => ({
    slug: challenge.slug,
    title: challenge.title,
    category: challenge.category,
    categoryLabel: thinkingCategoryLabels[challenge.category],
    difficulty: challenge.difficulty,
    xp: challenge.xp,
    prompt: challenge.prompt,
  }));

  const solved = items.filter((item) => progress.solvedThinking.has(item.slug));

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          level="h1"
          eyebrow="No code required"
          title="Thinking Gym"
          sub="Programmers are hired for how they think, not how fast they type. These puzzles train decomposition, edge-case hunting and calm reasoning — the habits you will use in every interview and every bug."
        />
        <div className="flex gap-2">
          <Pill tone="success">✓ {solved.length}/{items.length} solved</Pill>
          <Pill tone="accent">🧠 {items.reduce((sum, item) => sum + item.xp, 0)} XP total</Pill>
        </div>
      </section>

      <ChallengeBrowser items={items} solved={[...progress.solvedThinking]} />
    </div>
  );
}
