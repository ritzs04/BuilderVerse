import { all, first, isoNow, run, todayKey, type CertificateRow } from "@/lib/db";
import { getGuidedProject, getPath, lessonsForPath } from "@/content";
import {
  CERTIFICATE_LEVELS,
  CERTIFICATE_TEMPLATES,
  LEVEL_LABELS,
  isCertificateLevel,
  isCertificateTemplate,
  type CertificateLevel,
  type CertificateTemplate,
} from "@/lib/certificate-shared";

export {
  CERTIFICATE_LEVELS,
  CERTIFICATE_TEMPLATES,
  LEVEL_LABELS,
  type CertificateLevel,
  type CertificateTemplate,
};

/**
 * Certificate issuing and verification (Graduation Studio, docx §19–21).
 *
 * Certificates are server-verified: a level is only granted when the learner
 * has actually completed the lessons and projects that back it up. The public
 * `id` doubles as the verification key, so the QR code and share link resolve
 * to real server state rather than a device-local registry.
 */


// Crockford base32 — no I, L, O or U, so IDs are never misread aloud.
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/**
 * Unpredictable certificate ID: `BV-CERT-<year>-<6 random chars>-<checksum>`.
 *
 * The checksum makes typos and hand-edited IDs detectable by the verification
 * page, which is why a tampered ID can never present as valid.
 */
export function generateCertificateId(pathId: string): string {
  const year = new Date().getFullYear().toString();
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const bytes = new Uint8Array(6);
    crypto.getRandomValues(bytes);
    const segment = Array.from(
      bytes,
      (b) => ALPHABET[b % ALPHABET.length],
    ).join("");
    const id = `BV-CERT-${year}-${segment}-${checksum(year, segment, pathId)}`;
    const clash = first<{ id: string }>(
      "SELECT id FROM certificates WHERE id = ?",
      id,
    );
    if (!clash) return id;
  }
  throw new Error("Could not allocate a unique certificate ID");
}

function checksum(year: string, segment: string, pathId: string): string {
  const text = `${year}-${segment}-${pathId}-builderverse`;
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  const abs = Math.abs(hash);
  return `${abs % 36}${ALPHABET[abs % ALPHABET.length]}`;
}

/** Shape check + checksum validation, so a hand-edited ID fails loudly. */
export function isCertificateIdWellFormed(id: string, pathId?: string): boolean {
  const parts = id.split("-");
  if (parts.length !== 5 || parts[0] !== "BV" || parts[1] !== "CERT") return false;
  const [, , year, segment, check] = parts;
  if (!/^\d{4}$/.test(year) || segment.length !== 6) return false;
  if (!pathId) return true;
  return check === checksum(year, segment, pathId);
}

/**
 * Server-verified completion for one learning path.
 *
 * Course Graduate needs every lesson in the path completed with a passing quiz
 * score. These counts come straight from `lesson_progress`, so the browser can
 * never claim a certificate it has not earned.
 */
export function pathCompletion(
  userId: string,
  pathId: string,
): { total: number; completed: number; passed: boolean } {
  const lessons = lessonsForPath(pathId);
  if (lessons.length === 0) return { total: 0, completed: 0, passed: false };

  const rows = all<{ lesson_slug: string; completed: number; quiz_score: number; quiz_total: number }>(
    `SELECT lesson_slug, completed, quiz_score, quiz_total
       FROM lesson_progress
      WHERE user_id = ? AND completed = 1`,
    userId,
  );
  const done = new Map(rows.map((r) => [r.lesson_slug, r]));

  let completed = 0;
  for (const lesson of lessons) {
    const row = done.get(lesson.slug);
    // A lesson only counts once its quiz was actually passed, not just opened.
    if (row && row.quiz_total > 0 && row.quiz_score / row.quiz_total >= 0.6) {
      completed += 1;
    }
  }

  return {
    total: lessons.length,
    completed,
    passed: completed === lessons.length,
  };
}

