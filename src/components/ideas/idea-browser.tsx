"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookmarkButton } from "@/components/bookmark-button";
import { Input, Pill } from "@/components/ui";
import { Icon } from "@/components/icon-registry";

export interface IdeaItem {
  slug: string;
  title: string;
  difficulty: string;
  categories: string[];
  tech: string[];
  problem: string;
}

export function IdeaBrowser({
  items,
  initiallyBookmarked,
}: {
  items: IdeaItem[];
  initiallyBookmarked: string[];
}) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [category, setCategory] = useState("all");
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [bookmarked, setBookmarked] = useState(new Set(initiallyBookmarked));

  const categories = useMemo(
    () => [...new Set(items.flatMap((item) => item.categories))].sort(),
    [items],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (difficulty !== "all" && item.difficulty !== difficulty) return false;
      if (category !== "all" && !item.categories.includes(category)) return false;
      if (onlyBookmarked && !bookmarked.has(item.slug)) return false;
      if (
        q &&
        !`${item.title} ${item.problem} ${item.tech.join(" ")} ${item.categories.join(" ")}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
  }, [items, query, difficulty, category, onlyBookmarked, bookmarked]);

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
            placeholder="Search ideas, problems, skills…"
            aria-label="Search project ideas"
            className="!pl-9"
          />
        </div>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          aria-label="Filter by difficulty"
          className="bv-input !w-auto text-sm"
        >
          <option value="all">All levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className="bv-input !w-auto text-sm"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <label className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft">
        <input
          type="checkbox"
          checked={onlyBookmarked}
          onChange={(e) => setOnlyBookmarked(e.target.checked)}
          className="size-4 accent-[var(--bv-brand)]"
        />
        Only show bookmarked
      </label>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const saved = bookmarked.has(item.slug);
          return (
            <div
              key={item.slug}
              className="bv-card flex flex-col p-5 transition hover:border-brand/40 hover:shadow-[var(--bv-shadow)]"
            >
              <div className="flex items-start justify-between gap-2">
                <Pill tone={item.difficulty === "Beginner" ? "success" : item.difficulty === "Intermediate" ? "brand" : "warning"}>
                  {item.difficulty}
                </Pill>
                <BookmarkButton
                  refType="idea"
                  refSlug={item.slug}
                  initialSaved={saved}
                  onToggle={(nowSaved) =>
                    setBookmarked((current) => {
                      const next = new Set(current);
                      if (nowSaved) next.add(item.slug);
                      else next.delete(item.slug);
                      return next;
                    })
                  }
                />
              </div>
              <Link href={`/ideas/${item.slug}`} className="mt-3 flex-1">
                <h3 className="font-bold text-ink hover:underline">{item.title}</h3>
                <p className="mt-1 line-clamp-3 text-sm text-muted">{item.problem}</p>
              </Link>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.tech.slice(0, 3).map((tech) => (
                  <Pill key={tech} className="!text-[0.7rem]">
                    {tech}
                  </Pill>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bv-card-flat px-6 py-10 text-center">
          <p className="font-semibold text-ink">No ideas match those filters.</p>
          <button
            type="button"
            className="mt-2 text-sm font-semibold text-brand hover:underline"
            onClick={() => {
              setQuery("");
              setDifficulty("all");
              setCategory("all");
              setOnlyBookmarked(false);
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}