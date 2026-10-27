import { hasEnquiryAccess, issueEnquiryAccess, requireAdmin, revokeEnquiryAccess } from "@/lib/server/auth";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return Response.json({ unlocked: await hasEnquiryAccess() });
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const code = process.env.ENQUIRY_ACCESS_CODE;
  if (!code) return Response.json({ error: "The access code isn't configured on the server." }, { status: 500 });

  const body = await request.json().catch(() => ({}));
  if (String(body?.code ?? "") !== code) {
    await new Promise((r) => setTimeout(r, 400));
    return Response.json({ error: "Incorrect code" }, { status: 401 });
  }
  await issueEnquiryAccess();
  return Response.json({ ok: true });
}

export async function DELETE() {
  await revokeEnquiryAccess();
  return Response.json({ ok: true });
}
