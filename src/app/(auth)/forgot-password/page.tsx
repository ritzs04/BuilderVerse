import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Request a password reset link for your BuilderVerse account.",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Reset your password</h1>
        <p className="mt-1.5 text-sm text-muted">
          Enter your email and we&apos;ll send a reset link that lasts 30 minutes.
        </p>
      </div>
      <ForgotPasswordForm />
    </>
  );
}
