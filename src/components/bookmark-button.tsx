"use client";

import { useState, useTransition } from "react";
import { Bookmark, Check } from "lucide-react";
import { clsx } from "clsx";
import { toggleBookmarkAction } from "@/app/actions/progress";

export function BookmarkButton({
  refType,
  refSlug,
  initialSaved = false,
  onToggle,
}: {
  refType: "idea" | "lesson" | "project";
  refSlug: string;
  initialSaved?: boolean;
  onToggle?: (saved: boolean) => void;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      const res = await toggleBookmarkAction(refType, refSlug);
      if (!res.ok) return;
      setSaved(res.bookmarked);
      onToggle?.(res.bookmarked);
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={saved}
      aria-label={saved ? "Remove bookmark" : "Save to bookmarks"}
      className={clsx(
        "inline-flex size-9 items-center justify-center rounded-xl border text-sm transition",
        saved
          ? "border-brand/40 bg-brand-soft text-brand"
          : "border-line bg-surface-2 text-muted hover:border-brand/40 hover:text-brand",
      )}
    >
      {saved ? <Check size={16} aria-hidden /> : <Bookmark size={16} aria-hidden />}
    </button>
  );
}