import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/server/auth";
import { duplicateKeyMessage, normalize, plain, resolveCollection } from "@/lib/server/cms";
import { connectDB } from "@/lib/server/db";

// Admin list (drafts included) and create.

export async function GET(request: Request, ctx: RouteContext<"/api/admin/cms/[collection]">) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const resolved = resolveCollection((await ctx.params).collection);
  if (!resolved) return Response.json({ error: "Unknown collection" }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  await connectDB();
  const docs = await resolved.model
    .find(status === "draft" || status === "published" ? { status } : {})
    .select("-content")
    .sort({ updatedAt: -1 })
    .limit(1000)
    .lean();
  return Response.json({ docs: plain(docs) });
}

export async function POST(request: Request, ctx: RouteContext<"/api/admin/cms/[collection]">) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { collection } = await ctx.params;
  const resolved = resolveCollection(collection);
  if (!resolved) return Response.json({ error: "Unknown collection" }, { status: 404 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return Response.json({ error: "Invalid body" }, { status: 400 });

  const { doc, errors } = normalize(resolved.config, body);
  if (Object.keys(errors).length) return Response.json({ error: "Some fields need attention", errors }, { status: 422 });

  try {
    await connectDB();
    const created = await resolved.model.create(doc);
    revalidateTag(collection, { expire: 0 });
    return Response.json({ doc: plain(created.toObject()) }, { status: 201 });
  } catch (error) {
    const message = duplicateKeyMessage(error);
    if (message) return Response.json({ error: message, errors: { slug: message } }, { status: 409 });
    console.error(`[cms] create ${collection} failed:`, error);
    return Response.json({ error: "Couldn't save. Try again." }, { status: 500 });
  }
}

