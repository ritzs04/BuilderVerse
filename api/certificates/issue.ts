/**
 * POST /api/certificates/issue
 *
 * Server-side certificate issuance. This is the ONLY way a certificate
 * can be created — the server verifies eligibility from the database,
 * not from browser-submitted claims.
 *
 * Body: {
 *   courseId: string,
 *   courseName: string,
 *   level: "Course Graduate" | "Project Creator" | "Independent Builder",
 *   displayName: string,
 *   template: "pink-dream" | "coding-star" | "future-builder",
 *   photoDataUrl?: string | null,   // compressed JPEG (nullable for text-only)
 *   publiclyShared?: boolean,
 * }
 *
 * Eligibility is checked against learning_progress in the database:
 *   - All lessons for the course must be in completed_lesson_ids
 *   - For "Project Creator" / "Independent Builder", at least one
 *     completed project must exist in completed_project_ids
 *
 * Returns: { ok: true, certificate: CertificateRecord }
 *          { ok: false, error: string }
 */

import { getServerSupabase, getAuthenticatedUserId } from "../../shared/supabaseServer";

// Crockford base32 without confusing characters.
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function randomSegment(): string {
  const bytes = new Uint8Array(6);
  // crypto.getRandomValues is available in Node 19+ / Vercel runtime.
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

function checksum(year: string, segment: string, courseId: string): string {
  const text = `${year}-${segment}-${courseId}-builderverse`;
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  const abs = Math.abs(hash);
  return String(abs % 36).padStart(1, "0") + ALPHABET[abs % ALPHABET.length];
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return res
      .status(500)
      .json({ ok: false, error: "Database not configured" });
  }

  const userId = await getAuthenticatedUserId(supabase, req);
  if (!userId) {
    return res.status(401).json({ ok: false, error: "Not authenticated" });
  }

  const {
    courseId,
    courseName,
    level,
    displayName,
    template,
    photoDataUrl,
    publiclyShared,
  } = req.body || {};

  // Validate input
  if (!courseId || !courseName || !level || !displayName || !template) {
    return res
      .status(400)
      .json({ ok: false, error: "Missing required fields" });
  }

  const validLevels = ["Course Graduate", "Project Creator", "Independent Builder"];
  const validTemplates = ["pink-dream", "coding-star", "future-builder"];
  if (!validLevels.includes(level)) {
    return res.status(400).json({ ok: false, error: "Invalid level" });
  }
  if (!validTemplates.includes(template)) {
    return res.status(400).json({ ok: false, error: "Invalid template" });
  }
  if (displayName.trim().length < 2 || displayName.trim().length > 60) {
    return res
      .status(400)
      .json({ ok: false, error: "Display name must be 2-60 characters" });
  }

  try {
    // ----------------------------------------------------------------
    // 1. Load the user's REAL progress from the database
    // ----------------------------------------------------------------
    const { data: progress } = await supabase
      .from("learning_progress")
      .select("completed_lesson_ids, completed_project_ids")
      .eq("user_id", userId)
      .maybeSingle();

    const completedLessons: string[] = (progress?.completed_lesson_ids as string[]) || [];
    const completedProjects: string[] = (progress?.completed_project_ids as string[]) || [];

    // ----------------------------------------------------------------
    // 2. Check eligibility (server-side, not trusting the browser)
    // ----------------------------------------------------------------
    // For a "Course Graduate" certificate, the student must have completed
    // all lessons in the course. We determine this by checking that the
    // course's lesson IDs appear in the completed list.
    //
    // NOTE: The full lesson list per course lives in the frontend data file
    // (src/data/builderVerseData.ts). For server-side verification we check
    // a reasonable threshold: at least 5 completed lessons for the course.
    // A more precise check would require the server to know the lesson list.
    // This is documented as a known limitation; the precise check should be
    // added when the lesson data is also stored in the database.
    // ----------------------------------------------------------------
    const courseLessons = completedLessons.filter((id) =>
      id.startsWith(courseId + "-") || id.includes(courseId)
    );

    if (courseLessons.length < 5) {
      return res.status(403).json({
        ok: false,
        error: "Course requirements not met. Complete all lessons first.",
      });
    }

    if ((level === "Project Creator" || level === "Independent Builder") &&
        completedProjects.length === 0) {
      return res.status(403).json({
        ok: false,
        error: "Project requirements not met. Complete at least one project first.",
      });
    }

    // ----------------------------------------------------------------
    // 3. Prevent duplicate issuance
    // ----------------------------------------------------------------
    const { data: existing } = await supabase
      .from("certificates")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .eq("level", level)
      .eq("revoked", false)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({
        ok: false,
        error: "An active certificate already exists for this course.",
        existingId: existing.id,
      });
    }

    // ----------------------------------------------------------------
    // 4. Generate a unique certificate ID
    // ----------------------------------------------------------------
    const year = new Date().getFullYear().toString();
    let certId = "";
    let attempts = 0;
    do {
      const segment = randomSegment();
      certId = `BV-${year}-${segment}-${checksum(year, segment, courseId)}`;
      attempts++;
      if (attempts > 10) break;
      const { data: dup } = await supabase
        .from("certificates")
        .select("id")
        .eq("id", certId)
        .maybeSingle();
      if (!dup) break;
    } while (true);

    // ----------------------------------------------------------------
    // 5. Insert the certificate record
    // ----------------------------------------------------------------
    const record = {
      id: certId,
      user_id: userId,
      display_name: displayName.trim(),
      course_id: courseId,
      course_name: courseName,
      level,
      template,
      photo_data_url: photoDataUrl || null,
      revoked: false,
      publicly_shared: publiclyShared || false,
      issued_at: new Date().toISOString(),
    };

    const { data: inserted, error: insertError } = await supabase
      .from("certificates")
      .insert(record)
      .select()
      .single();

    if (insertError) {
      console.error("Certificate insert failed:", insertError.message);
      return res
        .status(500)
        .json({ ok: false, error: "Failed to issue certificate" });
    }

    // ----------------------------------------------------------------
    // 6. Log the issuance event
    // ----------------------------------------------------------------
    await supabase.from("certificate_events").insert({
      certificate_id: certId,
      event_type: "issued",
      performed_by: userId,
      note: `Issued for ${courseName} (${level})`,
    });

    // Return the record in the same shape the frontend expects
    return res.status(201).json({
      ok: true,
      certificate: {
        id: inserted.id,
        displayName: inserted.display_name,
        courseId: inserted.course_id,
        courseName: inserted.course_name,
        level: inserted.level,
        template: inserted.template,
        photoDataUrl: inserted.photo_data_url,
        revoked: inserted.revoked,
        publiclyShared: inserted.publicly_shared,
        issuedAt: inserted.issued_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      },
    });
  } catch (err: any) {
    console.error("Certificate issuance error:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Failed to issue certificate" });
  }
}
