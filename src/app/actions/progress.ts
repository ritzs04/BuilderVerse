"use server";

import { revalidatePath } from "next/cache";
import { first, run, isoNow, todayKey } from "@/lib/db";
import { requireUserOrThrow } from "@/lib/auth";
import { reward, type RewardResult } from "@/lib/gamification";
import { matchesChecks } from "@/lib/matches";
import {
  getLesson,
  getThinkingChallenge,
  getDebugChallenge,
  getGuidedProject,
  missionForDate,
} from "@/content";

export type ActionResult<T = object> =
  | ({ ok: true } & T)
  | { ok: false; error: string };

const PROJECT_XP: Record<string, number> = {
  Beginner: 120,
  Intermediate: 180,
  Advanced: 240,
};

/* ------------------------------------------------------------------ lessons */

export async function startLessonAction(lessonSlug: string): Promise<ActionResult> {
  const user = await requireUserOrThrow();
  const lesson = getLesson(lessonSlug);
  if (!lesson) return { ok: false, error: "That lesson could not be found." };

  const existing = first<{ completed: number }>(
    "SELECT completed FROM lesson_progress WHERE user_id = ? AND lesson_slug = ?",
    user.id,
    lessonSlug,
  );
  if (!existing) {
    run(
      "INSERT INTO lesson_progress (user_id, lesson_slug, quiz_score, quiz_total, completed, updated_at) VALUES (?, ?, 0, ?, 0, ?)",
      user.id,
      lessonSlug,
      lesson.quiz.length,
      isoNow(),
    );
  }
  return { ok: true };
}

export async function submitQuizAction(
  lessonSlug: string,
  answers: number[],
  hintsUsed: number,
): Promise<ActionResult<{ reward: RewardResult; score: number; total: number }>> {
  const user = await requireUserOrThrow();
  const lesson = getLesson(lessonSlug);
  if (!lesson) return { ok: false, error: "That lesson could not be found." };

  const total = lesson.quiz.length;
  const score = lesson.quiz.reduce(
    (sum, question, index) => (answers[index] === question.correctIndex ? sum + 1 : sum),
    0,
  );

  const existing = first<{ completed: number }>(
    "SELECT completed FROM lesson_progress WHERE user_id = ? AND lesson_slug = ?",
    user.id,
    lessonSlug,
  );

  run(
    `INSERT INTO lesson_progress (user_id, lesson_slug, quiz_score, quiz_total, completed, updated_at)
     VALUES (?, ?, ?, ?, 1, ?)
     ON CONFLICT(user_id, lesson_slug) DO UPDATE SET
       quiz_score = excluded.quiz_score,
       quiz_total = excluded.quiz_total,
       completed = 1,
       updated_at = excluded.updated_at`,
    user.id,
    lessonSlug,
    score,
    total,
    isoNow(),
  );

  // XP is only granted the first time a lesson is completed (no farming).
  const firstCompletion = !existing || existing.completed === 0;
  const hintPenalty = Math.min(hintsUsed, 3) * 5;
  const xp = firstCompletion
    ? lesson.xp + (score === total ? 15 : 0) - (firstCompletion ? hintPenalty : 0)
    : 0;

  const result = reward(user.id, Math.max(0, xp));
  revalidatePath("/learn", "layout");
  revalidatePath("/dashboard");
  return { ok: true, reward: result, score, total };
}

/* ------------------------------------------------------------ thinking gym */

export async function submitThinkingAction(
  slug: string,
  answer: string,
  hintsUsed: number,
): Promise<
  ActionResult<{ reward?: RewardResult; correct: boolean; message: string; answer?: string }>
