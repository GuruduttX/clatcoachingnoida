import { isValidObjectId } from "mongoose";
import { ENQUIRY_STATUSES } from "@/lib/cms/enquiries";
import { requireEnquiryAccess } from "@/lib/server/auth";
import { plain } from "@/lib/server/cms";
import { connectDB } from "@/lib/server/db";
import { Enquiry } from "@/lib/server/enquiry-model";

export async function PATCH(request: Request, ctx: RouteContext<"/api/admin/enquiries/[id]">) {
  const denied = await requireEnquiryAccess();
  if (denied) return denied;
  const { id } = await ctx.params;
  if (!isValidObjectId(id)) return Response.json({ error: "Not found" }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const update: Record<string, string> = {};
  if ((ENQUIRY_STATUSES as readonly string[]).includes(body?.status)) update.status = body.status;
  if (typeof body?.notes === "string") update.notes = body.notes.slice(0, 2000);

  await connectDB();
  const enquiry = await Enquiry.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true }).lean();
  if (!enquiry) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ enquiry: plain(enquiry) });
}
