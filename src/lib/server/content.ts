import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getCollection } from "@/lib/cms/collections";
import type { CollectionKey } from "@/lib/cms/fields";
import { connectDB } from "./db";
import { modelFor, plain } from "./cms";

// Public reads. Each result is cached until an admin write to the same
// collection calls revalidateTag(key), so pages stay static between edits.

export type Doc = Record<string, unknown> & { _id: string; slug?: string; status?: string; updatedAt?: string; createdAt?: string };

type ListOptions = {
  filter?: Record<string, string | number | boolean>;
  limit?: number;
  /** Projection; list views skip the heavy `content` field by default. */
  select?: string;
};

export async function listPublished(key: CollectionKey, { filter = {}, limit = 200, select = "-content" }: ListOptions = {}) {
  "use cache";
  cacheLife("max");
  cacheTag(key);

  const config = getCollection(key);
  if (!config) return [];
  try {
    await connectDB();
    const docs = await modelFor(config)
      .find({ ...filter, status: "published" })
      .select(select)
      .sort(config.sort)
      .limit(limit)
      .lean();
    return plain<Doc[]>(docs);
  } catch (error) {
    // A database outage should degrade to an empty list, not a crashed page.
    console.error(`[content] Failed to list ${key}:`, error);
    return [];
  }
}

export async function getPublished(key: CollectionKey, slug: string) {
  "use cache";
  cacheLife("max");
  cacheTag(key);

  const config = getCollection(key);
  if (!config) return null;
  try {
    await connectDB();
    const doc = await modelFor(config).findOne({ slug, status: "published" }).lean();
    return doc ? plain<Doc>(doc) : null;
  } catch (error) {
    console.error(`[content] Failed to load ${key}/${slug}:`, error);
    return null;
  }
}

export async function countPublished(key: CollectionKey) {
  "use cache";
  cacheLife("max");
  cacheTag(key);

  const config = getCollection(key);
  if (!config) return 0;
  try {
    await connectDB();
    return await modelFor(config).countDocuments({ status: "published" });
  } catch {
    return 0;
  }
}

/** Published batches that haven't started yet (undated ones included). Refreshes daily as dates pass. */
export async function listUpcomingBatches() {
  "use cache";
  cacheLife("days");
  cacheTag("batches");

  // Today in India, as yyyy-mm-dd, to compare with stored start dates.
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const batches = await listPublished("batches");
  return batches.filter((b) => typeof b.startDate !== "string" || !b.startDate || b.startDate >= today);
}