> {
  const user = await requireUserOrThrow();
  const challenge = getThinkingChallenge(slug);
  if (!challenge) return { ok: false, error: "That challenge could not be found." };

  const alreadySolved = first(
    "SELECT 1 AS x FROM challenge_attempts WHERE user_id = ? AND challenge_slug = ? AND correct = 1",
    user.id,
    slug,
  );

  const correct = matchesChecks(answer, challenge.checks);

  run(
    "INSERT INTO challenge_attempts (user_id, challenge_slug, hints_used, correct, created_at) VALUES (?, ?, ?, ?, ?)",
    user.id,
    slug,
    hintsUsed,
    correct ? 1 : 0,
    isoNow(),
  );

  if (!correct) {
    return { ok: true, correct: false, message: challenge.encourage };
  }

  const hintPenalty = Math.min(hintsUsed, challenge.hints.length) * 5;
  const xp = alreadySolved ? 0 : Math.max(10, challenge.xp - hintPenalty);
  const result = reward(user.id, xp);

  return {
    ok: true,
    correct: true,
    message: alreadySolved ? "Nice — you solved this one before too." : "Exactly right. 🧠",
    answer: challenge.answer,
    reward: result,
  };
}

export async function revealThinkingAction(
  slug: string,
  hintsUsed: number,
): Promise<ActionResult<{ answer: string }>> {
  const user = await requireUserOrThrow();
  const challenge = getThinkingChallenge(slug);
  if (!challenge) return { ok: false, error: "That challenge could not be found." };

  run(
    "INSERT INTO challenge_attempts (user_id, challenge_slug, hints_used, correct, created_at) VALUES (?, ?, ?, 0, ?)",
    user.id,
    slug,
    hintsUsed,
    isoNow(),
  );

  return { ok: true, answer: challenge.answer };
}

/* ----------------------------------------------------------------- debug */

export async function submitDebugAction(
  slug: string,
  fix: string,
  hintsUsed: number,
): Promise<
  ActionResult<{ reward?: RewardResult; solved: boolean; message: string; explanation?: string }>
> {
  const user = await requireUserOrThrow();
  const challenge = getDebugChallenge(slug);
  if (!challenge) return { ok: false, error: "That puzzle could not be found." };

  if (!challenge.checks) {
    return {
      ok: false,
      error: "This puzzle is solved by inspection — compare the code carefully, then reveal the fix.",
    };
  }

  const alreadySolved = first(
    "SELECT 1 AS x FROM debug_attempts WHERE user_id = ? AND debug_slug = ? AND solved = 1",
    user.id,
    slug,
  );

  const solved = matchesChecks(fix, challenge.checks);

  run(
    "INSERT INTO debug_attempts (user_id, debug_slug, hints_used, solved, created_at) VALUES (?, ?, ?, ?, ?)",
    user.id,
    slug,
    hintsUsed,
    solved ? 1 : 0,
    isoNow(),
  );

  if (!solved) {
    return {
      ok: true,
      solved: false,
      message: "Close — keep reading the code line by line. What looks unfamiliar to JavaScript?",
    };
  }

  const hintPenalty = Math.min(hintsUsed, challenge.hints.length) * 5;
  const xp = alreadySolved ? 0 : Math.max(10, challenge.xp - hintPenalty);
  const result = reward(user.id, xp);

  return {
    ok: true,
    solved: true,
    message: alreadySolved ? "Found it again — nice recall." : "You found it. 🐛 squashed.",
    explanation: challenge.explanation,
    reward: result,
  };
}

export async function revealDebugAction(
  slug: string,
  hintsUsed: number,
): Promise<ActionResult<{ explanation: string; fixedCode: string; fixSummary: string }>> {
  const user = await requireUserOrThrow();
  const challenge = getDebugChallenge(slug);
  if (!challenge) return { ok: false, error: "That puzzle could not be found." };

  run(
    "INSERT INTO debug_attempts (user_id, debug_slug, hints_used, solved, created_at) VALUES (?, ?, ?, 0, ?)",
    user.id,
    slug,
    hintsUsed,
    isoNow(),
  );

  return {
    ok: true,
    explanation: challenge.explanation,
    fixedCode: challenge.fixedCode,
    fixSummary: challenge.fixSummary,
  };
}

/* --------------------------------------------------------------- projects */

