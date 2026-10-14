/**
 * Curriculum content types.
 *
 * All lessons, challenges, projects and ideas are plain typed data living in
 * `src/content`. The database only stores per-user progress referencing these
 * stable `slug` ids.
 */

export type Difficulty = "Beginner" | "Easy" | "Medium" | "Hard" | "Expert";

export type IdeaLevel = "Beginner" | "Intermediate" | "Advanced";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CodeBlock {
  lang: string;
  code: string;
  caption?: string;
}

export interface LessonSection {
  heading: string;
  body: string[];
  code?: CodeBlock;
}

export interface Lesson {
  slug: string;
  title: string;
  summary: string;
  order: number;
  minutes: number;
  xp: number;
  /** One-sentence concept introduction. */
  concept: string;
  /** Beginner-friendly explanation paragraphs. */
  explanation: string[];
  /** Real-world analogy that makes the concept click. */
  analogy: string;
  /** Worked example. */
  example: CodeBlock;
  /** Optional deeper breakdown shown as stacked sections. */
  sections?: LessonSection[];
  /** "Try it yourself" exercise. */
  tryIt: {
    instructions: string;
    starter: string;
    solution: string;
  };
  /** Mini challenge at the end of the lesson. */
  challenge: {
    task: string;
    hint: string;
    solution: string;
  };
  commonMistakes: { mistake: string; fix: string }[];
  quiz: QuizQuestion[];
}

export interface LearningPath {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  /** Key of the icon registry in `@/components/icon-registry`. */
  icon: string;
  /** Visual accent: "violet" | "blue" | "cyan" | "amber" | "rose" | "emerald". */
  color: "violet" | "blue" | "cyan" | "amber" | "rose" | "emerald";
  order: number;
}

export type ThinkingCategory =
  | "logic"
  | "patterns"
  | "conditions"
  | "loops"
  | "arrays"
  | "debugging"
  | "decomposition"
  | "algorithms"
  | "real-world";

export interface ThinkingChallenge {
  slug: string;
  title: string;
  category: ThinkingCategory;
  difficulty: Exclude<Difficulty, "Beginner">;
  prompt: string;
  context?: string;
  hints: string[];
  /** Short model answer shown after a correct attempt. */
  answer: string;
  /**
   * Answer checking rules: every entry must match at least one keyword
   * (case-insensitive substring of the learner's answer).
   */
  checks: string[][];
  /** What to show when the answer does not match yet. */
  encourage: string;
  xp: number;
}

export interface DebugChallenge {
  slug: string;
  title: string;
  language: "javascript" | "html" | "css" | "python";
  difficulty: Exclude<Difficulty, "Beginner">;
  buggyCode: string;
  /** Friendly framing instead of a raw error message. */
  symptom: string;
  whatHappened: string;
  whyItHappened: string;
  guidingQuestion: string;
  hints: string[];
  explanation: string;
  fixedCode: string;
  fixSummary: string;
  /** Optional answer check; when present the learner can "submit" a fix. */
  checks?: string[][];
  xp: number;
}

export interface ProjectStage {
  title: string;
  body: string[];
  tip?: string;
}

export interface GuidedProject {
  slug: string;
  title: string;
  tagline: string;
  difficulty: IdeaLevel;
  minutes: number;
  icon: string;
  color: LearningPath["color"];
  tech: string[];
  overview: string;
  youWillLearn: string[];
  requirements: string[];
  /** Checklist items shown on the project page (also used for progress). */
  checklist: string[];
  stages: ProjectStage[];
}

export interface ProjectIdea {
  slug: string;
  title: string;
  difficulty: IdeaLevel;
  categories: string[];
  tech: string[];
  problem: string;
  features: string[];
  learningGoals: string[];
  extensions: string[];
}

export interface Badge {
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export interface DailyMission {
  slug: string;
  title: string;
  description: string;
  kind: "build" | "learn" | "think" | "debug" | "share";
  minutes: number;
  xp: number;
}

export interface BuilderLevel {
  level: number;
  title: string;
  minXp: number;
  motto: string;
}