/** Whether the learner may be issued this level right now (docx §21). */
export function eligibility(
  userId: string,
  pathId: string,
  level: CertificateLevel,
): { eligible: boolean; reason: string; progress: number } {
  const path = getPath(pathId);
  if (!path) return { eligible: false, reason: "Unknown learning path.", progress: 0 };

  const completion = pathCompletion(userId, pathId);
  const progress = completion.total === 0 ? 0 : completion.completed / completion.total;

  if (level === "course-graduate") {
    return completion.passed
      ? { eligible: true, reason: `All ${completion.total} lessons passed.`, progress }
      : {
          eligible: false,
          reason: `Finish every lesson quiz in this path first (${completion.completed}/${completion.total} done).`,
          progress,
        };
  }

  // Both higher levels require the course first — no skipping ahead.
  if (!completion.passed) {
    return {
      eligible: false,
      reason: `Complete the course first (${completion.completed}/${completion.total} lessons passed).`,
      progress,
    };
  }

  if (level === "project-creator") {
    const done = new Set(
      all<{ project_slug: string }>(
        `SELECT project_slug FROM project_progress
          WHERE user_id = ? AND completed = 1`,
        userId,
      ).map((p) => p.project_slug),
    );
    const built = [...done].filter((slug) => projectBelongsToPath(slug, pathId));
    return built.length > 0
      ? { eligible: true, reason: `${built.length} project(s) completed.`, progress }
      : {
          eligible: false,
          reason: "Complete at least one guided project from this path first.",
          progress,
        };
  }

  // Independent Builder: an original project in the portfolio, documented.
  const original = all<{ id: string; description: string; github_url: string | null; live_url: string | null }>(
    `SELECT id, description, github_url, live_url
       FROM portfolio_projects
      WHERE user_id = ?`,
    userId,
  );
  const documented = original.filter(
    (p) => p.description.trim().length >= 40 && (p.github_url || p.live_url),
  );
  return documented.length > 0
    ? { eligible: true, reason: `${documented.length} documented project(s) in your portfolio.`, progress }
    : {
        eligible: false,
        reason:
          "Add an original project to your portfolio with a real description and a GitHub or live link.",
        progress,
      };
}

/** Guided projects declare which learning paths they belong to (content data). */
function projectBelongsToPath(projectSlug: string, pathId: string): boolean {
  const project = getGuidedProject(projectSlug);
  return project ? project.paths.includes(pathId) : false;
}

/** A live (non-revoked, not replaced) certificate for this path + level. */
export function findActiveCertificate(
  userId: string,
  pathId: string,
  level: CertificateLevel,
): CertificateRow | undefined {
  return first<CertificateRow>(
    `SELECT * FROM certificates
      WHERE user_id = ? AND path_id = ? AND level = ?
        AND revoked = 0 AND replaced_by IS NULL`,
    userId,
    pathId,
    level,
  );
}

export interface IssueCertificateInput {
  userId: string;
  pathId: string;
  level: CertificateLevel;
  displayName: string;
  template: CertificateTemplate;
  photo: string | null;
  publiclyShared: boolean;
}

/**
 * Issue a certificate. Eligibility is re-checked here on the server — the UI
 * hiding a button is a convenience, not the security boundary.
 */
export function issueCertificate(
  input: IssueCertificateInput,
): { ok: true; certificate: CertificateRow } | { ok: false; error: string } {
  const { userId, pathId, level, displayName, template, photo, publiclyShared } = input;

  const path = getPath(pathId);
  if (!path) return { ok: false, error: "Unknown learning path." };
  if (!isCertificateLevel(level)) return { ok: false, error: "Unknown certificate level." };
  if (!isCertificateTemplate(template)) return { ok: false, error: "Unknown template." };

  const name = displayName.trim();
  if (name.length < 2 || name.length > 60) {
    return { ok: false, error: "Display name must be between 2 and 60 characters." };
  }

  const check = eligibility(userId, pathId, level);
  if (!check.eligible) return { ok: false, error: check.reason };

  const id = generateCertificateId(pathId);
  const now = isoNow();
  run(
    `INSERT INTO certificates
       (id, user_id, path_id, path_name, level, display_name, template,
        photo, revoked, publicly_shared, reissue_of, replaced_by, issued_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, NULL, NULL, ?, ?)`,
    id,
    userId,
    pathId,
    path.title,
    level,
    name,
    template,
    photo,
    publiclyShared ? 1 : 0,
    todayKey(),
    now,
  );

  const certificate = first<CertificateRow>("SELECT * FROM certificates WHERE id = ?", id);
  if (!certificate) return { ok: false, error: "Certificate could not be saved." };
  return { ok: true, certificate };
}

