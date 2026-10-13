"use client";

import { useActionState, useState } from "react";
import {
  changePasswordAction,
  deleteAccountAction,
  updateLearningPreferencesAction,
  updateProfileAction,
} from "@/app/actions/account";
import type { AccountResult } from "@/app/actions/account";
import {
  EXPERIENCE_OPTIONS,
  GOAL_OPTIONS,
  STUDY_TIME_OPTIONS,
  TOPIC_OPTIONS,
} from "@/lib/validation";
import { Button, Input, Textarea, Pill } from "@/components/ui";

const ok: AccountResult = { ok: true };

export function ProfileForm({
  name,
  username,
  avatar,
  headline,
  githubUrl,
  websiteUrl,
}: {
  name: string;
  username: string;
  avatar: string;
  headline: string;
  githubUrl: string | null;
  websiteUrl: string | null;
}) {
  const [state, formAction, pending] = useActionState(updateProfileAction, ok);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-semibold text-ink">
            Display name
          </label>
          <Input id="name" name="name" defaultValue={name} required />
        </div>
        <div>
          <label htmlFor="username" className="mb-1 block text-sm font-semibold text-ink">
            Username
          </label>
          <Input id="username" name="username" defaultValue={username} required />
        </div>
        <div>
          <label htmlFor="avatar" className="mb-1 block text-sm font-semibold text-ink">
            Avatar emoji
          </label>
          <Input id="avatar" name="avatar" defaultValue={avatar} />
        </div>
        <div>
          <label htmlFor="github_url" className="mb-1 block text-sm font-semibold text-ink">
            GitHub URL
          </label>
          <Input id="github_url" name="github_url" type="url" defaultValue={githubUrl ?? ""} placeholder="https://github.com/you" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="website_url" className="mb-1 block text-sm font-semibold text-ink">
            Website / portfolio URL
          </label>
          <Input id="website_url" name="website_url" type="url" defaultValue={websiteUrl ?? ""} placeholder="https://you.dev" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="headline" className="mb-1 block text-sm font-semibold text-ink">
            Headline
          </label>
          <Textarea id="headline" name="headline" rows={2} defaultValue={headline} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save profile"}
        </Button>
        {state.ok && "message" in state && state.message && (
          <Pill tone="success">{state.message}</Pill>
        )}
        {!state.ok && <Pill tone="danger">{state.error}</Pill>}
      </div>
    </form>
  );
}

/* ------------------------------------------- learning preferences (onboarding) */

export function LearningPreferencesForm({
  experience,
  goal,
  studyTime,
  interests,
}: {
  experience: string | null;
  goal: string | null;
  studyTime: string | null;
  interests: string[];
}) {
  const [state, formAction, pending] = useActionState(updateLearningPreferencesAction, ok);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="experience" className="mb-1 block text-sm font-semibold text-ink">
            Current experience
          </label>
          <select
            id="experience"
            name="experience"
            defaultValue={experience ?? ""}
            className="bv-input w-full text-sm"
          >
            <option value="">Not set</option>
            {EXPERIENCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="goal" className="mb-1 block text-sm font-semibold text-ink">
            Learning goal
          </label>
          <select
            id="goal"
            name="goal"
            defaultValue={goal ?? ""}
            className="bv-input w-full text-sm"
          >
            <option value="">Not set</option>
            {GOAL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="study_time" className="mb-1 block text-sm font-semibold text-ink">
            Preferred study time
          </label>
          <select
            id="study_time"
            name="study_time"
            defaultValue={studyTime ?? ""}
            className="bv-input w-full text-sm"
          >
            <option value="">Whenever I can</option>
            {STUDY_TIME_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 block text-sm font-semibold text-ink">Topics of interest</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TOPIC_OPTIONS.map((topic) => (
            <label
              key={topic.value}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm text-ink-soft transition hover:border-brand/40"
            >
              <input
                type="checkbox"
                name="interests"
                value={topic.value}
                defaultChecked={interests.includes(topic.value)}
                className="size-4 accent-[var(--bv-brand)]"
              />
              {topic.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending} variant="secondary">
          {pending ? "Saving…" : "Save learning preferences"}
        </Button>
        {state.ok && "message" in state && state.message && (
          <Pill tone="success">{state.message}</Pill>
        )}
        {!state.ok && <Pill tone="danger">{state.error}</Pill>}
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, ok);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="current" className="mb-1 block text-sm font-semibold text-ink">
            Current password
          </label>
          <Input id="current" name="current" type="password" required autoComplete="current-password" />
        </div>
        <div>
          <label htmlFor="next" className="mb-1 block text-sm font-semibold text-ink">
            New password
          </label>
          <Input id="next" name="next" type="password" required autoComplete="new-password" minLength={8} />
        </div>
        <div>
          <label htmlFor="confirm" className="mb-1 block text-sm font-semibold text-ink">
            Confirm new password
          </label>
          <Input id="confirm" name="confirm" type="password" required autoComplete="new-password" minLength={8} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending} variant="secondary">
          {pending ? "Updating…" : "Update password"}
        </Button>
        {state.ok && "message" in state && state.message && (
          <Pill tone="success">{state.message}</Pill>
        )}
        {!state.ok && <Pill tone="danger">{state.error}</Pill>}
      </div>
    </form>
  );
}

export function DeleteAccountForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setError(null);
    setPending(true);
    try {
      const formData = new FormData();
      formData.set("password", password);
      await deleteAccountAction(formData);
    } catch (deleteError) {
      setPending(false);
      setError(deleteError instanceof Error ? deleteError.message : "Something went wrong.");
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        Deletes your account and all progress permanently. This cannot be undone.
      </p>

      {!confirming ? (
        <Button type="button" variant="danger" onClick={() => setConfirming(true)}>
          Delete my account
        </Button>
      ) : (
        <div className="space-y-3 rounded-xl border border-danger/30 bg-danger-soft/60 p-4">
          <p className="text-sm font-semibold text-danger">
            Are you sure? Enter your password to confirm.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
              className="!w-64"
            />
            <Button type="button" variant="danger" disabled={pending || password.length === 0} onClick={handleDelete}>
              {pending ? "Deleting…" : "Confirm deletion"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => { setConfirming(false); setError(null); }}>
              Cancel
            </Button>
          </div>
          {error && <p role="alert" className="text-sm font-medium text-danger">{error}</p>}
        </div>
      )}
    </div>
  );
}