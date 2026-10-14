import { first } from "@/lib/db";

/**
 * Container health endpoint: returns 200 only when the process is up
 * *and* SQLite is reachable. Used by the Docker HEALTHCHECK.
 */
export async function GET(): Promise<Response> {
  try {
    first<{ ok: number }>("SELECT 1 AS ok");
    return Response.json({ status: "ok" });
  } catch {
    return Response.json({ status: "db-unavailable" }, { status: 503 });
  }
}
