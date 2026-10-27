import { adminCredentials, issueAdminSession } from "@/lib/server/auth";

export async function POST(request: Request) {
  const creds = adminCredentials();
  if (!creds) return Response.json({ error: "Admin sign-in isn't configured on the server." }, { status: 500 });

  const body = await request.json().catch(() => ({}));
  // Same response and a small delay for any mismatch, so the endpoint doesn't leak which part was wrong.
  if (body?.email !== creds.email || body?.password !== creds.password) {
    await new Promise((r) => setTimeout(r, 400));
    return Response.json({ error: "Email or password is incorrect" }, { status: 401 });
  }

  await issueAdminSession(creds.email);
  return Response.json({ ok: true });
}
