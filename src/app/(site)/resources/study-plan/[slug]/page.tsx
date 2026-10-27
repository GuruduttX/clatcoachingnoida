import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
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
import { PlanIcon } from "@/components/content/plan-icon";
import { ArticleSkeleton } from "@/components/content/skeletons";
import { getPublished, listPublished } from "@/lib/server/content";
import { site } from "@/lib/site";
import { button } from "@/lib/ui";

type Params = PageProps<"/resources/study-plan/[slug]">["params"];

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getPublished("study-plans", slug);
  if (!doc) return { title: "Plan not found" };
  return {
    title: str(doc, "metaTitle") ? { absolute: str(doc, "metaTitle") } : str(doc, "title"),
    description: str(doc, "metaDescription") || str(doc, "quickAnswer"),
    alternates: { canonical: `/resources/study-plan/${slug}` },
  };
}

export default function StudyPlanPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <StudyPlan params={params} />
    </Suspense>
  );
}

async function StudyPlan({ params }: { params: Params }) {
  const { slug } = await params;
  const doc = await getPublished("study-plans", slug);
  if (!doc) notFound();

  const title = str(doc, "title");
  const months = num(doc, "durationMonths");
  const mocks = num(doc, "totalMocks");
  const relatedSlugs = list(doc, "relatedPlanSlugs");
  const others = (await listPublished("study-plans", { select: "title slug timeline bestFor" })).filter((d) => d.slug !== slug);
  const related = [...others.filter((d) => relatedSlugs.includes(String(d.slug))), ...others.filter((d) => !relatedSlugs.includes(String(d.slug)))].slice(0, 3);

  const cardFacts = [
    { label: "Best for", value: str(doc, "bestFor") },
    { label: "Timeline", value: months !== null ? `${months} months` : str(doc, "timeline") },
    { label: "Weekly load", value: str(doc, "weeklyLoad") },
    { label: "Mock cadence", value: str(doc, "mockCadence") },
    ...(mocks !== null ? [{ label: "Total mocks", value: String(mocks) }] : []),
    { label: "Intensity", value: str(doc, "intensity") },
  ].filter((r) => r.value);

  const programHref = str(doc, "programHref");
  const programLabel = str(doc, "programLabel");

  return (
    <ArticleShell
      jsonLdData={[
        articleJsonLd({
          headline: title,
          description: str(doc, "quickAnswer"),
          datePublished: str(doc, "publishedAt"),
          dateModified: str(doc, "updatedAt").slice(0, 10),
          author: str(doc, "author.name"),
          url: `${site.url}/resources/study-plan/${slug}`,
        }),
      ]}
    >
      <ArticleHeader
        back={{ href: "/resources/study-plan", label: "All study plans" }}
        eyebrow="Study plan"
        title={title}
        chips={list(doc, "targetExams")}
      />
      <Byline author={str(doc, "author.name")} date={str(doc, "publishedAt")} readTime={num(doc, "readTime")} />
      <div className="mt-6 flex items-center gap-4 rounded-[26px] bg-ink p-5 text-white md:p-7">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand">
          <PlanIcon name={str(doc, "icon")} size={28} />
        </span>
        <p className="font-display text-[26px] font-bold leading-tight tracking-[-0.02em]">
          {months !== null ? `${months} months` : str(doc, "timeline")}
          {str(doc, "intensity") && <span className="block text-[15px] font-semibold text-white/60">{str(doc, "intensity")} pace</span>}
        </p>
      </div>
      <QuickAnswer text={str(doc, "quickAnswer")} />
      <FactTiles title="This plan at a glance" rows={[...cardFacts, ...rows(doc, "planSnapshot", ["label", "value"] as const)]} />
      <Takeaways items={list(doc, "keyTakeaways")} />
      {programHref && programLabel && (
        <Link
          href={programHref}
          className="mt-6 flex items-center justify-between gap-4 rounded-[24px] border border-line p-5 transition-colors hover:bg-mist md:p-6"
        >
          <span>
            <span className="block text-[12px] font-bold uppercase tracking-[0.12em] text-ink-3">Matching course</span>
            <span className="mt-1 block font-display text-[20px] font-bold tracking-[-0.02em]">{programLabel}</span>
          </span>
          <span className={button("primary", "sm")}>
            View <ArrowRightIcon size={14} weight="bold" />
          </span>
        </Link>
      )}
      <Body title="The plan, month by month" html={str(doc, "content")} />
      <FaqBlock items={faqs(doc)} />
      <RelatedLinks
        title="Other plans"
        items={related.map((d) => ({ href: `/resources/study-plan/${d.slug}`, label: str(d, "title"), note: [str(d, "timeline"), str(d, "bestFor")].filter(Boolean).join(" · ") }))}
      />
      <CounsellorCard interest={programLabel || undefined} title="Want this plan run for you?" />
    </ArticleShell>
  );
}
