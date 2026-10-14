import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LoginForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your BuilderVerse account and continue building.",
};

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Welcome back, Builder</h1>
        <p className="mt-1.5 text-sm text-muted">
          Pick up exactly where you left off.
        </p>
      </div>
      <LoginForm />
    </>
  );
}
