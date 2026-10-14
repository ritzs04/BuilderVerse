import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getProgress } from "@/lib/queries";
import { debugChallenges, debugLanguageLabels } from "@/content";
import { SectionHeading, Pill } from "@/components/ui";
import { DebugBrowser } from "@/components/debug/debug-browser";

export const metadata: Metadata = {
  title: "Error Companion",
  description: "Friendly debugging puzzles: find the bug, explain the fix, learn the lesson.",
};

export default async function DebugIndexPage() {
  const user = await requireUser();
  const progress = getProgress(user.id);

  const items = debugChallenges.map((challenge) => ({
    slug: challenge.slug,
    title: challenge.title,
    language: challenge.language,
    languageLabel: debugLanguageLabels[challenge.language],
    difficulty: challenge.difficulty,
    symptom: challenge.symptom,
    xp: challenge.xp,
  }));

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          level="h1"
          eyebrow="Debugging practice"
          title="Error Companion"
          sub="Every bug is a puzzle, never a scolding. Read the symptom, inspect the code, explain the fix out loud — that is exactly how senior engineers debug at work."
        />
        <div className="flex gap-2">
          <Pill tone="success">
            ✓ {items.filter((item) => progress.solvedDebug.has(item.slug)).length}/{items.length} squashed
          </Pill>
          <Pill tone="accent">🐛 {items.reduce((sum, item) => sum + item.xp, 0)} XP total</Pill>
        </div>
      </section>

      <DebugBrowser items={items} solved={[...progress.solvedDebug]} />
    </div>
  );
}
