import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getStats } from "@/lib/gamification";
import { getProgress } from "@/lib/queries";
import { todayKey } from "@/lib/db";
import {
  learningPaths,
  lessonsForPath,
  levelForXp,
  missionForDate,
} from "@/content";
import {
  EXPERIENCE_OPTIONS,
  GOAL_OPTIONS,
  optionLabel,
} from "@/lib/validation";
import { Card, Pill, Avatar, LinkButton, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Your Builder Passport is ready.",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * First landing after signup (Phase A onboarding, §4–§5 of the product spec):
 * celebrates the new Builder, shows their unique Builder ID, and gives them a
 * clear first lesson + today's mission. Students with progress skip it.
 */
export default async function WelcomePage() {
  const user = await requireUser();
  const stats = getStats(user.id);
  const progress = getProgress(user.id);

  if (stats.xp > 0 || progress.completedLessons.size > 0) redirect("/dashboard");

  const level = levelForXp(stats.xp);
  const mission = missionForDate(todayKey());
  const firstPath = learningPaths[0];
  const firstLesson = lessonsForPath(firstPath.slug)[0];

  // Preference-aware starting point (§4: use preferences to recommend a start).
  const goal = user.learning_goal;
  const start =
    goal === "logic"
      ? { href: "/think", title: "Warm up in the Thinking Gym", body: "No code needed — just logic puzzles to get your problem-solving muscles moving." }
      : goal === "projects"
        ? { href: "/build", title: "Peek at your first guided project", body: "See what you'll build soon: a real Calculator with checklists and XP." }
        : goal === "portfolio"
          ? { href: "/ideas", title: "Browse the Ideas Vault", body: "20 problem-solving project ideas with MVP scopes — pick one to build towards." }
          : { href: `/learn/${firstPath.slug}/${firstLesson.slug}`, title: `Start: ${firstLesson.title}`, body: `${firstPath.title} path · about ${firstLesson.minutes} minutes · your very first lesson.` };

  const preferenceChips = [
    optionLabel(EXPERIENCE_OPTIONS, user.experience_level),
    optionLabel(GOAL_OPTIONS, user.learning_goal),
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <SectionHeading
        level="h1"
        eyebrow="Onboarding complete"
        title={`Welcome, ${user.name.split(" ")[0]}! Your Builder Passport is ready 🎉`}
        sub="You took the Oath — that already makes you a Builder. Here's your identity, your first step, and today's mission."
      />

      {/* --------------------------------------------------- passport card */}
      <Card>
        <div className="flex flex-wrap items-center gap-5">
          <Avatar emoji={user.avatar} size="xl" />
          <div className="min-w-0">
            <p className="text-xl font-bold text-ink">{user.name}</p>
            <p className="text-sm text-muted">@{user.username}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Pill tone="brand">🪪 {user.builder_id}</Pill>
              <Pill tone="accent">
                Level {level.level} · {level.title}
              </Pill>
              <Pill>Joined {formatDate(user.created_at)}</Pill>
            </div>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-black text-ink">{stats.xp} XP</p>
            <p className="text-xs text-muted">earned so far</p>
          </div>
        </div>
        <p className="mt-4 border-t border-line pt-4 text-sm italic text-muted">
          “I will build one step at a time.” — your Oath
        </p>
        {preferenceChips.length > 0 && (
          <p className="mt-2 text-xs text-muted">
            Saved preferences: {preferenceChips.join(" · ")} — change them anytime in{" "}
            <Link href="/settings" className="font-semibold text-brand hover:underline">
              Settings
            </Link>
            .
          </p>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* --------------------------------------------------- first lesson */}
        <Card>
          <SectionHeading eyebrow="Your first step" title={start.title} />
          <p className="mt-2 text-sm text-muted">{start.body}</p>
          <LinkButton href={start.href} className="mt-4">
            Begin now →
          </LinkButton>
        </Card>

        {/* ------------------------------------------------- today's mission */}
        <Card>
          <SectionHeading eyebrow="Today's mission" title={mission.title} />
          <p className="mt-2 text-sm text-muted">{mission.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill tone="warning">⏱ ~{mission.minutes} min</Pill>
            <Pill tone="success">+{mission.xp} XP</Pill>
          </div>
          <LinkButton href="/dashboard" variant="secondary" className="mt-4">
            Open my dashboard
          </LinkButton>
        </Card>
      </div>

      <div className="flex justify-center">
        <LinkButton href="/dashboard" size="lg">
          Go to my dashboard
        </LinkButton>
      </div>
    </div>
  );
}