import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

/**
 * Serves the e2e suite from a production `next build` via `next start`,
 * run in-process (the same `next start` the Docker image runs) so no
 * orphan server is left behind when Playwright tears the webServer down.
 * Run from the repo root after `next build`.
 */

const root = process.cwd();

// Each run starts from a clean test database — never the dev one.
const dbPath = path.join(root, "data", "e2e.db");
for (const suffix of ["", "-wal", "-shm"]) {
  fs.rmSync(dbPath + suffix, { force: true });
}
process.env.DATABASE_PATH = dbPath;
process.env.PORT = process.env.PORT || "3111";
process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";

process.argv = [
  process.execPath,
  "next",
  "start",
  "-p",
  process.env.PORT,
  "-H",
  process.env.HOSTNAME,
];
createRequire(import.meta.url)("next/dist/bin/next");
