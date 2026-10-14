"use client";

import { useState, useTransition } from "react";
import { clsx } from "clsx";
import { Lightbulb, RotateCcw, Wrench } from "lucide-react";
import { revealDebugAction, submitDebugAction } from "@/app/actions/progress";
import { Button, Pill } from "@/components/ui";
import { CodeBlock } from "@/components/code-block";

interface Reward {
  xpGained: number;
  totalXp: number;
  levelUp: boolean;
  newLevelTitle: string;
  streak: number;
  badges: { name: string; icon: string }[];
}

export function DebugLab({
  debugSlug,
  hints,
  canSubmit,
  initiallySolved,
  guidingQuestion,
  whatHappened,
  whyItHappened,
  explanation,
  fixedCode,
  fixSummary,
}: {
  debugSlug: string;
  hints: string[];
  canSubmit: boolean;
  initiallySolved: boolean;
  guidingQuestion: string;
  whatHappened: string;
  whyItHappened: string;
  explanation: string;
  fixedCode: string;
  fixSummary: string;
}) {
  const [fix, setFix] = useState("");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState<{ tone: "ok" | "no" | "info"; text: string } | null>(
    initiallySolved
      ? { tone: "info", text: "You have already squashed this bug — explain the fix from memory." }
      : null,
  );
  const [reveal, setReveal] = useState(initiallySolved);
  const [reward, setReward] = useState<Reward | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!fix.trim()) return;
    setError(null);
    setReward(null);
    startTransition(async () => {
      const res = await submitDebugAction(debugSlug, fix.trim(), hintsUsed);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      if (res.solved) {
        setFeedback({ tone: "ok", text: res.message });
        setReward(res.reward ?? null);
        setReveal(true);
      } else {
        setFeedback({ tone: "no", text: res.message });
      }
    });
  }

  function revealFix() {
    startTransition(async () => {
      const res = await revealDebugAction(debugSlug, hintsUsed);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setReveal(true);
      setFeedback({ tone: "info", text: "Compare the fixed code with yours — then run it in your head line by line." });
    });
  }

  return (
    <div className="space-y-5">
      {/* hints */}
      <section className="bv-card p-5" aria-labelledby="debug-hints-heading">
        <div className="flex items-center justify-between gap-3">
          <h2 id="debug-hints-heading" className="text-base font-bold text-ink">
            Guiding hints
          </h2>
          <Pill tone={hintsUsed > 0 ? "warning" : "neutral"}>−5 XP per hint</Pill>
        </div>
        <p className="mt-3 rounded-xl bg-surface-2 px-4 py-3 text-sm text-ink-soft">
          <span className="font-bold text-ink">Ask yourself: </span>
          {guidingQuestion}
        </p>
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

      {/* your diagnosis */}
      {canSubmit && (
        <section className="bv-card p-5" aria-labelledby="fix-heading">
          <div className="flex items-center justify-between gap-3">
            <h2 id="fix-heading" className="text-base font-bold text-ink">
              What is the fix?
            </h2>
            <Pill tone="accent">Describe it in plain English</Pill>
          </div>
          <label className="mt-3 block">
            <span className="sr-only">Your diagnosis of the bug</span>
            <textarea
              value={fix}
              onChange={(e) => setFix(e.target.value)}
              rows={3}
              placeholder="Point at the line and say what should change…"
              className="bv-input mt-0 w-full resize-y font-sans"
            />
          </label>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button onClick={submit} disabled={pending || !fix.trim()}>
              {pending ? "Checking…" : <><Wrench size={15} /> Submit fix</>}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setFix("");
                setFeedback(null);
                setReward(null);
                setError(null);
              }}
              disabled={pending}
              aria-label="Clear your diagnosis"
            >
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
      )}

      {/* solution */}
      <section className="bv-card p-5" aria-labelledby="solution-heading">
        <div className="flex items-center justify-between gap-3">
          <h2 id="solution-heading" className="text-base font-bold text-ink">
            The fix
          </h2>
          {canSubmit && !reveal && <Pill>Reveal skips the XP for this puzzle</Pill>}
        </div>

        {reveal ? (
          <div className="mt-3 space-y-4">
            <div className="space-y-2 text-sm leading-relaxed text-ink-soft">
              <p>
                <span className="font-bold text-ink">What happened: </span>
                {whatHappened}
              </p>
              <p>
                <span className="font-bold text-ink">Why it happened: </span>
                {whyItHappened}
              </p>
            </div>
            <p className="text-sm leading-relaxed text-ink-soft">{explanation}</p>
            <CodeBlock code={fixedCode} lang="fixed" />
            <p className="rounded-xl border border-success/25 bg-success-soft px-4 py-3 text-sm text-ink-soft">
              <span className="font-bold text-success">Fix summary: </span>
              {fixSummary}
            </p>
          </div>
        ) : canSubmit ? (
          <div className="mt-3">
            <Button variant="secondary" size="sm" onClick={revealFix} disabled={pending}>
              Reveal the fix
            </Button>
          </div>
        ) : (
          <div className="mt-3 space-y-4">
            <p className="rounded-xl bg-surface-2 px-4 py-3 text-sm text-muted">
              This one is solved by inspection: study the code above, then reveal the explanation
              to confirm what you spotted.
            </p>
            <Button variant="secondary" size="sm" onClick={revealFix} disabled={pending}>
              Reveal the fix
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
