import { requireEnquiryAccess } from "@/lib/server/auth";
import { plain } from "@/lib/server/cms";
import { connectDB } from "@/lib/server/db";
import { Enquiry } from "@/lib/server/enquiry-model";

export async function GET() {
  const denied = await requireEnquiryAccess();
  if (denied) return denied;
  await connectDB();
  const enquiries = await Enquiry.find({}).sort({ createdAt: -1 }).limit(500).lean();
  return Response.json({ enquiries: plain(enquiries) });
}
