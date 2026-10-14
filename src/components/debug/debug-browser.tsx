"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/icon-registry";
import { Input, Pill } from "@/components/ui";

export interface DebugItem {
  slug: string;
  title: string;
  language: string;
  languageLabel: string;
  difficulty: string;
  symptom: string;
  xp: number;
}

export function DebugBrowser({ items, solved }: { items: DebugItem[]; solved: string[] }) {
  const solvedSet = useMemo(() => new Set(solved), [solved]);
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("all");
  const [difficulty, setDifficulty] = useState("all");

  const languages = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of items) map.set(item.language, item.languageLabel);
    return [...map.entries()];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (language !== "all" && item.language !== language) return false;
      if (difficulty !== "all" && item.difficulty !== difficulty) return false;
      if (q && !`${item.title} ${item.symptom}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, query, language, difficulty]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Icon
            name="search"
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symptoms or bugs…"
            aria-label="Search debugging puzzles"
            className="!pl-9"
          />
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          aria-label="Filter by language"
          className="bv-input !w-auto text-sm"
        >
          <option value="all">All languages</option>
          {languages.map(([slug, label]) => (
            <option key={slug} value={slug}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          aria-label="Filter by difficulty"
          className="bv-input !w-auto text-sm"
        >
          <option value="all">All levels</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
          <option value="Expert">Expert</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const isSolved = solvedSet.has(item.slug);
          return (
            <Link
              key={item.slug}
              href={`/debug/${item.slug}`}
              className="bv-card flex flex-col p-5 transition hover:border-danger/40 hover:shadow-[var(--bv-shadow)]"
            >
              <div className="flex items-start justify-between gap-3">
                <Pill tone="brand">{item.languageLabel}</Pill>
                {isSolved ? <Pill tone="success">✓ Squashed</Pill> : <Pill>{item.difficulty}</Pill>}
              </div>
              <h3 className="mt-3 font-bold text-ink">{item.title}</h3>
              <p className="mt-1 line-clamp-3 flex-1 text-sm text-muted">{item.symptom}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted">
                <span>⚡ {item.xp} XP</span>
                <span className="font-semibold text-danger">Investigate →</span>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bv-card-flat px-6 py-10 text-center">
          <p className="font-semibold text-ink">No puzzles match those filters.</p>
          <button
            type="button"
            className="mt-2 text-sm font-semibold text-brand hover:underline"
            onClick={() => {
              setQuery("");
              setLanguage("all");
              setDifficulty("all");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
