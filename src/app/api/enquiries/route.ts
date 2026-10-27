import { after } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Enquiry } from "@/lib/server/enquiry-model";
import { sendEnquiryNotification } from "@/lib/server/enquiry-email";
import { hashClientIp, isRateLimited, validateEnquiry } from "@/lib/server/enquiry-guard";

// Public enquiry form endpoint.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return Response.json({ error: "Invalid request" }, { status: 400 });

  const result = validateEnquiry(body);
  if (!result.ok) {
    // Bots get a fake success so they have nothing to adapt to.
    if (result.silent) return Response.json({ ok: true }, { status: 201 });
    return Response.json({ error: result.reason }, { status: 400 });
  }

  try {
    await connectDB();
    const ipHash = hashClientIp(request);
    // A blocked repeat is usually an impatient double tap, so it still reads as success.
    if (await isRateLimited(ipHash, result.data.phone)) return Response.json({ ok: true }, { status: 201 });

    const enquiry = await Enquiry.create({ ...result.data, ipHash, status: "new" });
    after(() => sendEnquiryNotification({ ...result.data, _id: enquiry._id, createdAt: enquiry.createdAt }));
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[enquiries] Save failed:", error);
    return Response.json({ error: "Something went wrong. Please call or WhatsApp us instead." }, { status: 500 });
  }
}
