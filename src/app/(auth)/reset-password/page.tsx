import type { Metadata } from "next";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Choose a new password",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="text-xl font-bold text-ink">That link is incomplete</h1>
        <p className="mt-2 text-sm text-muted">
          The reset link is missing its token. Request a fresh one — it only takes a moment.
        </p>
        <Link href="/forgot-password" className="bv-btn bv-btn-primary mt-5">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Choose a new password</h1>
        <p className="mt-1.5 text-sm text-muted">
          Make it something you&apos;ll remember but others won&apos;t guess.
        </p>
      </div>
      <ResetPasswordForm token={token} />
    </>
  );
}
