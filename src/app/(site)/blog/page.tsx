import type { Metadata } from "next";
import { CardExplorer, type ExplorerItem } from "@/components/content/card-explorer";
import { formatDate, num, str } from "@/components/content/doc";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { BLOG_CATEGORIES } from "@/lib/cms/taxonomy";
import { listPublished } from "@/lib/server/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Short, exam-focused reads on CLAT and AILET preparation from LawPrep Tutorial's Noida faculty.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const docs = await listPublished("blogs", { select: "title slug category image alt readTime publishedAt" });
  const items: ExplorerItem[] = docs.map((d) => ({
    href: `/blog/${d.slug}`,
    title: str(d, "title"),
    eyebrow: str(d, "category") || undefined,
    meta: formatDate(str(d, "publishedAt")),
    image: str(d, "image") || undefined,
    alt: str(d, "alt"),
    readTime: num(d, "readTime"),
    group: str(d, "category"),
  }));

  return (
    <>
      <PageHeader eyebrow="Blog" title="Read less. Score more.">
        Short, exam-focused reads from the people who teach at Noida.
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 pb-14 md:px-6 md:pb-28">
        {items.length > 0 ? (
          <CardExplorer items={items} order={BLOG_CATEGORIES} filterLabel="Filter by topic" />
        ) : (
          <EmptyState title="First posts are on the way">New articles will show up here as soon as they&apos;re published.</EmptyState>
        )}
      </div>
    </>
  );
}
