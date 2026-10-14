import type { DailyMission } from "./types";

/**
 * Daily missions are picked deterministically from this pool so every builder
 * sees the same mission on the same day, and the selection never changes
 * between reloads.
 */
export const dailyMissions: DailyMission[] = [
  {
    slug: "one-button",
    title: "Build one styled button",
    description:
      "Create a button in HTML/CSS with hover, focus and active states. Small, but it is the detail that makes interfaces feel finished.",
    kind: "build",
    minutes: 15,
    xp: 30,
  },
  {
    slug: "fix-a-typo",
    title: "Find the hidden typo",
    description:
      "Open today's debugging puzzle and locate the bug before revealing any hints. Reading code carefully is a superpower.",
    kind: "debug",
    minutes: 15,
    xp: 40,
  },
  {
    slug: "one-function",
    title: "Write one JavaScript function",
    description:
      "Write a function that takes a list of numbers and returns the average. No frameworks, just you and the problem.",
    kind: "build",
    minutes: 20,
    xp: 40,
  },
  {
    slug: "one-logic",
    title: "Solve one Thinking Gym puzzle",
    description:
      "Warm up your problem-solving brain with a single logic challenge. Reason it out before you check the hints.",
    kind: "think",
    minutes: 10,
    xp: 35,
  },
  {
    slug: "finish-a-lesson",
    title: "Finish one lesson",
    description:
      "Pick the next lesson in your current path and complete it, quiz included.",
    kind: "learn",
    minutes: 25,
    xp: 45,
  },
  {
    slug: "responsive-card",
    title: "Make a card responsive",
    description:
      "Take any card layout and make it look right at 360px, 768px and 1280px wide. Resize the window, do not guess.",
    kind: "build",
    minutes: 20,
    xp: 40,
  },
  {
    slug: "read-error",
    title: "Read an error message slowly",
    description:
      "Open a debugging puzzle and write down what happened, why, and where — before looking at the hints.",
    kind: "debug",
    minutes: 10,
    xp: 30,
  },
  {
    slug: "improve-old",
    title: "Improve an old project",
    description:
      "Open something you built before and improve one thing: spacing, contrast, a bug, or a missing edge case.",
    kind: "build",
    minutes: 30,
    xp: 50,
  },
  {
    slug: "push-github",
    title: "Push something to GitHub",
    description:
      "Commit your recent work with a clear message and push it. Future-you will thank present-you.",
    kind: "share",
    minutes: 10,
    xp: 30,
  },
  {
    slug: "explain-out-loud",
    title: "Explain a concept out loud",
    description:
      "Pick today's lesson concept and explain it aloud in your own words, as if teaching a friend. If you stumble, that is the gap to study.",
    kind: "learn",
    minutes: 15,
    xp: 35,
  },
];

/** Deterministic daily mission picker based on the UTC date. */
export function missionForDate(dateKey: string): DailyMission {
  const dayNumber = Math.floor(Date.parse(dateKey) / 86_400_000);
  const index = ((dayNumber % dailyMissions.length) + dailyMissions.length) % dailyMissions.length;
  return dailyMissions[index];
}
