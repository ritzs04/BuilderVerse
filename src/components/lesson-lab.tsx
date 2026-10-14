"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Check, Lightbulb, RotateCcw, X } from "lucide-react";
import { clsx } from "clsx";
import type { Lesson } from "@/content";
import { startLessonAction, submitQuizAction } from "@/app/actions/progress";
import { CodeBlock } from "@/components/code-block";
import { Button, Pill } from "@/components/ui";

interface LabReward {
  xpGained: number;
  totalXp: number;
  levelUp: boolean;
  newLevelTitle: string;
  streak: number;
  badges: { name: string; icon: string }[];
}

export function LessonLab({
  lesson,
  previousScore,
  wasCompleted,
}: {
  lesson: Lesson;
  previousScore: { score: number; total: number } | null;
  wasCompleted: boolean;
}) {
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [showChallengeSolution, setShowChallengeSolution] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    lesson.quiz.map(() => null),
  );
  const [result, setResult] = useState<{
    score: number;
    total: number;
    reward: LabReward | null;
  } | null>(
    previousScore
      ? { score: previousScore.score, total: previousScore.total, reward: null }
      : null,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Marks the lesson as "started" the first time the learner opens it.
  useEffect(() => {
    void startLessonAction(lesson.slug);
  }, [lesson.slug]);

  const allAnswered = useMemo(() => answers.every((a) => a !== null), [answers]);
  const challengeHints = useMemo(() => [lesson.challenge.hint], [lesson.challenge.hint]);

  function submitQuiz() {
    setSubmitError(null);
    startTransition(async () => {
      const response = await submitQuizAction(
        lesson.slug,
        answers.map((a) => a ?? -1),
        hintsUsed,
      );
      if (!response.ok) {
        setSubmitError(response.error);
        return;
      }
      setResult({
        score: response.score,
        total: response.total,
        reward: response.reward.xpGained > 0 ? toLabReward(response.reward) : null,
      });
    });
  }

  function retake() {
    setAnswers(lesson.quiz.map(() => null));
    setResult(null);
    setSubmitError(null);
  }

  return (
    <div className="space-y-6">
      {/* ---------------------------------------------------------- try it */}
      <section className="bv-card p-5" aria-labelledby="try-it-heading">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="try-it-heading" className="text-base font-bold text-ink">
            Try it yourself
          </h2>
          <Pill tone="accent">Hands on</Pill>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{lesson.tryIt.instructions}</p>

        <CodeBlock code={lesson.tryIt.starter} lang="starter" />

        {showSolution ? (
          <div className="rounded-2xl border border-success/25 bg-success-soft p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-success">
              One way to solve it
            </p>
            <CodeBlock code={lesson.tryIt.solution} lang="solution" />
          </div>
        ) : (
          <Button variant="secondary" size="sm" onClick={() => setShowSolution(true)}>
            <Lightbulb size={15} /> Show a solution
          </Button>
        )}
      </section>

      {/* ------------------------------------------------------- challenge */}
      <section className="bv-card p-5" aria-labelledby="challenge-heading">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="challenge-heading" className="text-base font-bold text-ink">
            Mini challenge
          </h2>
          <Pill tone="brand">{lesson.xp} XP on completion</Pill>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{lesson.challenge.task}</p>

        <div className="mt-3 space-y-2">
          {challengeHints.slice(0, hintsUsed).map((hint, index) => (
            <p
              key={index}
              className="rounded-xl border border-warning/30 bg-warning-soft px-3 py-2 text-sm text-ink-soft"
            >
              💡 Hint {index + 1}: {hint}
            </p>
          ))}
          {hintsUsed < challengeHints.length && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHintsUsed((n) => n + 1)}
                aria-label="Reveal a hint"
              >
                <Lightbulb size={15} /> Need a hint?
              </Button>
            </div>
          )}
        </div>

        <div className="mt-3">
          {showChallengeSolution ? (
            <CodeBlock code={lesson.challenge.solution} lang="answer" />
          ) : (
            <Button variant="secondary" size="sm" onClick={() => setShowChallengeSolution(true)}>
              Reveal the answer
            </Button>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------ quiz */}
      <section className="bv-card p-5" aria-labelledby="quiz-heading">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="quiz-heading" className="text-base font-bold text-ink">
            Quick quiz
          </h2>
          {wasCompleted && !result && <Pill tone="success">Re-taking</Pill>}
        </div>

        {!result ? (
          <div className="mt-4 space-y-5">
            {lesson.quiz.map((question, questionIndex) => (
              <fieldset key={questionIndex}>
                <legend className="text-sm font-semibold text-ink">
                  {questionIndex + 1}. {question.question}
                </legend>
                <div className="mt-2 space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className={clsx(
                        "flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition",
                        answers[questionIndex] === optionIndex
                          ? "border-brand bg-brand-soft text-ink"
                          : "border-line bg-surface text-ink-soft hover:border-line-strong",
                      )}
                    >
                      <input
                        type="radio"
                        name={`q-${questionIndex}`}
                        className="mt-0.5 accent-[var(--bv-brand)]"
                        checked={answers[questionIndex] === optionIndex}
                        onChange={() =>
                          setAnswers((current) =>
                            current.map((value, i) => (i === questionIndex ? optionIndex : value)),
                          )
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            {submitError && (
              <p role="alert" className="text-sm font-medium text-danger">
                {submitError}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={submitQuiz} disabled={pending || !allAnswered}>
                {pending ? "Checking…" : "Submit answers"}
              </Button>
              {!allAnswered && (
                <span className="text-xs text-muted">
                  Answer every question to finish the lesson.
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-3">
              <span
                className={clsx(
                  "grid size-11 place-items-center rounded-full text-lg font-bold",
                  result.score === result.total
                    ? "bg-success-soft text-success"
                    : result.score > 0
                      ? "bg-warning-soft text-warning"
                      : "bg-danger-soft text-danger",
                )}
                aria-hidden
              >
                {result.score}/{result.total}
              </span>
              <div>
                <p className="font-bold text-ink">
                  {result.score === result.total
                    ? "Perfect score — you really got this."
                    : result.score >= result.total / 2
                      ? "Solid work. Review the misses below."
                      : "Good attempt — the explanations below will make it click."}
                </p>
                <p className="text-sm text-muted">Lesson complete. Nicely done.</p>
              </div>
            </div>

            <ol className="space-y-3">
              {lesson.quiz.map((question, questionIndex) => {
                const correct = answers[questionIndex] === question.correctIndex;
                return (
                  <li
                    key={questionIndex}
                    className={clsx(
                      "rounded-xl border px-4 py-3",
                      correct ? "border-success/25 bg-success-soft/50" : "border-line bg-surface-2",
                    )}
                  >
                    <p className="flex items-start gap-2 text-sm font-semibold text-ink">
                      {correct ? (
                        <Check size={16} className="mt-0.5 shrink-0 text-success" />
                      ) : (
                        <X size={16} className="mt-0.5 shrink-0 text-danger" />
                      )}
                      {question.question}
                    </p>
                    {!correct && (
                      <p className="mt-1 text-sm text-ink-soft">
                        Answer: {question.options[question.correctIndex]}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-muted">{question.explanation}</p>
                  </li>
                );
              })}
            </ol>

            {result.reward && (
              <div className="space-y-1 rounded-xl border border-brand/25 bg-brand-soft px-4 py-3 text-sm">
                <p className="font-bold text-brand">+{result.reward.xpGained} XP earned</p>
                <p className="text-ink-soft">
                  🔥 {result.reward.streak} day streak · {result.reward.totalXp} XP total
                </p>
                {result.reward.levelUp && (
                  <p className="font-semibold text-accent">
                    Level up — {result.reward.newLevelTitle}!
                  </p>
                )}
                {result.reward.badges.map((badge) => (
                  <p key={badge.name} className="font-semibold text-gold">
                    {badge.icon} Badge earned: {badge.name}
                  </p>
                ))}
              </div>
            )}

            <Button variant="secondary" size="sm" onClick={retake}>
              <RotateCcw size={14} /> Retake the quiz
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

function toLabReward(reward: {
  xpGained: number;
  totalXp: number;
  levelUp: boolean;
  newLevelTitle: string;
  streak: number;
  badges: { name: string; icon: string; slug: string; description: string }[];
}): LabReward {
  return {
    xpGained: reward.xpGained,
    totalXp: reward.totalXp,
    levelUp: reward.levelUp,
    newLevelTitle: reward.newLevelTitle,
    streak: reward.streak,
    badges: reward.badges.map((b) => ({ name: b.name, icon: b.icon })),
  };
}
