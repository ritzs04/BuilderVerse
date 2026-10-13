import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getStats } from "@/lib/gamification";
import { getMissionHistory, missionDoneToday } from "@/lib/queries";
import { dailyMissions, missionForDate } from "@/content";
import { todayKey } from "@/lib/db";
import { Card, Pill, SectionHeading } from "@/components/ui";
import { MissionCard } from "@/components/mission-card";

export const metadata: Metadata = {
  title: "Daily Missions",
  description: "One small, meaningful mission every day — earn XP and keep your streak alive.",
};

/** Formats a `YYYY-MM-DD` key in the local timezone (no UTC off-by-one). */
function formatDate(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Dedicated Daily Missions hub (§7/§12 of the product spec): today's mission
 * with its completion rules, plus the student's completion history.
 * Missed missions never erase past progress.
 */
export default async function MissionsPage() {
  const user = await requireUser();
  const stats = getStats(user.id);

  const mission = missionForDate(todayKey());
  const doneToday = missionDoneToday(user.id, mission.slug);
  const history = getMissionHistory(user.id).map((row) => ({
    ...row,
    mission: dailyMissions.find((m) => m.slug === row.mission_slug) ?? null,
  }));

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          level="h1"
          eyebrow="Every day"
          title="Daily Missions"
          sub="One small, meaningful task a day — something you can genuinely finish in a coffee break. Miss a day? Nothing you've earned disappears."
        />
        <div className="flex flex-wrap gap-2">
          <Pill tone="warning">🔥 {stats.streak} day streak</Pill>
          <Pill tone="brand">✅ {stats.missionsCompleted} missions completed</Pill>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MissionCard mission={mission} done={doneToday} />
        </div>

        <Card>
          <h2 className="text-base font-bold text-ink">How missions work</h2>
          <ul className="mt-3 space-y-3 text-sm text-ink-soft">
            {[
              "A fresh mission appears every day — everyone sees the same one.",
              "Mark it complete only once you've actually done it.",
              "Completing earns XP and keeps your streak alive.",
              "A missed day never erases anything you've already earned.",
              "Come back tomorrow for the next one.",
            ].map((rule) => (
              <li key={rule} className="flex items-start gap-2">
                <span className="mt-0.5 text-brand" aria-hidden>
                  •
                </span>
                {rule}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <div className="mb-4">
          <h2 className="text-base font-bold text-ink">Mission history</h2>
          <p className="mt-1 text-sm text-muted">Everything you&apos;ve completed so far.</p>
        </div>

        {history.length > 0 ? (
          <ul className="space-y-2">
            {history.map((entry) => (
              <li
                key={`${entry.date}-${entry.mission_slug}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface-2 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    {entry.mission?.title ?? entry.mission_slug}
                  </p>
                  <p className="text-xs text-muted">{formatDate(entry.date)}</p>
                </div>
                <Pill tone="success">
                  ✓{entry.mission ? ` +${entry.mission.xp} XP` : " Done"}
                </Pill>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-line px-4 py-8 text-center">
            <p className="text-sm font-semibold text-ink">No missions completed yet</p>
            <p className="mt-1 text-xs text-muted">
              Today&apos;s mission above is a perfect first one — small enough to finish right now.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}