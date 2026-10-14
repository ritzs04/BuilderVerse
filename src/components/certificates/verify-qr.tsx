"use client";

import { useEffect, useState } from "react";

/**
 * Renders the verification URL as a scannable QR code.
 *
 * Generated client-side with `qrcode` so the page stays a static server
 * component and the library never lands in the initial bundle.
 */
export function VerifyQrCode({ url, size = 132 }: { url: string; size?: number }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void import("qrcode")
      .then((mod) => mod.default.toDataURL(url, { margin: 1, width: size }))
      .then((result: string) => {
        if (!cancelled) setDataUrl(result);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [url, size]);

  if (failed) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-line p-3 text-center text-xs text-muted"
        style={{ width: size, height: size }}
      >
        Scan unavailable — use the link above.
      </div>
    );
  }

  return dataUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={dataUrl}
      width={size}
      height={size}
      alt={`QR code linking to the verification page for this certificate`}
      className="rounded-lg bg-white p-1"
    />
  ) : (
    <div className="animate-pulse rounded-lg bg-black/10" style={{ width: size, height: size }} />
  );
}
