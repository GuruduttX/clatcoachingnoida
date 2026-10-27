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
  Takeaways,
} from "@/components/content/article-screen";
import { articleJsonLd, faqs, list, num, rows, str } from "@/components/content/doc";
import { ArticleSkeleton } from "@/components/content/skeletons";
import { findTopper } from "@/lib/data";
import { getPublished, listPublished } from "@/lib/server/content";
import { site } from "@/lib/site";

type Params = PageProps<"/resources/toppers-strategy/[slug]">["params"];

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getPublished("toppers-strategy", slug);
  if (!doc) return { title: "Strategy not found" };
  const topper = findTopper(str(doc, "studentSlug"));
  return {
    title: str(doc, "metaTitle") ? { absolute: str(doc, "metaTitle") } : str(doc, "title"),
    description: str(doc, "metaDescription") || str(doc, "quickAnswer"),
    alternates: { canonical: `/resources/toppers-strategy/${slug}` },
    openGraph: { type: "article", images: topper ? [topper.photo] : undefined },
  };
}

export default function TopperStrategyPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <TopperStrategy params={params} />
    </Suspense>
  );
}

async function TopperStrategy({ params }: { params: Params }) {
  const { slug } = await params;
  const doc = await getPublished("toppers-strategy", slug);
  if (!doc) notFound();

  const topper = findTopper(str(doc, "studentSlug"));
  const title = str(doc, "title");
  const relatedSlugs = list(doc, "relatedStrategySlugs");
  const others = (await listPublished("toppers-strategy", { select: "title slug studentSlug" })).filter((d) => d.slug !== slug);
  const related = [...others.filter((d) => relatedSlugs.includes(String(d.slug))), ...others.filter((d) => !relatedSlugs.includes(String(d.slug)))].slice(0, 3);

  const topperFacts = topper
    ? [
        { label: "All India Rank", value: `AIR ${topper.air}` },
        { label: "CLAT score", value: String(topper.score) },
        { label: "Law school", value: `${topper.nlu} ${topper.city}` },
        { label: "Centre", value: "LawPrep Noida" },
      ]
    : [];

  return (
    <ArticleShell
      jsonLdData={[
        articleJsonLd({
          headline: title,
          description: str(doc, "quickAnswer"),
          image: topper ? `${site.url}${topper.photo}` : undefined,
          datePublished: str(doc, "publishedAt"),
          dateModified: str(doc, "updatedAt").slice(0, 10),
          author: str(doc, "author.name"),
          url: `${site.url}/resources/toppers-strategy/${slug}`,
        }),
      ]}
    >
      <ArticleHeader
        back={{ href: "/resources/toppers-strategy", label: "All topper strategies" }}
        eyebrow={topper ? `${topper.name} · CLAT 2026` : "Topper strategy"}
        title={title}
        image={topper?.photo}
        alt={topper ? `${topper.name}, AIR ${topper.air} in CLAT 2026` : undefined}
        aside={
          topper && (
            <span className="inline-flex items-baseline gap-2 rounded-2xl bg-sun px-3.5 py-1.5 text-ink">
              <span className="text-xs font-bold uppercase tracking-[0.14em]">AIR</span>
              <span className="tabular font-display text-[30px] font-extrabold leading-none tracking-tight">{topper.air}</span>
            </span>
          )
        }
      />
      <Byline author={str(doc, "author.name")} date={str(doc, "publishedAt")} readTime={num(doc, "readTime")} />
      <FactTiles rows={topperFacts} />
      <QuickAnswer label="The strategy in short" text={str(doc, "quickAnswer")} />
      <FactTiles title="Strategy at a glance" rows={rows(doc, "strategySnapshot", ["label", "value"] as const)} />
      <Takeaways title="Steal these habits" items={list(doc, "keyTakeaways")} />
      <Body title="In their words" html={str(doc, "content")} />
      <FaqBlock items={faqs(doc)} />
      <RelatedLinks
        title="More topper strategies"
        items={related.map((d) => {
          const t = findTopper(str(d, "studentSlug"));
          return { href: `/resources/toppers-strategy/${d.slug}`, label: str(d, "title"), note: t ? `${t.name} · AIR ${t.air}` : undefined };
        })}
      />
      <CounsellorCard title="Start your own rank story" />
    </ArticleShell>
  );
}
