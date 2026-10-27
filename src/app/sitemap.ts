import type { MetadataRoute } from "next";
import type { CollectionKey } from "@/lib/cms/fields";
import { listPublished } from "@/lib/server/content";
import { destinations, site } from "@/lib/site";

// Path for each published entry in a content collection.
const contentRoutes: { key: CollectionKey; path: (doc: { slug?: string; category?: unknown }) => string | null }[] = [
  { key: "blogs", path: (d) => `/blog/${d.slug}` },
  { key: "current-affairs", path: (d) => `/resources/current-affairs/${d.slug}` },
  { key: "study-plans", path: (d) => `/resources/study-plan/${d.slug}` },
  { key: "toppers-strategy", path: (d) => `/resources/toppers-strategy/${d.slug}` },
  { key: "nlu-profiles", path: (d) => `/resources/nlu-profiles/${d.slug}` },
  { key: "faqs", path: (d) => (d.category ? `/faq/${d.category}` : null) },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["/", ...destinations.flatMap((g) => g.items.map((i) => i.href))];
  const entries = new Map<string, MetadataRoute.Sitemap[number]>();

  for (const path of staticPaths) {
    entries.set(path, { url: `${site.url}${path === "/" ? "" : path}`, priority: path === "/" ? 1 : 0.7 });
  }

  const lists = await Promise.all(contentRoutes.map((r) => listPublished(r.key, { select: "slug updatedAt category", limit: 5000 })));
  contentRoutes.forEach((route, i) => {
    for (const doc of lists[i]) {
      const path = route.path(doc);
      if (!path) continue;
      const lastModified = doc.updatedAt;
      const existing = entries.get(path);
      // FAQ categories share a URL; keep the newest edit.
      if (existing && existing.lastModified && lastModified && String(existing.lastModified) >= lastModified) continue;
      entries.set(path, { url: `${site.url}${path}`, lastModified, priority: 0.6 });
    }
  });

  return [...entries.values()];
}
