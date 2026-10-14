import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { SignupForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Become a Builder",
  description: "Create a free BuilderVerse account and start your builder journey.",
};

export default async function SignupPage() {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Become a Builder</h1>
        <p className="mt-1.5 text-sm text-muted">
          One account. Lessons, projects, puzzles and progress that stick around.
        </p>
      </div>
      <SignupForm />
    </>
  );
}
