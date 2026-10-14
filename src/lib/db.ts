import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

/**
 * SQLite data layer for BuilderVerse.
 *
 * Only *user data* lives here (accounts, progress, XP, badges...).
 * Curriculum content (lessons, challenges, ideas, projects) ships with the
 * code in `src/content` so it stays versioned, typed and easy to update.
 *
 * Row shapes are declared in `./db-types` so client components can reference
 * them with `import type` without dragging `better-sqlite3` into the browser.
 */
// Re-exported so existing modules keep importing row shapes from here, while
// client components can import them from `@/lib/db-types` instead (no runtime
// dependency on better-sqlite3).
export type {
  UserRow,
  UserRole,
  CertificateRow,
  PortfolioProjectRow,
  XpEventRow,
} from "./db-types";

export interface SessionRow {
  token: string;
  user_id: string;
  created_at: string;
  expires_at: string;
}

export interface PasswordResetRow {
  token: string;
  user_id: string;
  expires_at: string;
  used: number;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  href: string | null;
  is_read: number;
  created_at: string;
}


export interface AiConversationRow {
  id: string;
  user_id: string;
  mode: string;
  title: string;
  messages: string;
  created_at: string;
  updated_at: string;
}

/** A project idea the student wrote themselves (Ideas Vault, §14). */
export interface PersonalIdeaRow {
  id: string;
  user_id: string;
  title: string;
  problem: string;
  who: string;
  solution: string;
  skills: string;
  category: string;
  created_at: string;
}



const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  builder_id TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT '≡ƒ¢á∩╕Å',
  headline TEXT NOT NULL DEFAULT 'Learning to build.',
  github_url TEXT,
  website_url TEXT,
  theme TEXT NOT NULL DEFAULT 'system',
  role TEXT NOT NULL DEFAULT 'student',
  notify_missions INTEGER NOT NULL DEFAULT 1,
  experience_level TEXT,
  learning_goal TEXT,
  study_time TEXT,
  interests TEXT,
  xp INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS password_resets (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  used INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_slug TEXT NOT NULL,
  quiz_score INTEGER NOT NULL DEFAULT 0,
  quiz_total INTEGER NOT NULL DEFAULT 0,
  completed INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (user_id, lesson_slug)
);

CREATE TABLE IF NOT EXISTS challenge_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_slug TEXT NOT NULL,
  hints_used INTEGER NOT NULL DEFAULT 0,
  correct INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS debug_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  debug_slug TEXT NOT NULL,
  hints_used INTEGER NOT NULL DEFAULT 0,
  solved INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS project_progress (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_slug TEXT NOT NULL,
  steps_done TEXT NOT NULL DEFAULT '[]',
  completed INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (user_id, project_slug)
);

CREATE TABLE IF NOT EXISTS mission_completions (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mission_slug TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (user_id, mission_slug, date)
);

