import { collections } from "@/lib/cms/collections";
import { requireAdmin } from "@/lib/server/auth";
import { modelFor } from "@/lib/server/cms";
import { connectDB } from "@/lib/server/db";
import { Enquiry } from "@/lib/server/enquiry-model";

// Counts for the dashboard. Enquiry counts need no access code; the details do.
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  await connectDB();

  const [counts, newEnquiries, weekEnquiries] = await Promise.all([
    Promise.all(
      collections.map(async (c) => {
        const model = modelFor(c);
        const [total, published] = await Promise.all([model.countDocuments({}), model.countDocuments({ status: "published" })]);
        return { key: c.key, total, published };
      }),
    ),
    Enquiry.countDocuments({ status: "new" }),
    Enquiry.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 864e5) } }),
  ]);

  return Response.json({ counts, enquiries: { new: newEnquiries, week: weekEnquiries } });
}
