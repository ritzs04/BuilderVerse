import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { LEVEL_LABELS, verifyCertificate, type CertificateLevel } from "@/lib/certificates";
import { VerifyQrCode } from "@/components/certificates/verify-qr";
import { Card, Pill } from "@/components/ui";

/**
 * Public certificate verification (docx §21.G).
 *
 * Reachable without signing in — this is exactly what the QR code points at —
 * so it deliberately reveals only what the student opted into: validity, course,
 * level, issue date, and the display name only when public sharing is on. No
 * email, no photo, no account id.
 */

export const metadata: Metadata = {
  title: "Verify certificate",
  description: "Check whether a BuilderVerse certificate is genuine, revoked or replaced.",
  robots: { index: false },
};

async function baseUrl(): Promise<string> {
  const configured = process.env.APP_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  const headerList = await headers();
  const host = headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return host ? `${proto}://${host}` : "";
}

export default async function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = verifyCertificate(id);
  const verifyUrl = `${await baseUrl()}/verify/${encodeURIComponent(id)}`;

  if (result.status === "unknown" || !result.certificate) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <h1 className="text-3xl font-bold">Certificate not recognised</h1>
        <p className="text-muted">
          We could not find a BuilderVerse certificate with this ID. It may have a typo, or it may have
          been issued elsewhere.
        </p>
        <p className="font-mono text-sm text-muted">{id}</p>
        <Link href="/" className="bv-btn bv-btn-ghost">
          Go to BuilderVerse
        </Link>
      </main>
    );
  }

  const certificate = result.certificate;
  const levelLabel = LEVEL_LABELS[certificate.level as CertificateLevel] ?? certificate.level;
  const revoked = result.status === "revoked";
  const reason = certificate.revoked === 1 ? "revoked by the student" : "replaced by a newer certificate";

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center gap-6 px-6 py-16">
      <header className="text-center">
        <h1 className="text-3xl font-bold">Certificate verification</h1>
        <p className="mt-2 text-muted">
          Real achievements, verifiable by anyone. BuilderVerse never issues a certificate without
          server-checked completion records.
        </p>
      </header>

      <Card className="w-full space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold">{certificate.path_name}</p>
            <p className="text-sm text-muted">{levelLabel}</p>
          </div>
          <Pill tone={revoked ? "danger" : "success"}>{revoked ? "Revoked" : "Valid"}</Pill>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Certificate ID</dt>
            <dd className="font-mono text-sm">{certificate.id}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Issued on</dt>
            <dd className="text-sm">{certificate.issued_at}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Achievement</dt>
            <dd className="text-sm">{levelLabel}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Awarded to</dt>
            <dd className="text-sm">
              {result.publicName ?? (
                <span className="text-muted">Hidden — the student keeps their name private.</span>
              )}
            </dd>
          </div>
        </dl>

        {revoked ? (
          <p className="rounded-lg border border-danger/30 bg-danger-soft/40 p-4 text-sm">
            This certificate is no longer current because it was {reason}. Do not present it as a valid
            achievement.
          </p>
        ) : (
          <p className="rounded-lg border border-success/30 bg-success-soft/40 p-4 text-sm">
            This certificate is genuine and current. It was issued against verified completion records.
          </p>
        )}

        <div className="flex flex-col items-center gap-3 border-t border-line pt-6">
          <VerifyQrCode url={verifyUrl} />
          <p className="text-xs text-muted">Scan to open this verification page again.</p>
        </div>
      </Card>

      <p className="text-center text-xs text-muted">
        Certificates are issued by BuilderVerse as a learning platform. They are not accredited by any
        university, government or professional body.
      </p>
    </main>
  );
}
