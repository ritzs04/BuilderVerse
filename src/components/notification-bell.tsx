"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { markNotificationsReadAction } from "@/app/actions/progress";

export interface BellNotification {
  id: string;
  title: string;
  body: string;
  href: string | null;
  is_read: number;
  created_at: string;
}

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationBell({ notifications }: { notifications: BellNotification[] }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(notifications);
  const containerRef = useRef<HTMLDivElement>(null);

  const unread = items.filter((n) => n.is_read === 0).length;

  useEffect(
    () => {
      function onClick(event: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      }
      function onKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") setOpen(false);
      }
      document.addEventListener("mousedown", onClick);
      document.addEventListener("keydown", onKeyDown);
      return () => {
        document.removeEventListener("mousedown", onClick);
        document.removeEventListener("keydown", onKeyDown);
      };
    },
    [],
  );

  async function markAllRead() {
    setItems((current) => current.map((n) => ({ ...n, is_read: 1 })));
    await markNotificationsReadAction();
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
        aria-expanded={open}
        className="bv-btn bv-btn-ghost relative !p-2"
      >
        <Bell size={17} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-danger text-[0.6rem] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--bv-shadow-lg)]">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-bold text-ink">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-semibold text-brand hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <ul className="bv-scroll max-h-80 overflow-y-auto">
            {items.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-muted">
                Nothing yet — good things land here as you build.
              </li>
            )}
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href ?? "#"}
                  onClick={() => setOpen(false)}
                  className={`block border-b border-line px-4 py-3 transition hover:bg-surface-2 ${
                    item.is_read === 0 ? "bg-brand-soft/40" : ""
                  }`}
                >
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted">{item.body}</p>
                  <p className="mt-1 text-[0.7rem] text-muted/80">{timeAgo(item.created_at)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
