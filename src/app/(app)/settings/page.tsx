import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { Card, SectionHeading, Button } from "@/components/ui";
import {
  ProfileForm,
  PasswordForm,
  DeleteAccountForm,
} from "@/components/settings/settings-forms";
import { setPreferencesAction } from "@/app/actions/account";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <SectionHeading level="h1" eyebrow="Your account" title="Settings" sub="Tune your Builder ID, preferences and security." />

      <Card>
        <h2 className="mb-4 text-base font-bold text-ink">Profile</h2>
        <ProfileForm
          name={user.name}
          username={user.username}
          avatar={user.avatar}
          headline={user.headline}
          githubUrl={user.github_url}
          websiteUrl={user.website_url}
        />
      </Card>

      <Card>
        <h2 className="mb-4 text-base font-bold text-ink">Preferences</h2>
        <form action={setPreferencesAction} className="space-y-4">
          <div>
            <label htmlFor="theme" className="mb-1 block text-sm font-semibold text-ink">
              Appearance
            </label>
            <select
              id="theme"
              name="theme"
              defaultValue={user.theme}
              className="bv-input !w-auto text-sm"
            >
              <option value="system">Follow system</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <p className="mt-1 text-xs text-muted">
              You can also switch instantly with the button in the top bar.
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-ink-soft">
            <input
              type="checkbox"
              name="notify_missions"
              defaultChecked={user.notify_missions === 1}
              className="size-4 accent-[var(--bv-brand)]"
            />
            Remind me about daily missions
          </label>

          <Button type="submit">Save preferences</Button>
        </form>
      </Card>

      <Card>
        <h2 className="mb-4 text-base font-bold text-ink">Password</h2>
        <PasswordForm />
      </Card>

      <Card className="border-danger/30">
        <h2 className="mb-4 text-base font-bold text-danger">Danger zone</h2>
        <DeleteAccountForm />
      </Card>
    </div>
  );
}