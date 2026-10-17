/**
 * POST /api/certificates/revoke
 *
 * Revokes a certificate. Only the certificate owner can revoke their own
 * certificate. The server verifies ownership before updating.
 *
 * Body: { certificateId: string }
 *
 * Returns:
 *   200 { ok: true }
 *   401 { ok: false, error: "Not authenticated" }
 *   403 { ok: false, error: "You can only revoke your own certificates" }
 *   404 { ok: false, error: "Certificate not found" }
 */

import { getServerSupabase, getAuthenticatedUserId } from "../../shared/supabaseServer";

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

  const { certificateId } = req.body || {};

  if (!certificateId) {
    return res
      .status(400)
      .json({ ok: false, error: "Certificate ID required" });
  }

  try {
    // Verify ownership before revoking
    const { data: cert } = await supabase
      .from("certificates")
      .select("id, user_id")
      .eq("id", certificateId)
      .maybeSingle();

    if (!cert) {
      return res
        .status(404)
        .json({ ok: false, error: "Certificate not found" });
    }

    if (cert.user_id !== userId) {
      return res
        .status(403)
        .json({ ok: false, error: "You can only revoke your own certificates" });
    }

    // Revoke
    const { error } = await supabase
      .from("certificates")
      .update({ revoked: true, updated_at: new Date().toISOString() })
      .eq("id", certificateId);

    if (error) {
      return res
        .status(500)
        .json({ ok: false, error: "Failed to revoke certificate" });
    }

    // Log the event
    await supabase.from("certificate_events").insert({
      certificate_id: certificateId,
      event_type: "revoked",
      performed_by: userId,
      note: "Revoked by certificate owner",
    });

    return res.status(200).json({ ok: true });
  } catch {
    return res
      .status(500)
      .json({ ok: false, error: "Failed to revoke certificate" });
  }
}
