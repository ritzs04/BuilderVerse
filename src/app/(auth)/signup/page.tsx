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

  // The multi-step SignupForm owns the page heading (one h1 per step).
  return <SignupForm />;
}
