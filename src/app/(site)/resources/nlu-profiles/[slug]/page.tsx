import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SealCheckIcon } from "@phosphor-icons/react/ssr";
import {
  ArticleHeader,
  ArticleShell,
  Body,
  CounsellorCard,
  FactTiles,
  FaqBlock,
  QuickAnswer,
  RelatedLinks,
} from "@/components/content/article-screen";
import { faqs, rows, str } from "@/components/content/doc";
import { ArticleSkeleton } from "@/components/content/skeletons";
import { getPublished, listPublished } from "@/lib/server/content";
import { site } from "@/lib/site";

type Params = PageProps<"/resources/nlu-profiles/[slug]">["params"];

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getPublished("nlu-profiles", slug);
  if (!doc) return { title: "NLU not found" };
  const image = str(doc, "heroImage.url");
  return {
    title: str(doc, "metaTitle") ? { absolute: str(doc, "metaTitle") } : str(doc, "universityName"),
    description: str(doc, "metaDescription") || str(doc, "quickAnswer"),
    alternates: { canonical: `/resources/nlu-profiles/${slug}` },
    openGraph: { images: image ? [image] : undefined },
  };
}

export default function NluProfilePage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <NluProfile params={params} />
    </Suspense>
  );
}

async function NluProfile({ params }: { params: Params }) {
  const { slug } = await params;
  const doc = await getPublished("nlu-profiles", slug);
  if (!doc) notFound();

  const name = str(doc, "universityName");
  const city = str(doc, "location.city");
  const rank = str(doc, "universityRank");
  const facts = rows(doc, "aiExtractionFacts", ["fact", "sourceLabel"] as const);
  // Facts without a source label are still worth showing.
  const looseFacts = rows(doc, "aiExtractionFacts", ["fact"] as const).filter((f) => !facts.some((x) => x.fact === f.fact));

  const others = (await listPublished("nlu-profiles", { select: "universityName shortName slug location" })).filter((d) => d.slug !== slug);
  const nearby = others.filter((d) => str(d, "location.country") && str(d, "location.country") === str(doc, "location.country")).slice(0, 3);

  return (
    <ArticleShell
      jsonLdData={[
        {
          "@context": "https://schema.org",
          "@type": "CollegeOrUniversity",
          name: str(doc, "schemaTitle") || name,
          description: str(doc, "schemaDescription") || str(doc, "quickAnswer"),
          url: `${site.url}/resources/nlu-profiles/${slug}`,
          address: city ? { "@type": "PostalAddress", addressLocality: city, addressCountry: "IN" } : undefined,
        },
      ]}
    >
      <ArticleHeader
        back={{ href: "/resources/nlu-profiles", label: "All NLUs" }}
        eyebrow={str(doc, "shortName") || "NLU profile"}
        title={str(doc, "h1") || name}
        chips={[city && `${city}${str(doc, "location.country") ? `, ${str(doc, "location.country")}` : ""}`, rank && `NIRF ${rank}`]}
        image={str(doc, "heroImage.url")}
        alt={str(doc, "heroImage.altText") || name}
      />
      <QuickAnswer text={str(doc, "quickAnswer")} />
      <FactTiles title="At a glance" rows={rows(doc, "atAGlance", ["label", "value"] as const)} />
      {facts.length + looseFacts.length > 0 && (
        <section className="mt-6 md:mt-8">
          <h2 className="mb-3 font-display text-[22px] font-bold tracking-[-0.02em] md:text-[28px]">Verified facts</h2>
          <ul className="space-y-2">
            {[...facts, ...looseFacts.map((f) => ({ ...f, sourceLabel: "" }))].map((f) => (
              <li key={f.fact} className="flex gap-3 rounded-[20px] bg-mist px-4 py-3.5">
                <SealCheckIcon size={18} weight="fill" className="mt-0.5 shrink-0 text-brand" />
                <span className="text-[15px] leading-relaxed">
                  {f.fact}
                  {f.sourceLabel && <span className="mt-0.5 block text-[12px] font-semibold text-ink-3">Source: {f.sourceLabel}</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      <Body title="The full profile" html={str(doc, "content")} />
      <FaqBlock items={faqs(doc)} />
      <RelatedLinks
        title="Also in the region"
        items={nearby.map((d) => ({
          href: `/resources/nlu-profiles/${d.slug}`,
          label: str(d, "universityName"),
          note: [str(d, "shortName"), str(d, "location.city")].filter(Boolean).join(" · "),
        }))}
      />
      <CounsellorCard title={`Aiming for ${str(doc, "shortName") || "this NLU"}?`} />
    </ArticleShell>
  );
}
