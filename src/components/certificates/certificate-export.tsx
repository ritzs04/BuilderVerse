"use client";

import { useRef, useState } from "react";
import type { CertificateRow } from "@/lib/db-types";
import { LEVEL_LABELS, type CertificateLevel } from "@/lib/certificate-shared";

/**
 * The printable certificate.
 *
 * The preview is what gets exported, so the downloaded PNG/PDF matches what the
 * learner saw — no separate export renderer that can drift from the preview.
 */

const TEMPLATE_STYLES: Record<string, { bg: string; ring: string; ink: string; muted: string; accent: string }> = {
  classic: {
    bg: "linear-gradient(135deg,#FFF7F2 0%,#FFE9EF 55%,#F3E8FF 100%)",
    ring: "#8B5CF6",
    ink: "#2B1B3D",
    muted: "#6B5A80",
    accent: "#A855F7",
  },
  sunrise: {
    bg: "linear-gradient(135deg,#FFF3D6 0%,#FFD9A8 50%,#FFC1D3 100%)",
    ring: "#F59E0B",
    ink: "#3B2412",
    muted: "#7A5334",
    accent: "#EA580C",
  },
  midnight: {
    bg: "linear-gradient(135deg,#111827 0%,#1E293B 55%,#312E81 100%)",
    ring: "#38BDF8",
    ink: "#F8FAFC",
    muted: "#94A3B8",
    accent: "#22D3EE",
  },
};

const LANDSCAPE: Record<string, { width: number; height: number }> = {
  classic: { width: 1120, height: 792 },
  sunrise: { width: 1120, height: 792 },
  midnight: { width: 1120, height: 792 },
};

function Badge({ color }: { color: string }) {
  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-full text-xl"
      style={{ background: `${color}22`, border: `2px solid ${color}55` }}
      aria-hidden="true"
    >
      🏅
    </div>
  );
}

/** Photo is already a compressed data URL; text-only certificates skip it. */
function CertificateFace({
  certificate,
  verifyUrl,
}: {
  certificate: CertificateRow;
  verifyUrl: string;
}) {
  const style = TEMPLATE_STYLES[certificate.template] ?? TEMPLATE_STYLES.classic;
  const size = LANDSCAPE[certificate.template] ?? LANDSCAPE.classic;
  const levelLabel = LEVEL_LABELS[certificate.level as CertificateLevel] ?? certificate.level;
  const issued = new Date(certificate.issued_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="flex flex-col items-center justify-between p-10 text-center"
      style={{
        width: size.width,
        height: size.height,
        background: style.bg,
        color: style.ink,
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      }}
    >
      <div
        className="flex h-full w-full flex-col items-center justify-between rounded-2xl border-2 px-12 py-9"
        style={{ borderColor: `${style.ring}66` }}
      >
        <div className="flex flex-col items-center gap-3">
          <Badge color={style.accent} />
          <p className="text-xs font-semibold tracking-[0.35em] uppercase" style={{ color: style.muted }}>
            BuilderVerse
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <h2 className="text-3xl font-semibold">Certificate of Achievement</h2>
          <p className="text-sm" style={{ color: style.muted }}>
            This certifies that
          </p>
          <p className="text-5xl font-bold tracking-tight">{certificate.display_name}</p>
          <p className="max-w-2xl text-base" style={{ color: style.muted }}>
            has completed the <strong style={{ color: style.ink }}>{certificate.path_name}</strong> learning path
            and earned the <strong style={{ color: style.accent }}>{levelLabel}</strong> level.
          </p>
        </div>

        <div className="flex w-full items-end justify-between gap-6 text-left">
          <div className="flex flex-col gap-1 text-xs" style={{ color: style.muted }}>
            <span className="font-semibold" style={{ color: style.ink }}>
              Issued {issued}
            </span>
            <span>Certificate ID: {certificate.id}</span>
          </div>
          <div className="flex flex-col items-end gap-1 text-right text-xs" style={{ color: style.muted }}>
            <span>Verify this certificate at</span>
            <span className="font-mono" style={{ color: style.ink }}>
              {verifyUrl}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Export helpers.
 *
 * `html2canvas` rasterises the exact preview DOM; `jsPDF` places that image on a
 * landscape A4 page. Lazily imported so neither library ships in the initial
 * bundle for students who never export.
 */
export function CertificateExport({ certificate }: { certificate: CertificateRow }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [busy, setBusy] = useState<"png" | "pdf" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifyUrl =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/verify/${certificate.id}`;

  async function snapshot() {
    if (!ref.current) throw new Error("Certificate preview is not ready yet.");
    const { default: html2canvas } = await import("html2canvas");
    return html2canvas(ref.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });
  }

  async function downloadPng() {
    setBusy("png");
    setError(null);
    try {
      const canvas = await snapshot();
      const link = document.createElement("a");
      link.download = `builderverse-${certificate.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create the PNG.");
    } finally {
      setBusy(null);
    }
  }

  async function downloadPdf() {
    setBusy("pdf");
    setError(null);
    try {
      const canvas = await snapshot();
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 24;
      const ratio = Math.min(
        (pageWidth - margin * 2) / canvas.width,
        (pageHeight - margin * 2) / canvas.height,
      );
      const width = canvas.width * ratio;
      const height = canvas.height * ratio;
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        (pageWidth - width) / 2,
        (pageHeight - height) / 2,
        width,
        height,
      );
      pdf.save(`builderverse-${certificate.id}.pdf`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create the PDF.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-xl border border-line bg-white/60 p-3 dark:bg-black/20">
        <div
          ref={ref}
          className="mx-auto origin-top-left scale-[0.62] sm:scale-[0.8] lg:scale-100"
          style={{ width: 1120, height: 792 }}
        >
          <CertificateFace certificate={certificate} verifyUrl={verifyUrl} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={downloadPng}
          disabled={busy !== null}
          className="bv-btn bv-btn-primary"
        >
          {busy === "png" ? "Preparing PNG…" : "Download PNG"}
        </button>
        <button
          type="button"
          onClick={downloadPdf}
          disabled={busy !== null}
          className="bv-btn bv-btn-ghost"
        >
          {busy === "pdf" ? "Preparing PDF…" : "Download PDF (A4 landscape)"}
        </button>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
      </div>
    </div>
  );
}
