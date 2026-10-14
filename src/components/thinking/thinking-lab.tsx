"use client";

import { useState, useTransition } from "react";
import { clsx } from "clsx";
import { Lightbulb, RotateCcw } from "lucide-react";
import { revealThinkingAction, submitThinkingAction } from "@/app/actions/progress";
import { Button, Pill } from "@/components/ui";
import { Icon } from "@/components/icon-registry";

interface Reward {
  xpGained: number;
  totalXp: number;
  levelUp: boolean;
  newLevelTitle: string;
  streak: number;
  badges: { name: string; icon: string }[];
}

export function ThinkingLab({
  challengeSlug,
  hints,
  initiallySolved,
}: {
  challengeSlug: string;
  hints: string[];
  initiallySolved: boolean;
}) {
  const [answer, setAnswer] = useState("");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState<{ tone: "ok" | "no" | "info"; text: string } | null>(
    initiallySolved ? { tone: "info", text: "You already solved this one — try it again from memory." } : null,
  );
  const [modelAnswer, setModelAnswer] = useState<string | null>(null);
  const [reward, setReward] = useState<Reward | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!answer.trim()) return;
    setError(null);
    setReward(null);
    startTransition(async () => {
      const res = await submitThinkingAction(challengeSlug, answer.trim(), hintsUsed);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      if (res.correct) {
        setFeedback({ tone: "ok", text: res.message });
        setReward(res.reward ?? null);
        if (res.answer) setModelAnswer(res.answer);
      } else {
        setFeedback({ tone: "no", text: res.message });
      }
    });
  }

  function reveal() {
    setError(null);
    startTransition(async () => {
      const res = await revealThinkingAction(challengeSlug, hintsUsed);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setModelAnswer(res.answer);
      setFeedback({ tone: "info", text: "Here is the model answer — compare it with yours." });
    });
  }

  function reset() {
    setAnswer("");
    setFeedback(null);
    setModelAnswer(null);
    setReward(null);
    setHintsUsed(0);
    setError(null);
  }

  return (
    <div className="space-y-5">
      {/* hints */}
      <section className="bv-card p-5" aria-labelledby="hints-heading">
        <div className="flex items-center justify-between gap-3">
          <h2 id="hints-heading" className="text-base font-bold text-ink">
            Stuck? Take a hint
          </h2>
          <Pill tone={hintsUsed > 0 ? "warning" : "neutral"}>
            −5 XP per hint
          </Pill>
        </div>

        <div className="mt-3 space-y-2">
          {hints.slice(0, hintsUsed).map((hint, index) => (
            <p
              key={index}
              className="rounded-xl border border-warning/30 bg-warning-soft px-3.5 py-2.5 text-sm text-ink-soft"
            >
              💡 Hint {index + 1}: {hint}
            </p>
          ))}
        </div>

        {hintsUsed < hints.length && (
          <Button
            variant="secondary"
            size="sm"
            className="mt-3"
            onClick={() => setHintsUsed((n) => n + 1)}
          >
            <Lightbulb size={15} /> {hintsUsed === 0 ? "Give me a hint" : "Next hint"}
          </Button>
        )}
      </section>

      {/* answer */}
      <section className="bv-card p-5" aria-labelledby="answer-heading">
        <div className="flex items-center justify-between gap-3">
          <h2 id="answer-heading" className="text-base font-bold text-ink">
            Your answer
          </h2>
          <Pill tone="accent">Plain English is fine</Pill>
        </div>

        <label className="mt-3 block">
          <span className="sr-only">Your answer</span>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={4}
            placeholder="Explain your thinking — e.g. “I would check whether the array is empty first because…”"
            className="bv-input mt-0 w-full resize-y font-sans"
          />
        </label>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button onClick={submit} disabled={pending || !answer.trim()}>
            {pending ? "Checking…" : "Submit answer"}
          </Button>
          <Button variant="ghost" onClick={reset} disabled={pending} aria-label="Clear your answer">
            <RotateCcw size={15} />
          </Button>
        </div>

        {error && (
          <p role="alert" className="mt-3 text-sm font-medium text-danger">
            {error}
          </p>
        )}

        {feedback && (
          <p
            role="status"
            className={clsx(
              "mt-3 rounded-xl px-4 py-3 text-sm font-medium",
              feedback.tone === "ok" && "bg-success-soft text-success",
              feedback.tone === "no" && "bg-warning-soft text-warning",
              feedback.tone === "info" && "bg-brand-soft text-brand",
            )}
          >
            {feedback.text}
          </p>
        )}

        {reward && (
          <div className="mt-3 space-y-1 rounded-xl border border-brand/25 bg-brand-soft px-4 py-3 text-sm">
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
      </section>

      {/* model answer */}
      <section className="bv-card p-5" aria-labelledby="model-heading">
        <div className="flex items-center justify-between gap-3">
          <h2 id="model-heading" className="text-base font-bold text-ink">
            Model answer
          </h2>
          <Pill>Reveal counts as a skipped attempt</Pill>
        </div>
        {modelAnswer ? (
          <p className="mt-3 rounded-xl bg-surface-2 px-4 py-3 leading-relaxed text-ink-soft">
            {modelAnswer}
          </p>
        ) : (
          <div className="mt-3">
            <Button variant="secondary" size="sm" onClick={reveal} disabled={pending}>
              <Icon name="eye" size={15} /> Show the answer
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
