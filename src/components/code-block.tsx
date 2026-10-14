"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeBlock({
  code,
  lang,
  caption,
}: {
  code: string;
  lang?: string;
  caption?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <figure className="my-5">
      <div className="bv-pre bv-scroll relative">
        {lang && (
          <button
            type="button"
            onClick={copy}
            className="absolute top-2 right-2 rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[0.7rem] font-semibold text-white/70 transition hover:bg-white/15 hover:text-white"
            aria-label={copied ? "Copied" : "Copy code"}
          >
            {copied ? (
              <span className="inline-flex items-center gap-1">
                <Check size={12} /> Copied
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <Copy size={12} /> {lang}
              </span>
            )}
          </button>
        )}
        <pre className="m-0">
          <code>{code}</code>
        </pre>
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs text-muted">{caption}</figcaption>
      )}
    </figure>
  );
}
