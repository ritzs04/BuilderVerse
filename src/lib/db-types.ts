/**
 * Type-only row shapes.
 *
 * These live apart from `db.ts` on purpose: a client component can then
 * `import type` from here without pulling `better-sqlite3` (and Node's `fs`)
 * into the browser bundle. Never add runtime values to this file.
 */

export type UserRole = "student" | "admin";

export interface UserRow {
  id: string;
  /** Public, unique Builder Passport ID, e.g. `BV-000001`. */
  builder_id: string;
  name: string;
  username: string;
  email: string;
  password_hash: string;
  avatar: string;
  headline: string;
  github_url: string | null;
  website_url: string | null;
  theme: "light" | "dark" | "system";
  role: UserRole;
  notify_missions: number;
  experience_level: string | null;
  learning_goal: string | null;
  study_time: string | null;
  interests: string | null;
  xp: number;
  streak: number;
  longest_streak: number;
  last_active_date: string | null;
  created_at: string;
}

export interface CertificateRow {
  id: string;
  user_id: string;
  path_id: string;
  path_name: string;
  /** `"course-graduate" | "project-creator" | "independent-builder"`. */
  level: string;
  display_name: string;
  template: string;
  /** Compressed JPEG data URL of the student photo, or null for text-only. */
  photo: string | null;
  revoked: number;
  publicly_shared: number;
  reissue_of: string | null;
  replaced_by: string | null;
  issued_at: string;
  created_at: string;
}

export interface PortfolioProjectRow {
  id: string;
  user_id: string;
  name: string;
  description: string;
  tech: string;
  difficulty: string;
  github_url: string | null;
  live_url: string | null;
  completed_date: string | null;
  created_at: string;
}

export interface XpEventRow {
  id: string;
  user_id: string;
  amount: number;
  kind: string;
  label: string;
  created_at: string;
}
