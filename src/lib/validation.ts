import { z } from "zod";

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

/** Formats a ZodError into a single friendly message. */
export function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Please check the form and try again.";
}
