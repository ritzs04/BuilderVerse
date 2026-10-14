import type { LearningPath } from "./types";

export const learningPaths: LearningPath[] = [
  {
    slug: "html",
    title: "HTML",
    tagline: "Give your pages structure",
    description:
      "HTML is the skeleton of every website. Learn how to build meaningful pages with headings, text, images, links, forms and semantic structure.",
    icon: "code",
    color: "rose",
    order: 1,
  },
  {
    slug: "css",
    title: "CSS",
    tagline: "Make it look intentional",
    description:
      "CSS turns a plain document into a designed interface. Learn the box model, flexbox, grid, responsive design and how to style with confidence.",
    icon: "palette",
    color: "blue",
    order: 2,
  },
  {
    slug: "javascript",
    title: "JavaScript",
    tagline: "Make it interactive",
    description:
      "JavaScript is where pages come alive. Start with variables and conditions, then work up to functions, arrays, objects and the DOM.",
    icon: "braces",
    color: "amber",
    order: 3,
  },
  {
    slug: "dom",
    title: "DOM",
    tagline: "Control the page with code",
    description:
      "The DOM is how JavaScript reaches into your page. Select elements, listen for events, create content dynamically and build real interactions.",
    icon: "layers",
    color: "violet",
    order: 4,
  },
  {
    slug: "apis",
    title: "APIs",
    tagline: "Talk to the outside world",
    description:
      "Learn how web apps fetch data from servers with fetch, JSON, async/await and how to handle the unhappy paths that every real app faces.",
    icon: "globe",
    color: "emerald",
    order: 5,
  },
  {
    slug: "git",
    title: "Git & GitHub",
    tagline: "Save, share, collaborate",
    description:
      "Version control is a builder's safety net. Learn commits, branches, pushing to GitHub and recovering gracefully when things go wrong.",
    icon: "git",
    color: "cyan",
    order: 6,
  },
];

export function getPath(slug: string): LearningPath | undefined {
  return learningPaths.find((p) => p.slug === slug);
}
