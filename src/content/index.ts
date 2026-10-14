import type { Lesson, LearningPath } from "./types";
import { learningPaths, getPath } from "./paths";
import { htmlLessons } from "./lessons/html";
import { cssLessons } from "./lessons/css";
import { javascriptLessons } from "./lessons/javascript";
import { domLessons } from "./lessons/dom";
import { apiLessons } from "./lessons/apis";
import { gitLessons } from "./lessons/git";
import { thinkingChallenges, thinkingCategoryLabels } from "./thinking";
import { debugChallenges, debugLanguageLabels } from "./debug";
import { guidedProjects } from "./projects";
import { projectIdeas } from "./ideas";
import { badges, getBadge } from "./badges";
import { dailyMissions, missionForDate } from "./missions";
import { builderLevels, levelForXp, nextLevel, levelProgress } from "./levels";

export * from "./types";
export {
  learningPaths,
  getPath,
  thinkingChallenges,
  thinkingCategoryLabels,
  debugChallenges,
  debugLanguageLabels,
  guidedProjects,
  projectIdeas,
  badges,
  getBadge,
  dailyMissions,
  missionForDate,
  builderLevels,
  levelForXp,
  nextLevel,
  levelProgress,
};

const lessonsByPathRecord: Record<string, Lesson[]> = {
  html: htmlLessons,
  css: cssLessons,
  javascript: javascriptLessons,
  dom: domLessons,
  apis: apiLessons,
  git: gitLessons,
};

export interface LessonWithMeta extends Lesson {
  pathSlug: string;
  pathTitle: string;
}

function withMeta(lessons: Lesson[], path: LearningPath): LessonWithMeta[] {
  return lessons
    .map((lesson) => ({ ...lesson, pathSlug: path.slug, pathTitle: path.title }))
    .sort((a, b) => a.order - b.order);
}

/** Every lesson in the platform, in path order. */
export const allLessons: LessonWithMeta[] = learningPaths.flatMap((path) =>
  withMeta(lessonsByPathRecord[path.slug] ?? [], path),
);

export function lessonsForPath(pathSlug: string): LessonWithMeta[] {
  const path = getPath(pathSlug);
  if (!path) return [];
  return withMeta(lessonsByPathRecord[pathSlug] ?? [], path);
}

export function getLesson(slug: string): LessonWithMeta | undefined {
  return allLessons.find((l) => l.slug === slug);
}

export function getThinkingChallenge(slug: string) {
  return thinkingChallenges.find((c) => c.slug === slug);
}

export function getDebugChallenge(slug: string) {
  return debugChallenges.find((c) => c.slug === slug);
}

export function getGuidedProject(slug: string) {
  return guidedProjects.find((p) => p.slug === slug);
}

export function getIdea(slug: string) {
  return projectIdeas.find((i) => i.slug === slug);
}

/** Search across lessons, projects, challenges and ideas. */
export interface SearchHit {
  type: "lesson" | "project" | "challenge" | "idea" | "path";
  title: string;
  subtitle: string;
  href: string;
}

export function searchContent(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const hits: SearchHit[] = [];

  const matches = (text: string) => text.toLowerCase().includes(q);

  for (const path of learningPaths) {
    if (matches(path.title) || matches(path.description)) {
      hits.push({
        type: "path",
        title: path.title,
        subtitle: path.tagline,
        href: `/learn/${path.slug}`,
      });
    }
  }

  for (const lesson of allLessons) {
    if (matches(lesson.title) || matches(lesson.summary) || matches(lesson.concept)) {
      hits.push({
        type: "lesson",
        title: lesson.title,
        subtitle: `${lesson.pathTitle} · ${lesson.summary}`,
        href: `/learn/${lesson.pathSlug}/${lesson.slug}`,
      });
    }
  }

  for (const project of guidedProjects) {
    if (matches(project.title) || matches(project.overview) || matches(project.tagline)) {
      hits.push({
        type: "project",
        title: project.title,
        subtitle: project.tagline,
        href: `/build/${project.slug}`,
      });
    }
  }

  for (const challenge of thinkingChallenges) {
    if (matches(challenge.title) || matches(challenge.prompt)) {
      hits.push({
        type: "challenge",
        title: challenge.title,
        subtitle: `Thinking Gym · ${challenge.difficulty}`,
        href: `/think/${challenge.slug}`,
      });
    }
  }

  for (const challenge of debugChallenges) {
    if (matches(challenge.title) || matches(challenge.symptom)) {
      hits.push({
        type: "challenge",
        title: challenge.title,
        subtitle: `Debugging · ${challenge.language}`,
        href: `/debug/${challenge.slug}`,
      });
    }
  }

  for (const idea of projectIdeas) {
    if (matches(idea.title) || matches(idea.problem)) {
      hits.push({
        type: "idea",
        title: idea.title,
        subtitle: `Idea · ${idea.difficulty}`,
        href: "/ideas",
      });
    }
  }

  return hits.slice(0, 30);
}
