import type { Badge } from "./types";

export const badges: Badge[] = [
  {
    slug: "first-build",
    name: "First Build",
    description: "Completed your first guided project.",
    icon: "🏗️",
  },
  {
    slug: "first-lesson",
    name: "First Step",
    description: "Completed your first lesson.",
    icon: "👣",
  },
  {
    slug: "first-debug",
    name: "Bug Hunter",
    description: "Solved your first debugging puzzle.",
    icon: "🐛",
  },
  {
    slug: "thinker",
    name: "Thinker",
    description: "Solved 5 Thinking Gym challenges.",
    icon: "🧠",
  },
  {
    slug: "streak-7",
    name: "7 Day Builder",
    description: "Kept a 7 day builder streak alive.",
    icon: "🔥",
  },
  {
    slug: "streak-3",
    name: "Consistent Builder",
    description: "Kept a 3 day builder streak alive.",
    icon: "🎯",
  },
  {
    slug: "quiz-ace",
    name: "Quiz Ace",
    description: "Scored full marks on a lesson quiz.",
    icon: "🎓",
  },
  {
    slug: "debugger-5",
    name: "Debugging Beginner",
    description: "Solved 5 debugging puzzles.",
    icon: "🛠️",
  },
  {
    slug: "project-3",
    name: "Triple Build",
    description: "Completed 3 guided projects.",
    icon: "🚀",
  },
  {
    slug: "ideas-collector",
    name: "Ideas Collector",
    description: "Bookmarked 5 project ideas.",
    icon: "💡",
  },
  {
    slug: "sharpshooter",
    name: "Sharpshooter",
    description: "Answered 10 quiz questions correctly in a row.",
    icon: "🎯",
  },
  {
    slug: "independent",
    name: "Independent Builder",
    description: "Added 3 projects to your portfolio.",
    icon: "🏆",
  },
  {
    slug: "mission-streak",
    name: "Mission Complete",
    description: "Completed 5 daily missions.",
    icon: "✅",
  },
  {
    slug: "path-finisher",
    name: "Path Finisher",
    description: "Completed every lesson in a learning path.",
    icon: "🧭",
  },
];

export function getBadge(slug: string): Badge | undefined {
  return badges.find((b) => b.slug === slug);
}
