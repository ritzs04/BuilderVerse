"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import {
  issueCertificateAction,
  revokeCertificateAction,
  reissueCertificateAction,
  toggleCertificateSharingAction,
  type CertificateResult,
} from "@/app/actions/certificates";
import { CertificateExport } from "@/components/certificates/certificate-export";
import type { CertificateRow } from "@/lib/db-types";
import { Card, Pill, ProgressBar } from "@/components/ui";

export interface PathOption {
  slug: string;
  title: string;
}

export interface LevelOption {
  pathSlug: string;
  level: string;
  label: string;
  eligible: boolean;
  reason: string;
  progress: number;
  hasActive: boolean;
}

const TEMPLATES = [
  { id: "classic", label: "Classic", hint: "Soft violet" },
  { id: "sunrise", label: "Sunrise", hint: "Warm amber" },
  { id: "midnight", label: "Midnight", hint: "Deep blue" },
] as const;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="bv-btn bv-btn-primary">
      {pending ? "Working…" : label}
    </button>
  );
}

/**
 * Graduation Studio (docx §19–20): pick a path, pick a level, choose a template
 * and an optional photo, then export. Eligibility is re-checked by the server on
 * submit — this UI only explains the current state.
 */
export function GraduationStudio({
  paths,
  levels,
  issued,
  defaultName,
}: {
  paths: PathOption[];
  levels: LevelOption[];
  issued: CertificateRow[];
  defaultName: string;
}) {
  const [state, formAction] = useActionState<CertificateResult, FormData>(issueCertificateAction, {
    ok: false,
    error: "",
  });

  return (
    <div className="space-y-6">
      <Card className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Issue a certificate</h2>
          <p className="text-sm text-muted">
            Certificates are earned, not clicked. Each level unlocks only when the server can verify the
            lessons and projects behind it.
          </p>
        </div>

        {/* Remounting on success resets every field without an effect-driven reset. */}
        <IssueForm
          key={state.ok ? state.certificateId : "issue-form"}
          action={formAction}
          state={state}
          paths={paths}
          levels={levels}
          defaultName={defaultName}
        />
      </Card>

      {issued.length > 0 ? <IssuedList certificates={issued} /> : null}
    </div>
  );
}

