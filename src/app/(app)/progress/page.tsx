import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getXpHistory, getXpByKind } from "@/lib/queries";
import { getStats } from "@/lib/gamification";
import { Card, Pill, ProgressBar, SectionHeading, EmptyState, LinkButton } from "@/components/ui";

export const metadata: Metadata = {
  title: "My progress",
  description: "Every XP point you have earned, and exactly how you earned it.",
};

const KIND_LABEL: Record<string, string> = {
  lesson: "Lesson",
  thinking: "Thinking Gym",
  debug: "Error Companion",
  project: "Project",
  mission: "Daily mission",
  general: "Activity",
};

/** Icons for the "where your XP came from" breakdown. */
const KIND_ICON: Record<string, string> = {
  lesson: "📘",
  thinking: "🧠",
  debug: "🐛",
  project: "🔨",
  mission: "🎯",
};

function formatDay(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  const yesterdayKey = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  if (iso === todayKey) return "Today";
  if (iso === yesterdayKey) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

/**
 * Progress history (§13): the XP ledger. Every row was written by `reward()`
 * when a real requirement was met, so this page can never fabricate progress.
 */
export default async function ProgressPage() {
  const user = await requireUser();
  const stats = getStats(user.id);
  const history = getXpHistory(user.id);
  const byKind = getXpByKind(user.id);

  const totalLogged = history.reduce((sum, day) => sum + day.total, 0);
  const kindTotal = byKind.reduce((sum, row) => sum + row.amount, 0);

  return (
    <div className="space-y-6">
      <SectionHeading
        level="h1"
        eyebrow="Progress history"
        title="How you earned every point"
        sub="Nothing here is guessed. Each line is an activity you actually finished, recorded the moment you finished it."
      />

      <div className="flex flex-wrap gap-2">
        <Pill tone="brand">⚡ {stats.xp} XP total</Pill>
        <Pill tone="accent">
          Level {stats.level.level} · {stats.level.title}
        </Pill>
        <Pill>🔥 {stats.streak}-day streak</Pill>
        <Pill>🏅 {stats.badgesEarned} badges</Pill>
        <Pill tone="success">{totalLogged} XP logged</Pill>
      </div>

      {kindTotal > 0 && (
        <Card>
          <SectionHeading
            level="h2"
            title="Where your XP came from"
            sub="An honest breakdown — each activity earns a different amount."
          />
          <ul className="mt-4 space-y-3">
            {byKind.map((row) => {
              const percent = Math.round((row.amount / kindTotal) * 100);
              return (
                <li key={row.kind} className="flex items-center gap-3">
                  <span aria-hidden className="w-6 text-center text-lg">
                    {KIND_ICON[row.kind] ?? "✨"}
                  </span>
                  <span className="w-32 shrink-0 text-sm font-semibold text-ink">
                    {KIND_LABEL[row.kind] ?? KIND_LABEL.general}
                  </span>
                  <div className="min-w-0 flex-1">
                    <ProgressBar value={row.amount} max={kindTotal} showValue={false} />
                  </div>
                  <span className="w-24 shrink-0 text-right text-sm text-muted">
                    {row.amount} XP · {percent}%
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {history.length === 0 ? (
        <EmptyState
          icon="🌱"
          title="Your progress story starts with one step"
          body="Finish a lesson, solve a Thinking Gym challenge or fix a bug and it will appear here automatically — with the exact XP it earned."
          action={
            <LinkButton href="/learn/html/html-your-first-page">Start my first lesson</LinkButton>
          }
        />
      ) : (
        <div className="space-y-4">
          {history.map((day) => (
            <Card key={day.date}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-ink">{formatDay(day.date)}</h2>
                <Pill tone="success">+{day.total} XP</Pill>
              </div>

              <ul className="mt-3 space-y-2 border-t border-line pt-3">
                {day.events.map((event) => (
                  <li key={event.id} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 w-20 shrink-0 font-mono text-xs text-muted">
                      {formatTime(event.created_at)}
                    </span>
                    <span className="min-w-0 flex-1 text-ink-soft">{event.label}</span>
                    <Pill tone="neutral">{KIND_LABEL[event.kind] ?? KIND_LABEL.general}</Pill>
                    <span className="w-14 shrink-0 text-right font-semibold text-success">
                      +{event.amount}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      <Card flat className="flex flex-wrap items-center justify-between gap-3 bg-surface-2">
        <p className="text-sm text-muted">
          Want the badge-by-badge view? Your achievements live on your Builder Passport.
        </p>
        <Link href="/profile" className="text-sm font-semibold text-brand hover:underline">
          Open my Builder Passport →
        </Link>
      </Card>
    </div>
  );
}
