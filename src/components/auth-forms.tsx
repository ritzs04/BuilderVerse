"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Spinner } from "@/components/ui";
import {
  EXPERIENCE_OPTIONS,
  GOAL_OPTIONS,
  STUDY_TIME_OPTIONS,
  TOPIC_OPTIONS,
} from "@/lib/validation";
import {
  signupAction,
  loginAction,
  forgotPasswordAction,
  resetPasswordAction,
  type AuthFormState,
} from "@/app/actions/auth";

function ErrorNote({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm font-medium text-danger"
    >
      {message}
    </p>
  );
}

function SuccessNote({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="status"
      className="rounded-xl border border-success/30 bg-success-soft px-4 py-3 text-sm font-medium text-success"
    >
      {message}
    </p>
  );
}

function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={pending} className="bv-btn bv-btn-primary w-full">
      {pending && <Spinner />}
      {pending ? "One moment…" : children}
    </button>
  );
}

/* ------------------------------------------------------------------- login */

export function LoginForm() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(loginAction, {});

  return (
    <form action={action} className="space-y-4">
      <ErrorNote message={state.error} />
      <SuccessNote message={state.success} />

      <div>
        <label htmlFor="identifier" className="bv-label">
          Email or username
        </label>
        <input
          id="identifier"
          name="identifier"
          type="text"
          autoComplete="username"
          required
          placeholder="you@example.com"
          className="bv-input"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="bv-label">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="mb-1 text-xs font-semibold text-brand hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="bv-input"
        />
      </div>

      <SubmitButton pending={pending}>Log in</SubmitButton>

      <p className="text-center text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-brand hover:underline">
          Become a Builder
        </Link>
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ signup */

const ONBOARDING_STEPS = ["Welcome", "The Oath", "Account", "Preferences"] as const;

const OATH_LINES = [
  "I choose to stay curious.",
  "I will try before I give up.",
  "I will learn from my mistakes.",
  "I will build one step at a time.",
  "I will use what I learn to create something meaningful.",
];

const WELCOME_POINTS = [
  "27 hands-on lessons across 6 learning paths",
  "Thinking Gym puzzles and a friendly debugging lab",
  "5 guided real-world projects — all free, forever",
];

/**
 * Four-step onboarding: Welcome → Builder's Oath → Account → Preferences.
 * One form the whole way; steps 1–3 are client-side so nothing is submitted
 * until the student reaches the final step.
 */
export function SignupForm() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(signupAction, {});
  const [step, setStep] = useState(1);

  function goNext(): boolean {
    const section = document.getElementById(`signup-step-${step}`);
    if (section) {
      const fields = section.querySelectorAll<HTMLInputElement>("input");
      for (const field of fields) {
        if (!field.checkValidity()) {
          field.reportValidity();
          return false;
        }
      }
    }
    setStep((s) => Math.min(s + 1, ONBOARDING_STEPS.length));
    return true;
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLFormElement>): void {
    // Enter should advance the flow, never skip straight to submit.
    if (event.key !== "Enter" || step === ONBOARDING_STEPS.length) return;
    if ((event.target as HTMLElement).tagName !== "INPUT") return;
    event.preventDefault();
    if (step === 3) goNext();
  }

  return (
    <form action={action} className="space-y-4" onKeyDown={handleKeyDown}>
      {/* ------------------------------------------------------- progress */}
      <div className="space-y-1.5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
          Step {step} of {ONBOARDING_STEPS.length} · {ONBOARDING_STEPS[step - 1]}
        </p>
        <div className="flex gap-1.5" aria-hidden>
          {ONBOARDING_STEPS.map((label, index) => (
            <span
              key={label}
              className={`h-1.5 flex-1 rounded-full transition-colors ${index < step ? "bg-brand" : "bg-surface-3"}`}
            />
          ))}
        </div>
      </div>

      <ErrorNote message={state.error} />

      {/* ---------------------------------------------------- step 1 welcome */}
      <section id="signup-step-1" hidden={step !== 1} className="space-y-4">
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Your ideas deserve to become real.
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            BuilderVerse is a free, interactive place to learn coding by doing — read a concept,
            try it in a real lab, solve puzzles, debug real errors and ship guided projects.
          </p>
          <ul className="space-y-2">
            {WELCOME_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-ink-soft">
                <span className="mt-0.5 text-brand" aria-hidden>
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setStep(2)} className="bv-btn bv-btn-primary w-full">
            Start my journey
          </button>
          <p className="text-center text-sm text-muted">
            Already building?{" "}
            <Link href="/login" className="font-semibold text-brand hover:underline">
              Log in
            </Link>
          </p>
        </section>

      {/* -------------------------------------------------------- step 2 oath */}
      <section id="signup-step-2" hidden={step !== 2} className="space-y-4">
          <h1 className="text-2xl font-bold tracking-tight text-ink">The Builder&apos;s Oath</h1>
          <div className="space-y-3 rounded-2xl border border-brand/25 bg-brand-soft p-5 text-sm leading-relaxed text-ink-soft">
            <p className="font-semibold text-ink">I don&apos;t need to know everything today.</p>
            <ul className="space-y-1.5">
              {OATH_LINES.map((line) => (
                <li key={line}>• {line}</li>
              ))}
            </ul>
            <p>
              I am not here to prove that I already know everything.
              <br />I am here to learn, grow, and build.
            </p>
            <p className="text-base font-black tracking-tight text-brand">I am a Builder.</p>
          </div>
          <p className="text-xs text-muted">
            This is an encouraging promise, not a test — you can revisit it anytime from your
            Profile.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="bv-btn bv-btn-ghost flex-1"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="bv-btn bv-btn-primary flex-[2]"
            >
              I&apos;m Ready to Begin
            </button>
          </div>
        </section>

      {/* ---------------------------------------------------- step 3 account */}
      <section id="signup-step-3" hidden={step !== 3} className="space-y-4">
          <h1 className="text-2xl font-bold tracking-tight text-ink">Create your account</h1>

          <div>
            <label htmlFor="name" className="bv-label">
              Your name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              placeholder="Rithikka"
              className="bv-input"
            />
          </div>

          <div>
            <label htmlFor="username" className="bv-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              placeholder="rithikka_builds"
              pattern="[a-zA-Z0-9_]+"
              title="Letters, numbers and underscores only"
              className="bv-input"
            />
          </div>

          <div>
            <label htmlFor="email" className="bv-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="bv-input"
            />
          </div>

          <div>
            <label htmlFor="password" className="bv-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="At least 8 characters"
              className="bv-input"
            />
            <p className="mt-1.5 text-xs text-muted">
              8+ characters with at least one letter and one number.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="bv-btn bv-btn-ghost flex-1"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => goNext()}
              className="bv-btn bv-btn-primary flex-[2]"
            >
              Next
            </button>
          </div>
        </section>

      {/* -------------------------------------------------- step 4 preferences */}
      <section id="signup-step-4" hidden={step !== 4} className="space-y-4">
          <h1 className="text-2xl font-bold tracking-tight text-ink">Shape your learning path</h1>
          <p className="text-sm text-muted">
            All optional — we use these to recommend your first steps. You can change them later in
            Settings.
          </p>

          <div>
            <label htmlFor="experience" className="bv-label">
              Current experience
            </label>
            <select id="experience" name="experience" defaultValue="" className="bv-input">
              <option value="">Not sure yet</option>
              {EXPERIENCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="goal" className="bv-label">
              Learning goal
            </label>
            <select id="goal" name="goal" defaultValue="" className="bv-input">
              <option value="">No particular goal yet</option>
              {GOAL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="study_time" className="bv-label">
              Preferred study time
            </label>
            <select id="study_time" name="study_time" defaultValue="" className="bv-input">
              <option value="">Whenever I can</option>
              {STUDY_TIME_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <fieldset>
            <legend className="bv-label">Topics that interest you</legend>
            <div className="grid grid-cols-2 gap-2">
              {TOPIC_OPTIONS.map((topic) => (
                <label
                  key={topic.value}
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm text-ink-soft transition hover:border-brand/40"
                >
                  <input
                    type="checkbox"
                    name="interests"
                    value={topic.value}
                    className="size-4 accent-[var(--bv-brand)]"
                  />
                  {topic.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="bv-btn bv-btn-ghost flex-1"
            >
              Back
            </button>
            <div className="flex-[2]">
              <SubmitButton pending={pending}>Create my Builder account</SubmitButton>
            </div>
          </div>
        </section>
    </form>
  );
}

/* ------------------------------------------------------------------ forgot */

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    forgotPasswordAction,
    {},
  );

  return (
    <form action={action} className="space-y-4">
      <SuccessNote message={state.success} />
      <ErrorNote message={state.error} />

      {state.resetUrl && (
        <div className="rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-ink">
          <p className="font-semibold text-accent">Development mode</p>
          <p className="mt-1 text-muted">
            No email provider is configured, so your reset link is shown here instead:
          </p>
          <Link href={state.resetUrl} className="mt-1 block break-all font-semibold text-brand underline">
            {state.resetUrl}
          </Link>
        </div>
      )}

      <div>
        <label htmlFor="email" className="bv-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="bv-input"
        />
      </div>

      <SubmitButton pending={pending}>Send reset link</SubmitButton>

      <p className="text-center text-sm text-muted">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------- reset */

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    resetPasswordAction,
    {},
  );

  return (
    <form action={action} className="space-y-4">
      <ErrorNote message={state.error} />
      <input type="hidden" name="token" value={token} />

      <div>
        <label htmlFor="password" className="bv-label">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="At least 8 characters"
          className="bv-input"
        />
      </div>

      <div>
        <label htmlFor="confirm" className="bv-label">
          Confirm new password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Type it again"
          className="bv-input"
        />
      </div>

      <SubmitButton pending={pending}>Set new password</SubmitButton>

      <p className="text-center text-sm text-muted">
        Need a new link?{" "}
        <Link href="/forgot-password" className="font-semibold text-brand hover:underline">
          Request one
        </Link>
      </p>
    </form>
  );
}