function IssueForm({
  action,
  state,
  paths,
  levels,
  defaultName,
}: {
  action: (formData: FormData) => void;
  state: CertificateResult;
  paths: PathOption[];
  levels: LevelOption[];
  defaultName: string;
}) {
  const router = useRouter();
  const [pathSlug, setPathSlug] = useState(paths[0]?.slug ?? "");
  const [template, setTemplate] = useState<string>("classic");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const visibleLevels = levels.filter((option) => option.pathSlug === pathSlug);

  useEffect(() => {
    // Pull the newly issued certificate into the server-rendered tree.
    if (state.ok) router.refresh();
  }, [state, router]);

  /** Downscale the chosen photo in the browser so the stored row stays small. */
  async function handlePhoto(file: File | undefined) {
    setPhotoError(null);
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoError("Please choose a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setPhotoError("That photo is larger than 8 MB — please pick a smaller one.");
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read that file."));
      reader.readAsDataURL(file);
    });
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Could not read that image."));
      image.src = dataUrl;
    });
    const max = 420;
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setPhotoError("This browser could not process the image.");
      return;
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    setPhoto(canvas.toDataURL("image/jpeg", 0.82));
  }

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Learning path
          <select
            name="pathId"
            value={pathSlug}
            onChange={(e) => setPathSlug(e.target.value)}
            className="bv-input"
          >
            {paths.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Display name
          <input
            name="displayName"
            defaultValue={defaultName}
            required
            minLength={2}
            maxLength={60}
            className="bv-input"
            placeholder="Name printed on the certificate"
          />
        </label>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Achievement level</legend>
        <div className="grid gap-3 md:grid-cols-3">
          {visibleLevels.map((option) => (
            <label
              key={option.level}
              className={`flex flex-col gap-2 rounded-xl border p-4 transition ${
                option.eligible && !option.hasActive
                  ? "border-brand/40 bg-brand-soft/40 hover:border-brand/70"
                  : "border-line opacity-70"
              }`}
            >
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name="level"
                  value={option.level}
                  disabled={!option.eligible || option.hasActive}
                  defaultChecked={option.eligible && !option.hasActive}
                />
                <span className="font-semibold">{option.label}</span>
              </span>
              <span className="text-xs text-muted">{option.reason}</span>
              {option.hasActive ? (
                <Pill tone="success">Already issued</Pill>
              ) : option.progress > 0 && option.progress < 1 ? (
                <ProgressBar value={option.progress * 100} label={`${Math.round(option.progress * 100)}%`} />
              ) : null}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Template</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {TEMPLATES.map((t) => (
            <label
              key={t.id}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                template === t.id ? "border-brand bg-brand-soft/50" : "border-line"
              }`}
            >
              <input
                type="radio"
                name="template"
                value={t.id}
                checked={template === t.id}
                onChange={() => setTemplate(t.id)}
              />
              <span>
                {t.label} <span className="text-xs text-muted">· {t.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <span className="text-sm font-medium">Photo (optional)</span>
        <p className="text-xs text-muted">
          Text-only certificates work just as well. Photos are compressed in your browser and stored
          privately — they never appear on the public verify page.
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => void handlePhoto(e.target.files?.[0])}
          className="text-sm"
        />
        {photo ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt="Certificate photo preview"
              className="h-16 w-16 rounded-full object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setPhoto(null);
                if (fileRef.current) fileRef.current.value = "";
              }}
              className="text-sm underline"
            >
              Remove
            </button>
          </div>
        ) : null}
        {photoError ? <p className="text-sm text-danger">{photoError}</p> : null}
      </div>

      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="publiclyShared" className="mt-1" />
        <span>
          Show my display name on the public verification page
          <span className="block text-xs text-muted">
            Off by default. Your email, photo and account details are never exposed.
          </span>
        </span>
      </label>

      <input type="hidden" name="photo" value={photo ?? ""} />

      <div className="flex items-center gap-3">
        <SubmitButton label="Issue certificate" />
        {state.ok ? <p className="text-sm text-success">{state.message}</p> : null}
        {!state.ok && state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      </div>
    </form>
  );
}

function IssuedList({ certificates }: { certificates: CertificateRow[] }) {
  const [shareState, shareAction] = useActionState<CertificateResult, FormData>(
    toggleCertificateSharingAction,
    { ok: false, error: "" },
  );
  const [revokeState, revokeAction] = useActionState<CertificateResult, FormData>(
    revokeCertificateAction,
    { ok: false, error: "" },
  );
  const [reissueState, reissueAction] = useActionState<CertificateResult, FormData>(
    reissueCertificateAction,
    { ok: false, error: "" },
  );
  const router = useRouter();

  useEffect(() => {
    if (shareState.ok || revokeState.ok || reissueState.ok) router.refresh();
  }, [shareState, revokeState, reissueState, router]);

  const active = certificates.filter((c) => c.revoked === 0 && !c.replaced_by);
  const archived = certificates.filter((c) => c.revoked === 1 || c.replaced_by);

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">My certificates</h2>
        {active.map((certificate) => (
          <Card key={certificate.id} className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{certificate.path_name}</p>
                <p className="text-sm text-muted">
                  {certificate.level.replace(/-/g, " ")} · issued {certificate.issued_at} ·{" "}
                  <span className="font-mono text-xs">{certificate.id}</span>
                </p>
              </div>
              <Pill tone="success">Valid</Pill>
            </div>

            <CertificateExport certificate={certificate} />

            <div className="flex flex-wrap items-center gap-4 border-t border-line pt-4 text-sm">
              <form action={revokeAction}>
                <input type="hidden" name="certificateId" value={certificate.id} />
                <button
                  type="submit"
                  className="underline"
                  onClick={(e) => {
                    if (
                      !confirm(
                        "Revoke this certificate? It will show as revoked on the verify page.",
                      )
                    ) {
                      e.preventDefault();
                    }
                  }}
                >
                  Revoke
                </button>
              </form>

              <form action={shareAction} className="flex items-center gap-2">
                <input type="hidden" name="certificateId" value={certificate.id} />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="publiclyShared"
                    defaultChecked={certificate.publicly_shared === 1}
                  />
                  Show my name publicly
                </label>
                <button type="submit" className="bv-btn bv-btn-ghost !px-3 !py-1.5 !text-xs">
                  Save
                </button>
              </form>

              <form action={reissueAction} className="flex items-center gap-2">
                <input type="hidden" name="certificateId" value={certificate.id} />
                <input
                  name="displayName"
                  defaultValue={certificate.display_name}
                  aria-label="Display name for the reissued certificate"
                  className="bv-input !w-40 !py-1.5 !text-xs"
                />
                <button type="submit" className="bv-btn bv-btn-ghost !px-3 !py-1.5 !text-xs">
                  Reissue
                </button>
              </form>
            </div>
          </Card>
        ))}
      </section>

      {archived.length > 0 ? (
        <details className="rounded-xl border border-line p-4 text-sm">
          <summary className="cursor-pointer font-medium">
            History ({archived.length} revoked or replaced)
          </summary>
          <ul className="mt-3 space-y-2">
            {archived.map((c) => (
              <li key={c.id} className="text-muted">
                <span className="font-mono text-xs">{c.id}</span> · {c.path_name} ·{" "}
                {c.revoked === 1 ? "revoked" : "replaced by a newer certificate"}
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      {!shareState.ok && shareState.error ? (
        <p className="text-sm text-danger">{shareState.error}</p>
      ) : null}
      {!revokeState.ok && revokeState.error ? (
        <p className="text-sm text-danger">{revokeState.error}</p>
      ) : null}
      {!reissueState.ok && reissueState.error ? (
        <p className="text-sm text-danger">{reissueState.error}</p>
      ) : null}
    </div>
  );
}
