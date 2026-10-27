import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ArticleHeader,
  ArticleShell,
  Body,
  Byline,
  CounsellorCard,
  FactTiles,
  FaqBlock,
  QuickAnswer,
  RelatedLinks,
  Sources,
  Tags,
  Takeaways,
} from "@/components/content/article-screen";
import { articleJsonLd, faqs, formatDate, list, num, rows, str } from "@/components/content/doc";
import { ArticleSkeleton } from "@/components/content/skeletons";
import { getPublished, listPublished } from "@/lib/server/content";
import { site } from "@/lib/site";

type Params = PageProps<"/resources/current-affairs/[slug]">["params"];

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getPublished("current-affairs", slug);
  if (!doc) return { title: "Story not found" };
  const image = str(doc, "heroImage.url");
  return {
    title: str(doc, "metaTitle") ? { absolute: str(doc, "metaTitle") } : str(doc, "title"),
    description: str(doc, "metaDescription") || str(doc, "summary"),
    alternates: { canonical: `/resources/current-affairs/${slug}` },
    openGraph: { type: "article", title: str(doc, "title"), images: image ? [image] : undefined },
  };
}

export default function CurrentAffairPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <CurrentAffair params={params} />
    </Suspense>
  );
}

async function CurrentAffair({ params }: { params: Params }) {
  const { slug } = await params;
  const doc = await getPublished("current-affairs", slug);
  if (!doc) notFound();

  const title = str(doc, "title");
  const category = str(doc, "category");
  const relatedSlugs = list(doc, "relatedSlugs");
  const others = (await listPublished("current-affairs", { select: "title slug category eventDate" })).filter((d) => d.slug !== slug);
  const related = [
    ...others.filter((d) => relatedSlugs.includes(String(d.slug))),
    ...others.filter((d) => !relatedSlugs.includes(String(d.slug)) && str(d, "category") === category),
  ].slice(0, 4);

  return (
    <ArticleShell
      jsonLdData={[
        articleJsonLd({
          headline: title,
          description: str(doc, "summary"),
          image: str(doc, "heroImage.url"),
          datePublished: str(doc, "publishedAt") || str(doc, "eventDate"),
          dateModified: str(doc, "updatedAt").slice(0, 10),
          author: str(doc, "author.name"),
          url: `${site.url}/resources/current-affairs/${slug}`,
        }),
      ]}
    >
      <ArticleHeader
        back={{ href: "/resources/current-affairs", label: "Current affairs" }}
        eyebrow={category || "Current affairs"}
        title={title}
        chips={[formatDate(str(doc, "eventDate")), ...list(doc, "examRelevance").map((e) => `For ${e}`)]}
        image={str(doc, "heroImage.url")}
        alt={str(doc, "heroImage.alt")}
      />
      <Byline author={str(doc, "author.name")} readTime={num(doc, "readTime")} />
      <QuickAnswer label="In two lines" text={str(doc, "summary")} />
      <FactTiles title="Key facts" rows={rows(doc, "keyFacts", ["label", "value"] as const)} />
      <Takeaways title="Why it matters for CLAT" items={list(doc, "keyTakeaways")} />
      <Body title="The full story" html={str(doc, "content")} />
      <Sources items={rows(doc, "sources", ["label", "url"] as const)} />
      <FaqBlock items={faqs(doc)} title="Quick revision" />
      <Tags items={list(doc, "tags")} />
      <RelatedLinks
        title="Related stories"
        items={related.map((d) => ({
          href: `/resources/current-affairs/${d.slug}`,
          label: str(d, "title"),
          note: [str(d, "category"), formatDate(str(d, "eventDate"))].filter(Boolean).join(" · "),
        }))}
      />
      <CounsellorCard title="Want GK covered every week?" />
    </ArticleShell>
  );
}
