import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { listUsersForAdmin, getPlatformStats } from "@/lib/queries";
import { AdminUsersTable } from "@/components/admin/users-table";
import { Card, SectionHeading, Pill } from "@/components/ui";

export const metadata: Metadata = {
  title: "Admin accounts",
  description: "Manage BuilderVerse accounts and roles.",
};

export default async function AdminUsersPage() {
  const admin = await requireAdmin();
  const users = listUsersForAdmin();
  const stats = getPlatformStats();

  return (
    <div className="space-y-6">
      <SectionHeading
        level="h1"
        eyebrow="Administrator"
        title="Accounts"
        sub="Every registered Builder. Role changes and deletions are checked on the server, and the last administrator can never be removed."
      />

      <div className="flex flex-wrap gap-2">
        <Pill tone="brand">👥 {stats.users} accounts</Pill>
        <Pill tone="accent">🛡️ {stats.admins} administrators</Pill>
        <Pill>Signed in as {admin.name}</Pill>
      </div>

      <Card className="overflow-x-auto p-0">
        <AdminUsersTable users={users} currentAdminId={admin.id} />
      </Card>

      <Card flat className="bg-surface-2">
        <p className="text-sm font-semibold text-ink">Safety rules enforced server-side</p>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          <li>• You cannot change or delete your own account — that prevents self-lockout.</li>
          <li>• The final administrator cannot be demoted or deleted.</li>
          <li>• Deleting an account removes its progress rows via database cascade rules.</li>
          <li>• A student cannot reach this page at all: the layout redirects them.</li>
        </ul>
        <p className="mt-3 text-xs text-muted">
          Newest accounts first. Last active:{" "}
          {users.filter((user) => user.last_active_date).length} of {users.length} have activity
          recorded.
        </p>
      </Card>
    </div>
  );
}
