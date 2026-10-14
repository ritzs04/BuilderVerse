import type { BuilderLevel } from "./types";

export const builderLevels: BuilderLevel[] = [
  { level: 1, title: "Curious Builder", minXp: 0, motto: "You showed up. That counts." },
  { level: 2, title: "Explorer", minXp: 150, motto: "You are reading, trying and repeating." },
  { level: 3, title: "Problem Solver", minXp: 400, motto: "You stop and think before you paste." },
  { level: 4, title: "Builder", minXp: 800, motto: "You finish things, not just tutorials." },
  { level: 5, title: "Project Maker", minXp: 1400, motto: "Your portfolio is starting to talk." },
  { level: 6, title: "Debugging Ninja", minXp: 2200, motto: "Errors no longer scare you." },
  { level: 7, title: "Independent Builder", minXp: 3200, motto: "You figure things out alone." },
  { level: 8, title: "BuilderVerse Pro", minXp: 4500, motto: "You build, and you help others build." },
];

export function levelForXp(xp: number): BuilderLevel {
  let current = builderLevels[0];
  for (const level of builderLevels) {
    if (xp >= level.minXp) current = level;
  }
  return current;
}

export function nextLevel(xp: number): BuilderLevel | null {
  return builderLevels.find((l) => l.minXp > xp) ?? null;
}

/** Progress (0-100) from the current level towards the next one. */
export function levelProgress(xp: number): number {
  const current = levelForXp(xp);
  const next = nextLevel(xp);
  if (!next) return 100;
  const span = next.minXp - current.minXp;
  if (span <= 0) return 100;
  return Math.min(100, Math.round(((xp - current.minXp) / span) * 100));
}
