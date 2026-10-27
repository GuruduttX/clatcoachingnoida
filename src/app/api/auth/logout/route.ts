import { clearAdminSession } from "@/lib/server/auth";

export async function POST() {
  await clearAdminSession();
  return Response.json({ ok: true });
}
