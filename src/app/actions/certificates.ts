"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUserOrThrow } from "@/lib/auth";
import {
  CERTIFICATE_LEVELS,
  CERTIFICATE_TEMPLATES,
  issueCertificate,
  reissueCertificate,
  revokeCertificate,
  setCertificateSharing,
  type CertificateLevel,
  type CertificateTemplate,
} from "@/lib/certificates";

export type CertificateResult =
  | { ok: true; message: string; certificateId: string }
  | { ok: false; error: string };

/** Photo payloads are data URLs; cap the length so a huge upload can't bloat a row. */
const MAX_PHOTO_LENGTH = 400_000;

function readPhoto(formData: FormData): string | null {
  const raw = formData.get("photo");
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (!trimmed.startsWith("data:image/")) return null;
  return trimmed.length <= MAX_PHOTO_LENGTH ? trimmed : null;
}

export async function issueCertificateAction(
  _prev: CertificateResult,
  formData: FormData,
): Promise<CertificateResult> {
  const user = await requireUserOrThrow();

  const pathId = String(formData.get("pathId") ?? "");
  const level = String(formData.get("level") ?? "") as CertificateLevel;
  const template = String(formData.get("template") ?? "classic") as CertificateTemplate;
  const displayName = String(formData.get("displayName") ?? user.name);
  const publiclyShared = formData.get("publiclyShared") === "on";
  const photo = readPhoto(formData);

  if (!CERTIFICATE_LEVELS.includes(level)) {
    return { ok: false, error: "Choose a certificate level first." };
  }
  if (!CERTIFICATE_TEMPLATES.includes(template)) {
    return { ok: false, error: "Choose a template first." };
  }

  const issued = issueCertificate({
    userId: user.id,
    pathId,
    level,
    displayName,
    template,
    photo,
    publiclyShared,
  });

  if (!issued.ok) return { ok: false, error: issued.error };

  revalidatePath("/graduate");
  return {
    ok: true,
    message: "Certificate issued — well done.",
    certificateId: issued.certificate.id,
  };
}

export async function revokeCertificateAction(
  _prev: CertificateResult,
  formData: FormData,
): Promise<CertificateResult> {
  const user = await requireUserOrThrow();
  const id = String(formData.get("certificateId") ?? "");
  if (!id) return { ok: false, error: "Missing certificate." };

  const ok = revokeCertificate(user.id, id);
  revalidatePath("/graduate");
  return ok
    ? { ok: true, message: "Certificate revoked.", certificateId: id }
    : { ok: false, error: "Could not revoke that certificate." };
}

export async function reissueCertificateAction(
  _prev: CertificateResult,
  formData: FormData,
): Promise<CertificateResult> {
  const user = await requireUserOrThrow();
  const id = String(formData.get("certificateId") ?? "");
  const displayName = String(formData.get("displayName") ?? "");
  if (!id) return { ok: false, error: "Missing certificate." };

  const result = reissueCertificate(user.id, id, displayName);
  if (!result.ok) return { ok: false, error: result.error };

  revalidatePath("/graduate");
  return {
    ok: true,
    message: "Reissued — the original is kept as history.",
    certificateId: result.certificate.id,
  };
}

export async function toggleCertificateSharingAction(
  _prev: CertificateResult,
  formData: FormData,
): Promise<CertificateResult> {
  const user = await requireUserOrThrow();
  const id = String(formData.get("certificateId") ?? "");
  const shared = formData.get("publiclyShared") === "on";
  if (!id) return { ok: false, error: "Missing certificate." };

  const ok = setCertificateSharing(user.id, id, shared);
  revalidatePath("/graduate");
  return ok
    ? {
        ok: true,
        message: shared ? "Your name is now visible on the verify page." : "Your name is hidden again.",
        certificateId: id,
      }
    : { ok: false, error: "Could not update sharing." };
}

export async function goToVerifyAction(formData: FormData): Promise<void> {
  const id = String(formData.get("certificateId") ?? "");
  if (!id) redirect("/graduate");
  redirect(`/verify/${encodeURIComponent(id)}`);
}
