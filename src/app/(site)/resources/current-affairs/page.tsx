import type { Metadata } from "next";
import { CardExplorer, type ExplorerItem } from "@/components/content/card-explorer";
import { formatDate, monthLabel, str } from "@/components/content/doc";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { CURRENT_AFFAIRS_CATEGORIES } from "@/lib/cms/taxonomy";
import { listPublished } from "@/lib/server/content";

export const metadata: Metadata = {
  title: "Current affairs for CLAT",
  description: "Exam-focused current affairs for CLAT and AILET: the news, the key facts and why it matters, in a two-minute read.",
  alternates: { canonical: "/resources/current-affairs" },
};

export default async function CurrentAffairsPage() {
  const docs = await listPublished("current-affairs", {
    select: "title slug category eventDate heroImage readTime",
  });
  const items: ExplorerItem[] = docs.map((d) => ({
    href: `/resources/current-affairs/${d.slug}`,
    title: str(d, "title"),
    eyebrow: str(d, "category") || undefined,
    meta: formatDate(str(d, "eventDate")),
    image: str(d, "heroImage.url") || undefined,
    alt: str(d, "heroImage.alt"),
    group: str(d, "category"),
    section: monthLabel(str(d, "eventDate")),
  }));

  return (
    <>
      <PageHeader eyebrow="Current affairs" title="The news, minus the noise.">
        What happened, the facts to remember, and why it could show up in CLAT.
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 pb-14 md:px-6 md:pb-28">
        {items.length > 0 ? (
          <CardExplorer items={items} order={CURRENT_AFFAIRS_CATEGORIES} filterLabel="Filter by category" tone="sun" />
        ) : (
          <EmptyState title="No stories yet">Current affairs updates will appear here as the team publishes them.</EmptyState>
        )}
      </div>
    </>
  );
}