CREATE TABLE IF NOT EXISTS user_badges (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_slug TEXT NOT NULL,
  earned_at TEXT NOT NULL,
  PRIMARY KEY (user_id, badge_slug)
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  href TEXT,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS portfolio_projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  tech TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  github_url TEXT,
  live_url TEXT,
  completed_date TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bookmarks (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ref_type TEXT NOT NULL,
  ref_slug TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (user_id, ref_type, ref_slug)
);

CREATE TABLE IF NOT EXISTS ai_conversations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL,
  title TEXT NOT NULL,
  messages TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS personal_ideas (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  problem TEXT NOT NULL,
  who TEXT NOT NULL DEFAULT '',
  solution TEXT NOT NULL DEFAULT '',
  skills TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'productivity',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS xp_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  kind TEXT NOT NULL,
  label TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  path_id TEXT NOT NULL,
  path_name TEXT NOT NULL,
  level TEXT NOT NULL,
  display_name TEXT NOT NULL,
  template TEXT NOT NULL DEFAULT 'classic',
  photo TEXT,
  revoked INTEGER NOT NULL DEFAULT 0,
  publicly_shared INTEGER NOT NULL DEFAULT 0,
  reissue_of TEXT,
  replaced_by TEXT,
  issued_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_attempts_user ON challenge_attempts(user_id, challenge_slug);
CREATE INDEX IF NOT EXISTS idx_debug_attempts_user ON debug_attempts(user_id, debug_slug);
CREATE INDEX IF NOT EXISTS idx_personal_ideas_user ON personal_ideas(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_xp_events_user ON xp_events(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id, issued_at);
`;

type GlobalWithDb = typeof globalThis & { __bvDb?: Database.Database };

/**
 * SQLite cannot add columns via `CREATE TABLE IF NOT EXISTS`, so existing
 * databases get additive migrations here. Idempotent: every check is a no-op
 * once the column exists. (Phase A: Builder ID + learning preferences.)
 */
function migrate(db: Database.Database): void {
  const columns = db.prepare("PRAGMA table_info(users)").all() as { name: string }[];
  const has = (name: string) => columns.some((c) => c.name === name);

  const additions: [name: string, ddl: string][] = [
    ["builder_id", "ALTER TABLE users ADD COLUMN builder_id TEXT NOT NULL DEFAULT ''"],
    ["experience_level", "ALTER TABLE users ADD COLUMN experience_level TEXT"],
    ["learning_goal", "ALTER TABLE users ADD COLUMN learning_goal TEXT"],
    ["study_time", "ALTER TABLE users ADD COLUMN study_time TEXT"],
    ["interests", "ALTER TABLE users ADD COLUMN interests TEXT"],
    ["role", "ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'student'"],
  ];
  for (const [name, ddl] of additions) {
    if (!has(name)) db.exec(ddl);
  }

  syncAdmins(db);

  // Backfill Builder IDs for accounts created before they existed, oldest first.
  const missing = db
    .prepare(
      "SELECT id FROM users WHERE builder_id IS NULL OR builder_id = '' ORDER BY created_at ASC",
    )
    .all() as { id: string }[];
  if (missing.length > 0) {
    let next = maxBuilderId(db);
    const update = db.prepare("UPDATE users SET builder_id = ? WHERE id = ?");
    for (const row of missing) {
      next += 1;
      update.run(formatBuilderId(next), row.id);
    }
  }
}

/**
 * Access roles (§3 of the product spec). Only `admin` unlocks the
 * administrator area — every other account is a Student.
 */
export const ROLES = ["student", "admin"] as const;
export type Role = (typeof ROLES)[number];

export function isAdmin(role: string | null | undefined): boolean {
  return role === "admin";
}

/**
 * Reads the administrator allowlist from `ADMIN_EMAILS` (comma-separated).
 *
 * Promotion is deliberately explicit: nobody becomes an admin by registering
 * first, and the browser can never grant itself the role. The founder lists
 * their own email (and any co-admins) in the environment, and matching
 * accounts are promoted on boot.
 */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Grants `admin` to any account whose email appears in `ADMIN_EMAILS`.
 *
 * Deliberately one-directional — removing an email never silently strips an
 * existing admin's access, because a typo in the environment should not cause
 * a lockout. Roles are changed from the admin UI instead.
 */
function syncAdmins(db: Database.Database): void {
  const allow = adminEmails();
  if (allow.length === 0) return;

  const placeholders = allow.map(() => "?").join(",");
  db.prepare(
    `UPDATE users SET role = 'admin'
     WHERE role <> 'admin' AND LOWER(email) IN (${placeholders})`,
  ).run(...allow);
}

function maxBuilderId(db: Database.Database): number {
  const rows = db
    .prepare("SELECT builder_id FROM users WHERE builder_id LIKE 'BV-%'")
    .all() as { builder_id: string }[];
  let max = 0;
  for (const row of rows) {
    const n = Number.parseInt(row.builder_id.slice(3), 10);
    if (Number.isFinite(n) && n > max) max = n;
  }
  return max;
}

function formatBuilderId(n: number): string {
  return `BV-${String(n).padStart(6, "0")}`;
}

/**
 * Next free Builder Passport ID (`BV-000001`, `BV-000002`, …).
 * Sequential per the product spec; safe in this single-writer app
 * (better-sqlite3 is synchronous, so SELECT→INSERT cannot interleave).
 */
export function nextBuilderId(): string {
  return formatBuilderId(maxBuilderId(getDb()) + 1);
}

/** Parses the `interests` JSON column into a string array (never throws). */
export function parseInterests(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function openDatabase(): Database.Database {
  const dbPath =
    process.env.DATABASE_PATH?.trim() ||
    path.join(process.cwd(), "data", "builderverse.db");

  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);
  migrate(db);
  return db;
}

/** Singleton connection that survives dev-server hot reloads. */
export function getDb(): Database.Database {
  const g = globalThis as GlobalWithDb;
  if (!g.__bvDb) {
    g.__bvDb = openDatabase();
  }
  return g.__bvDb;
}

export function all<T>(sql: string, ...params: unknown[]): T[] {
  return getDb()
    .prepare(sql)
    .all(...(params as never[])) as T[];
}

export function first<T>(sql: string, ...params: unknown[]): T | undefined {
  return getDb()
    .prepare(sql)
    .get(...(params as never[])) as T | undefined;
}

export function run(sql: string, ...params: unknown[]): Database.RunResult {
  return getDb()
    .prepare(sql)
    .run(...(params as never[]));
}

export function isoNow(): string {
  return new Date().toISOString();
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