export async function toggleProjectStepAction(
  projectSlug: string,
  stepIndex: number,
): Promise<ActionResult<{ done: number; total: number; completedNow: boolean; reward?: RewardResult }>> {
  const user = await requireUserOrThrow();
  const project = getGuidedProject(projectSlug);
  if (!project) return { ok: false, error: "That project could not be found." };
  if (stepIndex < 0 || stepIndex >= project.checklist.length) {
    return { ok: false, error: "Invalid checklist step." };
  }

  const row = first<{ steps_done: string; completed: number }>(
    "SELECT steps_done, completed FROM project_progress WHERE user_id = ? AND project_slug = ?",
    user.id,
    projectSlug,
  );

  const done: number[] = row ? (JSON.parse(row.steps_done) as number[]) : [];
  const position = done.indexOf(stepIndex);
  if (position >= 0) done.splice(position, 1);
  else done.push(stepIndex);

  const allDone = done.length === project.checklist.length;
  // Once completed, a project stays completed so XP can never be farmed.
  const completed = allDone || row?.completed === 1;

  run(
    `INSERT INTO project_progress (user_id, project_slug, steps_done, completed, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_id, project_slug) DO UPDATE SET
       steps_done = excluded.steps_done,
       completed = excluded.completed,
       updated_at = excluded.updated_at`,
    user.id,
    projectSlug,
    JSON.stringify(done.sort((a, b) => a - b)),
    completed ? 1 : 0,
    isoNow(),
  );

  let result: RewardResult | undefined;
  if (allDone && row?.completed !== 1) {
    result = reward(user.id, PROJECT_XP[project.difficulty] ?? 120);
    revalidatePath("/build");
    revalidatePath("/dashboard");
  }

  return {
    ok: true,
    done: done.length,
    total: project.checklist.length,
    completedNow: allDone && row?.completed !== 1,
    reward: result,
  };
}

/* --------------------------------------------------------------- missions */

export async function completeMissionAction(
  missionSlug: string,
): Promise<ActionResult<{ reward: RewardResult; alreadyDone: boolean }>> {
  const user = await requireUserOrThrow();
  const date = todayKey();
  const mission = missionForDate(date);
  if (mission.slug !== missionSlug) {
    return { ok: false, error: "That mission is not today's mission." };
  }

  const existing = first(
    "SELECT 1 AS x FROM mission_completions WHERE user_id = ? AND mission_slug = ? AND date = ?",
    user.id,
    missionSlug,
    date,
  );
  if (existing) {
    return { ok: true, alreadyDone: true, reward: reward(user.id, 0) };
  }

  run(
    "INSERT INTO mission_completions (user_id, mission_slug, date, created_at) VALUES (?, ?, ?, ?)",
    user.id,
    missionSlug,
    date,
    isoNow(),
  );

  const result = reward(user.id, mission.xp);
  revalidatePath("/dashboard");
  return { ok: true, alreadyDone: false, reward: result };
}

/* -------------------------------------------------------------- bookmarks */

export async function toggleBookmarkAction(
  refType: "idea" | "lesson" | "project",
  refSlug: string,
): Promise<ActionResult<{ bookmarked: boolean }>> {
  const user = await requireUserOrThrow();

  const existing = first(
    "SELECT 1 AS x FROM bookmarks WHERE user_id = ? AND ref_type = ? AND ref_slug = ?",
    user.id,
    refType,
    refSlug,
  );

  if (existing) {
    run(
      "DELETE FROM bookmarks WHERE user_id = ? AND ref_type = ? AND ref_slug = ?",
      user.id,
      refType,
      refSlug,
    );
    return { ok: true, bookmarked: false };
  }

  run(
    "INSERT INTO bookmarks (user_id, ref_type, ref_slug, created_at) VALUES (?, ?, ?, ?)",
    user.id,
    refType,
    refSlug,
    isoNow(),
  );

  reward(user.id, 0);
  return { ok: true, bookmarked: true };
}

/* ---------------------------------------------------------- notifications */

export async function markNotificationsReadAction(): Promise<ActionResult> {
  const user = await requireUserOrThrow();
  run("UPDATE notifications SET is_read = 1 WHERE user_id = ?", user.id);
  revalidatePath("/dashboard");
  return { ok: true };
}
