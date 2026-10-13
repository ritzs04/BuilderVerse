import { z } from "zod";

/**
 * Categories a student can file their own Ideas Vault entry under (§14).
 * Mirrors the social-impact categories used by the curated idea bank.
 */
export const IDEA_CATEGORIES = [
  "education",
  "safety",
  "accessibility",
  "environment",
  "community",
  "productivity",
  "health",
  "civic",
  "other",
] as const;

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name (at least 2 characters).")
    .max(50, "That name is a little long — keep it under 50 characters."),
  username: z
    .string()
    .trim()
    .min(3, "Username needs at least 3 characters.")
    .max(20, "Username can be at most 20 characters.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Use only letters, numbers and underscores (no spaces).",
    ),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("That email address doesn't look right."),
  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .regex(/[a-zA-Z]/, "Include at least one letter.")
    .regex(/[0-9]/, "Include at least one number."),
});

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Enter your email or username."),
  password: z.string().min(1, "Enter your password."),
});

export const forgotSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
});

export const resetSchema = z.object({
  token: z.string().min(10, "Invalid reset link."),
  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .regex(/[a-zA-Z]/, "Include at least one letter.")
    .regex(/[0-9]/, "Include at least one number."),
  confirm: z.string(),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name needs at least 2 characters.").max(50),
  username: z
    .string()
    .trim()
    .min(3, "Username needs at least 3 characters.")
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscores."),
  avatar: z.string().trim().min(1).max(8),
  headline: z.string().trim().max(80, "Keep your headline under 80 characters."),
  github_url: z
    .string()
    .trim()
    .refine((v) => v === "" || /^https?:\/\/[^\s.]+\.[^\s]{2,}$/.test(v), {
      message: "Enter a full URL like https://github.com/username",
    }),
  website_url: z
    .string()
    .trim()
    .refine((v) => v === "" || /^https?:\/\/[^\s.]+\.[^\s]{2,}$/.test(v), {
      message: "Enter a full URL like https://example.com",
    }),
});

export const changePasswordSchema = z.object({
  current: z.string().min(1, "Enter your current password."),
  next: z
    .string()
    .min(8, "Use at least 8 characters.")
    .regex(/[a-zA-Z]/, "Include at least one letter.")
    .regex(/[0-9]/, "Include at least one number."),
  confirm: z.string(),
});

/* -------------------------------------------------- learning preferences */

/** Option sets shared by the onboarding flow and the settings page. */
export const EXPERIENCE_OPTIONS = [
  { value: "beginner", label: "Complete beginner" },
  { value: "basic", label: "Basic knowledge" },
  { value: "projects", label: "Some project experience" },
] as const;

export const GOAL_OPTIONS = [
  { value: "coding", label: "Learn coding" },
  { value: "logic", label: "Improve logical thinking" },
  { value: "projects", label: "Build projects" },
  { value: "portfolio", label: "Prepare a portfolio" },
  { value: "explore", label: "Explore technology" },
] as const;

export const STUDY_TIME_OPTIONS = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "night", label: "Night" },
] as const;

export const TOPIC_OPTIONS = [
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "javascript", label: "JavaScript" },
  { value: "dom", label: "DOM manipulation" },
  { value: "apis", label: "APIs & async JavaScript" },
  { value: "git", label: "Git & GitHub" },
  { value: "games", label: "Games" },
  { value: "ai", label: "AI" },
  { value: "cybersecurity", label: "Cyber security" },
  { value: "accessibility", label: "Accessibility" },
] as const;

function optionalChoice(options: readonly { value: string }[]) {
  return z
    .string()
    .optional()
    .refine((v) => v === undefined || v === "" || options.some((o) => o.value === v), {
      message: "Pick one of the options.",
    });
}

/**
 * Learning preferences collected during onboarding (optional — a missing or
 * invalid value never blocks account creation, it just falls back to defaults).
 */
export const preferencesSchema = z.object({
  experience: optionalChoice(EXPERIENCE_OPTIONS),
  goal: optionalChoice(GOAL_OPTIONS),
  study_time: optionalChoice(STUDY_TIME_OPTIONS),
  interests: z.array(z.string()).max(12, "Pick up to 12 topics.").optional(),
});

/** Label for a stored option value (falls back to the raw value). */
export function optionLabel(
  options: readonly { value: string; label: string }[],
  value: string | null | undefined,
): string {
  if (!value) return "";
  return options.find((o) => o.value === value)?.label ?? value;
}

export const portfolioSchema = z.object({
  name: z.string().trim().min(2, "Give your project a name.").max(60),
  description: z
    .string()
    .trim()
    .min(10, "Describe your project in at least 10 characters.")
    .max(400),
  tech: z.string().trim().min(1, "List the technologies you used.").max(120),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  github_url: z
    .string()
    .trim()
    .refine((v) => v === "" || /^https?:\/\/[^\s.]+\.[^\s]{2,}$/.test(v), {
      message: "Enter a full URL like https://github.com/you/repo",
    }),
  live_url: z
    .string()
    .trim()
    .refine((v) => v === "" || /^https?:\/\/[^\s.]+\.[^\s]{2,}$/.test(v), {
      message: "Enter a full URL like https://yourapp.vercel.app",
    }),
});

/** Ideas Vault — an idea the student writes themselves (§14). */
export const personalIdeaSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Give your idea a short title (at least 3 characters).")
    .max(80, "Keep the title under 80 characters."),
  problem: z
    .string()
    .trim()
    .min(20, "Describe the problem in at least 20 characters — what goes wrong today?")
    .max(500),
  who: z.string().trim().max(160, "Keep that under 160 characters.").optional().default(""),
  solution: z
    .string()
    .trim()
    .max(500, "Keep that under 500 characters.")
    .optional()
    .default(""),
  skills: z.string().trim().max(160, "Keep that under 160 characters.").optional().default(""),
  category: z.enum(IDEA_CATEGORIES),
});

export type PersonalIdeaInput = z.infer<typeof personalIdeaSchema>;

/** Formats a ZodError into a single friendly message. */
export function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Please check the form and try again.";
}
