import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getPlatformStats } from "@/lib/queries";
import { Card, SectionHeading, LinkButton } from "@/components/ui";

export const metadata: Metadata = {
  title: "Admin overview",
  description: "Platform-level statistics.",
};

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <Card>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1.5 text-3xl font-black text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </Card>
  );
}

export default async function AdminOverviewPage() {
  const admin = await requireAdmin();
  const stats = getPlatformStats();

  return (
    <div className="space-y-7">
      <SectionHeading
        level="h1"
        eyebrow="Administrator"
        title="Platform overview"
        sub={`Signed in as ${admin.name}. Only you can see this area — access is checked on the server for every request.`}
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Builders" value={stats.users} hint={`${stats.newThisWeek} new this week`} />
        <Stat label="Active today" value={stats.activeToday} />
        <Stat label="Total XP earned" value={stats.totalXp.toLocaleString()} />
        <Stat label="Administrators" value={stats.admins} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-ink">Learning activity</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Stat label="Lessons completed" value={stats.lessonsCompleted} />
          <Stat label="Thinking Gym solved" value={stats.thinkingSolved} />
          <Stat label="Errors fixed" value={stats.debugSolved} />
          <Stat label="Projects completed" value={stats.projectsCompleted} />
          <Stat label="Missions completed" value={stats.missionsCompleted} />
          <Stat label="Badges earned" value={stats.badgesEarned} />
        </div>
      </section>

      <Card flat className="flex flex-wrap items-center justify-between gap-4 bg-surface-2">
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-ink">Who is an administrator?</p>
          <p className="mt-1 text-sm text-muted">
            Roles are granted from the <code className="font-mono text-xs">ADMIN_EMAILS</code>{" "}
            environment variable — never by registering first, and never from the browser. Add your
            email there, restart, and your account is promoted. You can then promote others from
            the Accounts page.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkButton href="/admin/users">Manage accounts</LinkButton>
        </div>
      </Card>

      <Card flat>
        <p className="text-sm font-semibold text-ink">Content authoring stays in version control</p>
        <p className="mt-1.5 text-sm text-muted">
          Lessons, Thinking Gym challenges, debugging exercises, projects, missions and ideas ship
          as typed modules in <code className="font-mono text-xs">src/content</code>. Editing them
          in code keeps them reviewed, diffable and testable — so there is no risky in-app editor
          for curriculum. See <Link href="/admin/users" className="font-semibold text-brand hover:underline">Accounts</Link> for
          the user tools that <em>are</em> genuinely useful in an interface.
        </p>
      </Card>
    </div>
  );
}