export function listCertificates(userId: string): CertificateRow[] {
  return all<CertificateRow>(
    "SELECT * FROM certificates WHERE user_id = ? ORDER BY created_at DESC",
    userId,
  );
}

export function revokeCertificate(userId: string, id: string): boolean {
  const result = run(
    "UPDATE certificates SET revoked = 1 WHERE id = ? AND user_id = ?",
    id,
    userId,
  );
  return result.changes > 0;
}

export function setCertificateSharing(
  userId: string,
  id: string,
  publiclyShared: boolean,
): boolean {
  const result = run(
    "UPDATE certificates SET publicly_shared = ? WHERE id = ? AND user_id = ?",
    publiclyShared ? 1 : 0,
    id,
    userId,
  );
  return result.changes > 0;
}

/**
 * Reissue keeps history: the old row stays but is marked `replaced_by`, so a
 * replaced certificate can never be presented as current (docx §21.F).
 */
export function reissueCertificate(
  userId: string,
  oldId: string,
  displayName: string,
): { ok: true; certificate: CertificateRow } | { ok: false; error: string } {
  const old = first<CertificateRow>(
    "SELECT * FROM certificates WHERE id = ? AND user_id = ?",
    oldId,
    userId,
  );
  if (!old) return { ok: false, error: "Certificate not found." };

  const issued = issueCertificate({
    userId,
    pathId: old.path_id,
    level: old.level as CertificateLevel,
    displayName,
    template: old.template as CertificateTemplate,
    photo: old.photo,
    publiclyShared: old.publicly_shared === 1,
  });
  if (!issued.ok) return issued;

  run("UPDATE certificates SET reissue_of = ? WHERE id = ?", old.id, issued.certificate.id);
  run("UPDATE certificates SET replaced_by = ? WHERE id = ?", issued.certificate.id, old.id);

  const updated = first<CertificateRow>(
    "SELECT * FROM certificates WHERE id = ?",
    issued.certificate.id,
  );
  return updated ? { ok: true, certificate: updated } : issued;
}

export type VerificationStatus = "valid" | "revoked" | "unknown";

export interface VerificationResult {
  status: VerificationStatus;
  certificate: CertificateRow | null;
  /** Name is only exposed when the student opted into public sharing. */
  publicName: string | null;
}

/**
 * Public verification. Runs without authentication — this is what the QR code
 * hits — so it reveals only certificate status, course, level and issue date,
 * and the student's name only if they chose to share it (docx §21.G).
 */
export function verifyCertificate(id: string): VerificationResult {
  const row = first<CertificateRow>("SELECT * FROM certificates WHERE id = ?", id);
  if (!row) return { status: "unknown", certificate: null, publicName: null };

  if (row.revoked === 1 || row.replaced_by) {
    return { status: "revoked", certificate: row, publicName: null };
  }
  if (!isCertificateIdWellFormed(id, row.path_id)) {
    return { status: "unknown", certificate: null, publicName: null };
  }
  return {
    status: "valid",
    certificate: row,
    publicName: row.publicly_shared === 1 ? row.display_name : null,
  };
}

/** Copy-paste announcement built from a real achievement, never invented. */
export function linkedInAnnouncement(certificate: CertificateRow, verifyUrl: string): string {
  return [
    `I earned the "${LEVEL_LABELS[certificate.level as CertificateLevel]}" certificate for ${certificate.path_name} on BuilderVerse. 🎓`,
    "",
    "Every lesson finished, every bug diagnosed and every challenge attempted along the way. Free to learn, open to everyone.",
    "",
    `Verify: ${verifyUrl}`,
    "",
    "#BuilderVerse #LearnToCode #CodingJourney",
  ].join("\n");
}
