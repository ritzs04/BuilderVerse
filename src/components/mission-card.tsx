"use client";

import { useState, useTransition } from "react";
import { Check, Flame, Sparkles } from "lucide-react";
import { completeMissionAction } from "@/app/actions/progress";
import { Button, Pill } from "@/components/ui";

interface MissionReward {
  xpGained: number;
  totalXp: number;
  levelUp: boolean;
  newLevelTitle: string;
  streak: number;
  badges: { name: string; icon: string }[];
}

export function MissionCard({
  mission,
  done,
}: {
  mission: { slug: string; title: string; description: string; minutes: number; xp: number };
  done: boolean;
}) {
  const [completed, setCompleted] = useState(done);
  const [reward, setReward] = useState<MissionReward | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function complete() {
    setError(null);
    startTransition(async () => {
      const result = await completeMissionAction(mission.slug);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setCompleted(true);
      if (!result.alreadyDone) {
        setReward({
          xpGained: result.reward.xpGained,
          totalXp: result.reward.totalXp,
          levelUp: result.reward.levelUp,
          newLevelTitle: result.reward.newLevelTitle,
          streak: result.reward.streak,
          badges: result.reward.badges.map((b) => ({ name: b.name, icon: b.icon })),
        });
      }
    });
  }

  return (
    <div className="bv-card bv-glow relative overflow-hidden p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
            Today&apos;s mission
          </p>
          <h3 className="mt-1.5 text-lg font-bold text-ink">{mission.title}</h3>
        </div>
        <Pill tone="brand">
          <Sparkles size={12} /> +{mission.xp} XP
        </Pill>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-muted">{mission.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span className="inline-flex items-center gap-1">
          <Flame size={13} /> ~{mission.minutes} min
        </span>
        <span aria-hidden>·</span>
        <span>Small enough to finish today</span>
      </div>

      <div className="mt-4">
        {completed ? (
          <p className="inline-flex items-center gap-2 rounded-xl bg-success-soft px-4 py-2.5 text-sm font-semibold text-success">
            <Check size={16} /> Mission complete — see you tomorrow.
          </p>
        ) : (
          <Button onClick={complete} disabled={pending}>
            {pending ? "Saving…" : "Mark mission complete"}
          </Button>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-danger">
          {error}
        </p>
      )}

      {reward && (
        <div className="mt-4 space-y-1 rounded-xl border border-brand/25 bg-brand-soft px-4 py-3 text-sm">
          <p className="font-bold text-brand">+{reward.xpGained} XP earned</p>
          <p className="text-ink-soft">
            🔥 {reward.streak} day streak · {reward.totalXp} XP total
          </p>
          {reward.levelUp && (
            <p className="font-semibold text-accent">Level up — {reward.newLevelTitle}!</p>
          )}
          {reward.badges.map((badge) => (
            <p key={badge.name} className="font-semibold text-gold">
              {badge.icon} Badge earned: {badge.name}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
