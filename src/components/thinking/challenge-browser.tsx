"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { Icon } from "@/components/icon-registry";
import { Input, Pill } from "@/components/ui";

export interface ThinkingItem {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  difficulty: string;
  xp: number;
  prompt: string;
}

export function ChallengeBrowser({
  items,
  solved,
}: {
  items: ThinkingItem[];
  solved: string[];
}) {
  const solvedSet = useMemo(() => new Set(solved), [solved]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of items) map.set(item.category, item.categoryLabel);
    return [...map.entries()];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (difficulty !== "all" && item.difficulty !== difficulty) return false;
      if (q && !`${item.title} ${item.prompt}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, query, category, difficulty]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Icon
            name="search"
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search challenges…"
            aria-label="Search thinking challenges"
            className="!pl-9"
          />
        </div>

        <div className="flex gap-2">
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
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={clsx("bv-pill cursor-pointer", category === "all" && "!bg-brand !text-white")}
        >
          All topics
        </button>
        {categories.map(([slug, label]) => (
          <button
            key={slug}
            type="button"
            onClick={() => setCategory(slug)}
            className={clsx(
              "bv-pill cursor-pointer",
              category === slug && "!bg-brand !text-white",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const isSolved = solvedSet.has(item.slug);
          return (
            <Link
              key={item.slug}
              href={`/think/${item.slug}`}
              className="bv-card flex flex-col p-5 transition hover:border-brand/40 hover:shadow-[var(--bv-shadow)]"
            >
              <div className="flex items-start justify-between gap-3">
                <Pill tone="brand">{item.categoryLabel}</Pill>
                {isSolved ? <Pill tone="success">✓ Solved</Pill> : <Pill>{item.difficulty}</Pill>}
              </div>
              <h3 className="mt-3 font-bold text-ink">{item.title}</h3>
              <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted">{item.prompt}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted">
                <span>⚡ {item.xp} XP</span>
                <span className="font-semibold text-brand">Solve →</span>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bv-card-flat px-6 py-10 text-center">
          <p className="font-semibold text-ink">No challenges match those filters.</p>
          <button
            type="button"
            className="mt-2 text-sm font-semibold text-brand hover:underline"
            onClick={() => {
              setQuery("");
              setCategory("all");
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
