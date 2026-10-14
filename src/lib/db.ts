import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

/**
 * SQLite data layer for BuilderVerse.
 *
 * Only *user data* lives here (accounts, progress, XP, badges...).
 * Curriculum content (lessons, challenges, ideas, projects) ships with the
 * code in `src/content` so it stays versioned, typed and easy to update.
 */

export interface UserRow {
  id: string;
  name: string;
  username: string;
  email: string;
  password_hash: string;
  avatar: string;
  headline: string;
  github_url: string | null;
  website_url: string | null;
  theme: "light" | "dark" | "system";
  notify_missions: number;
  xp: number;
  streak: number;
  longest_streak: number;
  last_active_date: string | null;
  created_at: string;
}

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

export interface AiConversationRow {
  id: string;
  user_id: string;
  mode: string;
  title: string;
  messages: string;
  created_at: string;
  updated_at: string;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT '🛠️',
  headline TEXT NOT NULL DEFAULT 'Learning to build.',
  github_url TEXT,
  website_url TEXT,
  theme TEXT NOT NULL DEFAULT 'system',
  notify_missions INTEGER NOT NULL DEFAULT 1,
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

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_attempts_user ON challenge_attempts(user_id, challenge_slug);
CREATE INDEX IF NOT EXISTS idx_debug_attempts_user ON debug_attempts(user_id, debug_slug);
`;

type GlobalWithDb = typeof globalThis & { __bvDb?: Database.Database };

function openDatabase(): Database.Database {
  const dbPath =
    process.env.DATABASE_PATH?.trim() ||
    path.join(process.cwd(), "data", "builderverse.db");

  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);
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
