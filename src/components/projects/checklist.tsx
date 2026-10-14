"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { clsx } from "clsx";
import { toggleProjectStepAction } from "@/app/actions/progress";
import { Pill } from "@/components/ui";

interface Reward {
  xpGained: number;
  totalXp: number;
  levelUp: boolean;
  newLevelTitle: string;
  streak: number;
  badges: { name: string; icon: string }[];
}

export function ProjectChecklist({
  projectSlug,
  items,
  initialSteps,
  initialCompleted,
  xp,
}: {
  projectSlug: string;
  items: string[];
  initialSteps: number[];
  initialCompleted: boolean;
  xp: number;
}) {
  const [steps, setSteps] = useState<Set<number>>(new Set(initialSteps));
  const [completed, setCompleted] = useState(initialCompleted);
  const [reward, setReward] = useState<Reward | null>(null);
  const [pending, startTransition] = useTransition();

  function toggle(index: number) {
    if (completed) return;
    startTransition(async () => {
      const res = await toggleProjectStepAction(projectSlug, index);
      if (!res.ok) return;
      setSteps((current) => {
        const next = new Set(current);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        return next;
      });
      if (res.completedNow) {
        setCompleted(true);
        if (res.reward) setReward(toReward(res.reward));
      }
    });
  }

  const done = steps.size;

  return (
    <section className="bv-card p-5" aria-labelledby="checklist-heading">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="checklist-heading" className="text-base font-bold text-ink">
          Build checklist
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-ink-soft">
            {done}/{items.length}
          </span>
          {completed ? (
            <Pill tone="success">✓ Project complete · +{xp} XP</Pill>
          ) : (
            <Pill tone="accent">{xp} XP on completion</Pill>
          )}
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {items.map((item, index) => {
          const isDone = steps.has(index);
          return (
            <li key={index}>
              <button
                type="button"
                disabled={pending || completed}
                onClick={() => toggle(index)}
                className={clsx(
                  "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
                  isDone
                    ? "border-success/30 bg-success-soft/60 text-ink-soft"
                    : "border-line bg-surface hover:border-brand/40",
                  completed && "cursor-default",
                )}
                aria-pressed={isDone}
              >
                {isDone ? (
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success" aria-hidden />
                ) : (
                  <Circle size={18} className="mt-0.5 shrink-0 text-muted" aria-hidden />
                )}
                <span className={clsx(isDone && "line-through decoration-line-strong")}>
                  {item}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {reward && (
        <div className="mt-4 space-y-1 rounded-xl border border-brand/25 bg-brand-soft px-4 py-3 text-sm">
          <p className="font-bold text-brand">+{reward.xpGained} XP for finishing the build</p>
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
    </section>
  );
}

function toReward(reward: {
  xpGained: number;
  totalXp: number;
  levelUp: boolean;
  newLevelTitle: string;
  streak: number;
  badges: { name: string; icon: string; slug: string; description: string }[];
}): Reward {
  return {
    xpGained: reward.xpGained,
    totalXp: reward.totalXp,
    levelUp: reward.levelUp,
    newLevelTitle: reward.newLevelTitle,
    streak: reward.streak,
    badges: reward.badges.map((b) => ({ name: b.name, icon: b.icon })),
  };
}