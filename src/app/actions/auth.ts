"use server";

import { redirect } from "next/navigation";
import { first, run, isoNow } from "@/lib/db";
import {
  hashPassword,
  verifyPassword,
  startSession,
  endSession,
  createPasswordReset,
  consumePasswordReset,
} from "@/lib/auth";
import {
  signupSchema,
  loginSchema,
  forgotSchema,
  resetSchema,
  firstIssue,
} from "@/lib/validation";
import { notify } from "@/lib/gamification";
import { randomUUID } from "node:crypto";

export interface AuthFormState {
  error?: string;
  success?: string;
  /** Shown only when no email provider is configured (development). */
  resetUrl?: string;
}

export async function signupAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) return { error: firstIssue(parsed.error) };
  const { name, username, email, password } = parsed.data;

  if (first("SELECT 1 AS x FROM users WHERE email = ?", email)) {
    return { error: "An account with that email already exists. Try logging in instead." };
  }
  if (first("SELECT 1 AS x FROM users WHERE username = ?", username)) {
    return { error: "That username is taken. Pick another one." };
  }

  const id = randomUUID();
  run(
    `INSERT INTO users (id, name, username, email, password_hash, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    id,
    name,
    username,
    email,
    hashPassword(password),
    isoNow(),
  );

  notify(id, {
    type: "welcome",
    title: "Welcome to BuilderVerse 👋",
    body: "Start with your first lesson, or check today's mission on the dashboard.",
    href: "/dashboard",
  });

  await startSession(id);
  redirect("/dashboard");
}

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) return { error: firstIssue(parsed.error) };
  const { identifier, password } = parsed.data;

  const user = first<{ id: string; password_hash: string }>(
    "SELECT id, password_hash FROM users WHERE email = ? OR username = ?",
    identifier.toLowerCase(),
    identifier,
  );

  if (!user || !verifyPassword(password, user.password_hash)) {
    return { error: "That combination doesn't match an account. Check and try again." };
  }

  await startSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/");
}

export async function forgotPasswordAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = forgotSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: firstIssue(parsed.error) };

  const user = first<{ id: string }>("SELECT id FROM users WHERE email = ?", parsed.data.email);

  // Never reveal whether the email exists.
  const generic: AuthFormState = {
    success:
      "If an account exists for that email, a reset link is on its way. It expires in 30 minutes.",
  };
  if (!user) return generic;

  const token = createPasswordReset(user.id);
  const resetUrl = `/reset-password?token=${token}`;

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM ?? "BuilderVerse <no-reply@builderverse.local>",
          to: parsed.data.email,
          subject: "Reset your BuilderVerse password",
          text: `Reset your password: ${new URL(resetUrl, process.env.APP_URL ?? "http://localhost:3000").toString()}`,
        }),
      });
    } catch {
      console.error("[builderverse] Failed to send password reset email");
    }
    return generic;
  }

  if (process.env.NODE_ENV !== "production") {
    return { ...generic, resetUrl };
  }

  console.info(`[builderverse] Password reset link (no email provider): ${resetUrl}`);
  return generic;
}

export async function resetPasswordAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) return { error: firstIssue(parsed.error) };
  if (parsed.data.password !== parsed.data.confirm) {
    return { error: "The two passwords don't match yet." };
  }

  const userId = consumePasswordReset(parsed.data.token);
  if (!userId) {
    return {
      error: "This reset link is invalid or has expired. Request a new one.",
    };
  }

  run("UPDATE users SET password_hash = ? WHERE id = ?", hashPassword(parsed.data.password), userId);
  run("DELETE FROM sessions WHERE user_id = ?", userId);

  redirect("/login?reset=1");
}
