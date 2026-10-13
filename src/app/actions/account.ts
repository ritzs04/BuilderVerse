"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { first, run } from "@/lib/db";
import { requireUserOrThrow, hashPassword, verifyPassword, endSession } from "@/lib/auth";
import {
  profileSchema,
  changePasswordSchema,
  portfolioSchema,
  preferencesSchema,
  personalIdeaSchema,
  TOPIC_OPTIONS,
  firstIssue,
} from "@/lib/validation";
import { evaluateBadges } from "@/lib/gamification";
import { randomUUID } from "node:crypto";

export type AccountResult = { ok: true; message?: string } | { ok: false; error: string };

export async function updateProfileAction(
  _prev: AccountResult,
  formData: FormData,
): Promise<AccountResult> {
  const user = await requireUserOrThrow();

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    avatar: formData.get("avatar"),
    headline: formData.get("headline"),
    github_url: formData.get("github_url") ?? "",
    website_url: formData.get("website_url") ?? "",
  });
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

  const { name, username, avatar, headline, github_url, website_url } = parsed.data;

  const usernameTaken = first(
    "SELECT 1 AS x FROM users WHERE username = ? AND id != ?",
    username,
    user.id,
  );
  if (usernameTaken) return { ok: false, error: "That username is already taken." };

  run(
    `UPDATE users SET name = ?, username = ?, avatar = ?, headline = ?, github_url = ?, website_url = ?
     WHERE id = ?`,
    name,
    username,
    avatar,
    headline,
    github_url || null,
    website_url || null,
    user.id,
  );

  revalidatePath("/profile");
  revalidatePath("/settings");
  return { ok: true, message: "Profile saved." };
}

export async function changePasswordAction(
  _prev: AccountResult,
  formData: FormData,
): Promise<AccountResult> {
  const user = await requireUserOrThrow();

  const parsed = changePasswordSchema.safeParse({
    current: formData.get("current"),
    next: formData.get("next"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

  if (parsed.data.next !== parsed.data.confirm) {
    return { ok: false, error: "The two new passwords don't match." };
  }
  if (!verifyPassword(parsed.data.current, user.password_hash)) {
    return { ok: false, error: "Your current password is not correct." };
  }

  run("UPDATE users SET password_hash = ? WHERE id = ?", hashPassword(parsed.data.next), user.id);
  return { ok: true, message: "Password updated." };
}

export async function setPreferencesAction(formData: FormData): Promise<void> {
  const user = await requireUserOrThrow();
  const theme = formData.get("theme");
  const notifyMissions = formData.get("notify_missions") === "on" ? 1 : 0;

  run(
    "UPDATE users SET theme = ?, notify_missions = ? WHERE id = ?",
    theme === "light" || theme === "dark" ? theme : "system",
    notifyMissions,
    user.id,
  );
  revalidatePath("/settings");
}

/** Learning preferences chosen during onboarding — editable later (§4/§17). */
export async function updateLearningPreferencesAction(
  _prev: AccountResult,
  formData: FormData,
): Promise<AccountResult> {
  const user = await requireUserOrThrow();

  const parsed = preferencesSchema.safeParse({
    experience: formData.get("experience") ?? "",
    goal: formData.get("goal") ?? "",
    study_time: formData.get("study_time") ?? "",
    interests: formData.getAll("interests"),
  });
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

  const p = parsed.data;
  const knownTopics = new Set<string>(TOPIC_OPTIONS.map((o) => o.value));
  const interests = JSON.stringify(
    (p.interests ?? []).filter((topic) => knownTopics.has(topic)),
  );

  run(
    `UPDATE users SET experience_level = ?, learning_goal = ?, study_time = ?, interests = ?
     WHERE id = ?`,
    p.experience || null,
    p.goal || null,
    p.study_time || null,
    interests,
    user.id,
  );

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { ok: true, message: "Learning preferences saved." };
}

export async function deleteAccountAction(formData: FormData): Promise<void> {
  const user = await requireUserOrThrow();
  const password = String(formData.get("password") ?? "");

  if (!verifyPassword(password, user.password_hash)) {
    throw new Error("Password incorrect — account was not deleted.");
  }

  run("DELETE FROM users WHERE id = ?", user.id);
  await endSession();
  redirect("/");
}

/* --------------------------------------------------------------- portfolio */

export type PortfolioResult = { ok: true } | { ok: false; error: string };

export async function addPortfolioProjectAction(
  _prev: PortfolioResult,
  formData: FormData,
): Promise<PortfolioResult> {
  const user = await requireUserOrThrow();

  const parsed = portfolioSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    tech: formData.get("tech"),
    difficulty: formData.get("difficulty"),
    github_url: formData.get("github_url") ?? "",
    live_url: formData.get("live_url") ?? "",
  });
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

  const completedDate =
    String(formData.get("completed_date") ?? "") || new Date().toISOString().slice(0, 10);

  run(
    `INSERT INTO portfolio_projects (id, user_id, name, description, tech, difficulty, github_url, live_url, completed_date, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    randomUUID(),
    user.id,
    parsed.data.name,
    parsed.data.description,
    parsed.data.tech,
    parsed.data.difficulty,
    parsed.data.github_url || null,
    parsed.data.live_url || null,
    completedDate,
    new Date().toISOString(),
  );

  evaluateBadges(user.id);
  revalidatePath("/profile");
  return { ok: true };
}

export async function deletePortfolioProjectAction(id: string): Promise<AccountResult> {
  const user = await requireUserOrThrow();
  run("DELETE FROM portfolio_projects WHERE id = ? AND user_id = ?", id, user.id);
  revalidatePath("/profile");
  return { ok: true };
}

/* --------------------------------------------------------- personal ideas */

/**
 * Ideas Vault — saves an idea the student wrote themselves (§14).
 * Ideas are the student's own thinking, so they persist like bookmarks and
 * survive sign-out; nothing is shared with other students.
 */
export async function addPersonalIdeaAction(
  formData: FormData,
): Promise<AccountResult> {
  const user = await requireUserOrThrow();

  const parsed = personalIdeaSchema.safeParse({
    title: formData.get("title"),
    problem: formData.get("problem"),
    who: formData.get("who") ?? "",
    solution: formData.get("solution") ?? "",
    skills: formData.get("skills") ?? "",
    category: formData.get("category"),
  });
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

  run(
    `INSERT INTO personal_ideas (id, user_id, title, problem, who, solution, skills, category, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    randomUUID(),
    user.id,
    parsed.data.title,
    parsed.data.problem,
    parsed.data.who,
    parsed.data.solution,
    parsed.data.skills,
    parsed.data.category,
    new Date().toISOString(),
  );

  revalidatePath("/ideas");
  return { ok: true };
}

export async function deletePersonalIdeaAction(id: string): Promise<AccountResult> {
  const user = await requireUserOrThrow();
  // The user_id predicate is the security boundary — never delete by id alone.
  run("DELETE FROM personal_ideas WHERE id = ? AND user_id = ?", id, user.id);
  revalidatePath("/ideas");
  return { ok: true };
}
