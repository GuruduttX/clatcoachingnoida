import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { Accordion } from "@/components/accordion";
import { faqJsonLd, jsonLd, str } from "@/components/content/doc";
import { FaqIcon } from "@/components/content/faq-icon";
import { EmptyState } from "@/components/empty-state";
import { PageHeader, SectionHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { FAQ_CATEGORIES } from "@/lib/cms/taxonomy";
import { listPublished } from "@/lib/server/content";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Quick answers about CLAT, AILET, NLUs, preparation and LawPrep Tutorial's Noida centre.",
  alternates: { canonical: "/faq" },
};

export default async function FaqHubPage() {
  const docs = await listPublished("faqs", { select: "question answer category order" });
  const counts = new Map<string, number>();
  for (const d of docs) counts.set(str(d, "category"), (counts.get(str(d, "category")) ?? 0) + 1);
  const categories = FAQ_CATEGORIES.filter((c) => counts.has(c.value));
  // A taste of every category: the first question from each.
  const popular = categories
    .map((c) => docs.find((d) => str(d, "category") === c.value))
    .filter((d) => d !== undefined)
    .map((d) => ({ question: str(d, "question"), answer: str(d, "answer") }));

  return (
    <>
      <PageHeader eyebrow="FAQs" title="Quick answers.">
        Pick a topic. Every answer fits on one screen.
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 pb-14 md:px-6 md:pb-28">
        {docs.length === 0 ? (
          <EmptyState title="Answers on the way">FAQs will appear here once they&apos;re published.</EmptyState>
        ) : (
          <>
            <Reveal>
              <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                {categories.map((c, i) => (
                  <li key={c.value}>
                    <Link
                      href={`/faq/${c.value}`}
                      className={`group flex h-full min-h-[140px] flex-col rounded-[24px] p-4 transition-transform active:scale-[0.97] md:p-6 ${
                        i === 0 ? "bg-ink text-white" : i === 1 ? "bg-sun" : "bg-mist hover:bg-fog"
                      }`}
                    >
                      <span className="flex items-start justify-between">
                        <span className={`grid size-11 place-items-center rounded-2xl ${i === 0 ? "bg-brand" : "bg-paper text-brand"}`}>
                          <FaqIcon category={c.value} />
                        </span>
                        <ArrowUpRightIcon size={16} weight="bold" className="opacity-50" />
                      </span>
                      <span className="mt-auto pt-5 font-display text-[19px] font-bold leading-tight tracking-[-0.02em] md:text-[22px]">
                        {c.label}
                      </span>
                      <span className={`mt-1 text-[13px] font-semibold ${i === 0 ? "text-white/60" : "text-ink-3"}`}>
                        {counts.get(c.value)} question{counts.get(c.value) === 1 ? "" : "s"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>

            {popular.length > 0 && (
              <section className="pt-12 md:pt-20">
                <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd(popular))} />
                <Reveal>
                  <SectionHeader title="Most asked" subtitle="Tap a question to open it" />
                  <Accordion items={popular} />
                </Reveal>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}
