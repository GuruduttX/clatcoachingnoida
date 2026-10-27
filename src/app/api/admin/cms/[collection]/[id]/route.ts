import { revalidateTag } from "next/cache";
import { isValidObjectId } from "mongoose";
import { requireAdmin } from "@/lib/server/auth";
import { duplicateKeyMessage, normalize, plain, resolveCollection } from "@/lib/server/cms";
import { connectDB } from "@/lib/server/db";

type Ctx = RouteContext<"/api/admin/cms/[collection]/[id]">;

async function resolve(ctx: Ctx) {
  const { collection, id } = await ctx.params;
  const resolved = resolveCollection(collection);
  if (!resolved || !isValidObjectId(id)) return null;
  return { ...resolved, id, collection };
}

export async function GET(_request: Request, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const r = await resolve(ctx);
  if (!r) return Response.json({ error: "Not found" }, { status: 404 });

  await connectDB();
  const doc = await r.model.findById(r.id).lean();
  if (!doc) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ doc: plain(doc) });
}

export async function PUT(request: Request, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const r = await resolve(ctx);
  if (!r) return Response.json({ error: "Not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return Response.json({ error: "Invalid body" }, { status: 400 });

  try {
    await connectDB();
    const existing = await r.model.findById(r.id);
    if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

    const { doc, errors } = normalize(r.config, body, existing.toObject());
    if (Object.keys(errors).length) return Response.json({ error: "Some fields need attention", errors }, { status: 422 });

    existing.set(doc);
    await existing.save();
    revalidateTag(r.collection, { expire: 0 });
    return Response.json({ doc: plain(existing.toObject()) });
  } catch (error) {
    const message = duplicateKeyMessage(error);
    if (message) return Response.json({ error: message, errors: { slug: message } }, { status: 409 });
    console.error(`[cms] update ${r.collection}/${r.id} failed:`, error);
    return Response.json({ error: "Couldn't save. Try again." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const r = await resolve(ctx);
  if (!r) return Response.json({ error: "Not found" }, { status: 404 });

  await connectDB();
  await r.model.findByIdAndDelete(r.id);
  revalidateTag(r.collection, { expire: 0 });
  return Response.json({ ok: true });
}
