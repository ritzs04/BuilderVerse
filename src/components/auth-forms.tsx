"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Spinner } from "@/components/ui";
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

export function SignupForm() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(signupAction, {});

  return (
    <form action={action} className="space-y-4">
      <ErrorNote message={state.error} />

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
        <p className="mt-1.5 text-xs text-muted">8+ characters with at least one letter and one number.</p>
      </div>

      <SubmitButton pending={pending}>Create my Builder account</SubmitButton>

      <p className="text-center text-sm text-muted">
        Already building?{" "}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Log in
        </Link>
      </p>
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
