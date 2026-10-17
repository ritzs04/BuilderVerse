/**
 * GET /api/certificates/verify?id=BV-YYYY-XXXXXX-C
 *
 * Public certificate verification endpoint. Anyone can call this with
 * a certificate ID to check its validity — this is what the QR code
 * on the certificate links to.
 *
 * Returns ONLY approved, non-sensitive information:
 *   - Validity status (valid | revoked | unknown)
 *   - Certificate ID
 *   - Course name and achievement level
 *   - Issue date
 *   - Display name — ONLY if the student opted into public sharing
 *
 * Never exposes: email, user ID, private project details, or the photo.
 *
 * Returns:
 *   200 { ok: true, status: "valid"|"revoked", certificate: {...} }
 *   200 { ok: true, status: "unknown" }
 *   400 { ok: false, error: "Certificate ID required" }
 */

import { getServerSupabase } from "../../shared/supabaseServer";

// Validate the ID format (BV-YYYY-XXXXXX-C) and checksum.
function isCertificateIdWellFormed(id: string): boolean {
  const parts = id.split("-");
  if (parts.length !== 4 || parts[0] !== "BV") return false;
  const [, year, segment, check] = parts;
  if (!/^\d{4}$/.test(year) || segment.length !== 6) return false;

  // Verify checksum
  const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const text = `${year}-${segment}-builderverse`;
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  const abs = Math.abs(hash);
  const expected = String(abs % 36).padStart(1, "0") + ALPHABET[abs % ALPHABET.length];
  return check === expected;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return res
      .status(500)
      .json({ ok: false, error: "Database not configured" });
  }

  const id = (req.query?.id || "").toString().trim();

  if (!id) {
    return res
      .status(400)
      .json({ ok: false, error: "Certificate ID required" });
  }

  // Quick format check before hitting the DB
  if (!isCertificateIdWellFormed(id)) {
    return res.status(200).json({ ok: true, status: "unknown" });
  }

  try {
    const { data, error } = await supabase
      .from("certificates")
      .select(
        "id, display_name, course_name, level, issued_at, revoked, publicly_shared, replaced_by"
      )
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return res.status(200).json({ ok: true, status: "unknown" });
    }

    // A certificate replaced by a reissue is no longer current.
    if (data.revoked || data.replaced_by) {
      return res.status(200).json({
        ok: true,
        status: "revoked",
        certificate: {
          id: data.id,
          courseName: data.course_name,
          level: data.level,
          issuedAt: data.issued_at?.slice(0, 10),
          displayName: data.publicly_shared ? data.display_name : undefined,
        },
      });
    }

    return res.status(200).json({
      ok: true,
      status: "valid",
      certificate: {
        id: data.id,
        courseName: data.course_name,
        level: data.level,
        issuedAt: data.issued_at?.slice(0, 10),
        // Only show the student's name if they opted into public sharing.
        displayName: data.publicly_shared ? data.display_name : undefined,
      },
    });
  } catch {
    return res.status(500).json({
      ok: false,
      error: "Verification temporarily unavailable",
    });
  }
}
