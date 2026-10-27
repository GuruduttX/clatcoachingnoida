/**
 * Copies shared content from the LPT Delhi database into this site's database.
 * Both live on the same cluster, so the source is reached by database name.
 *
 *   node --env-file=.env scripts/copy-from-lpt.mjs              # reviews only
 *   node --env-file=.env scripts/copy-from-lpt.mjs --dry-run    # show what would happen
 *   node --env-file=.env scripts/copy-from-lpt.mjs --with nlu-profiles,study-plans
 *
 * Reviews keep their status, since the same reviews appear on both sites.
 * Anything else is copied as a draft, so nothing goes live on this site
 * until someone reviews and rewrites it in the admin (avoids duplicate content).
 *
 * Safe to re-run: entries that already exist here are skipped, never overwritten.
 */

import mongoose from "mongoose";

const SOURCE_DB = process.env.LPT_SOURCE_DB || "LPT_DELHI";

const COLLECTIONS = {
  reviews: { name: "reviews", key: (d) => ({ studentName: d.studentName, centre: d.centre, program: d.program ?? null }), keepStatus: true },
  "nlu-profiles": { name: "universities", key: (d) => ({ slug: d.slug }) },
  "study-plans": { name: "studyplans", key: (d) => ({ slug: d.slug }) },
  "toppers-strategy": { name: "topperstrategies", key: (d) => ({ slug: d.slug }) },
  "current-affairs": { name: "currentaffairs", key: (d) => ({ slug: d.slug }) },
  blogs: { name: "blogs", key: (d) => ({ slug: d.slug }) },
};

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const withIndex = args.indexOf("--with");
const extra = withIndex >= 0 ? (args[withIndex + 1] ?? "").split(",").filter(Boolean) : [];
const selected = ["reviews", ...extra];

for (const key of selected) {
  if (!COLLECTIONS[key]) {
    console.error(`Unknown collection "${key}". Choose from: ${Object.keys(COLLECTIONS).join(", ")}`);
    process.exit(1);
  }
}

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is missing. Run with: node --env-file=.env scripts/copy-from-lpt.mjs");
  process.exit(1);
}

const conn = await mongoose.createConnection(process.env.MONGODB_URI).asPromise();
const target = conn.db;
const source = conn.useDb(SOURCE_DB).db;

if (target.databaseName === source.databaseName) {
  console.error(`Source and target are both "${target.databaseName}". Check MONGODB_URI.`);
  process.exit(1);
}

console.log(`${dryRun ? "[dry run] " : ""}Copying ${selected.join(", ")} from ${source.databaseName} → ${target.databaseName}\n`);

for (const key of selected) {
  const { name, key: identify, keepStatus } = COLLECTIONS[key];
  const docs = await source.collection(name).find({}).toArray();
  let created = 0;
  let skipped = 0;

  for (const doc of docs) {
    if (await target.collection(name).findOne(identify(doc))) {
      skipped += 1;
      continue;
    }
    // Fresh _id and no mongoose version key; everything else is copied as-is.
    const rest = { ...doc };
    delete rest._id;
    delete rest.__v;
    const copy = { ...rest, ...(keepStatus ? {} : { status: "draft" }), createdAt: doc.createdAt ?? new Date(), updatedAt: new Date() };
    if (!dryRun) await target.collection(name).insertOne(copy);
    created += 1;
  }
  console.log(`${key.padEnd(18)} ${created} copied, ${skipped} already here (${docs.length} in source)`);
}

await conn.close();
console.log(dryRun ? "\nNothing was written." : "\nDone. Open /admin to review.");
