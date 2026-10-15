import { createClient } from "@supabase/supabase-js";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      ok: false,
      error: "Method not allowed",
    });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({
      ok: false,
      error: "Database configuration is missing",
    });
  }

  try {
    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );

    const { data, error } = await supabase
      .from("backend_health_checks")
      .select("id")
      .eq("id", true)
      .maybeSingle();

    if (error || !data) {
      console.error(
        "BuilderVerse database health check failed:",
        error?.message ?? "Health-check row missing"
      );

      return res.status(503).json({
        ok: false,
        error: "Database health check failed",
      });
    }

    return res.status(200).json({
      ok: true,
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    return res.status(503).json({
      ok: false,
      error: "Database temporarily unavailable",
    });
  }
}
