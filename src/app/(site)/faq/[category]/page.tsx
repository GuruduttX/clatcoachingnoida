import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Accordion } from "@/components/accordion";
import { CounsellorCard, RelatedLinks } from "@/components/content/article-screen";
import { faqJsonLd, jsonLd, rows, str } from "@/components/content/doc";
import { FaqIcon } from "@/components/content/faq-icon";
import { EmptyState } from "@/components/empty-state";
import { FAQ_CATEGORIES } from "@/lib/cms/taxonomy";
import { listPublished } from "@/lib/server/content";

type Params = PageProps<"/faq/[category]">["params"];

export function generateStaticParams() {
  return FAQ_CATEGORIES.map((c) => ({ category: c.value }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category } = await params;
  const meta = FAQ_CATEGORIES.find((c) => c.value === category);
  if (!meta) return { title: "FAQs" };
  return {
    title: `${meta.label} FAQs`,
    description: `Quick answers on ${meta.label.toLowerCase()} for CLAT and AILET aspirants, from LawPrep Tutorial Noida.`,
    alternates: { canonical: `/faq/${category}` },
  };
}

export default function FaqCategoryPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div className="mx-auto h-[60vh] max-w-3xl animate-pulse px-4 pt-6"><div className="h-full rounded-[26px] bg-mist" /></div>}>
      <FaqCategory params={params} />
    </Suspense>
  );
}

async function FaqCategory({ params }: { params: Params }) {
  const { category } = await params;
  const meta = FAQ_CATEGORIES.find((c) => c.value === category);
  if (!meta) notFound();

  const docs = await listPublished("faqs", { filter: { category } });
  const items = docs.map((d) => ({ question: str(d, "question"), answer: str(d, "answer") }));
  const readNext = docs
    .flatMap((d) => rows(d, "resources", ["label", "href"] as const))
    .filter((r, i, arr) => arr.findIndex((x) => x.href === r.href) === i)
    .slice(0, 6);
  const sources = docs
    .flatMap((d) => rows(d, "sources", ["label", "href"] as const))
    .filter((r, i, arr) => arr.findIndex((x) => x.href === r.href) === i);

  return (
    <div className="mx-auto max-w-3xl px-4 pt-2 pb-16 md:px-6 md:pt-10 md:pb-28">
      {items.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd(items))} />}

      <ul aria-label="FAQ topics" className="rail -mx-4 gap-2 px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
        {FAQ_CATEGORIES.map((c) => {
          const active = c.value === category;
          return (
            <li key={c.value} className="shrink-0">
              <Link
                href={`/faq/${c.value}`}
                aria-current={active ? "page" : undefined}
                className={`block rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  active ? "bg-ink text-white" : "bg-mist text-ink-2 hover:bg-fog"
                }`}
              >
                {c.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <header className="mt-6 flex items-center gap-4 md:mt-10">
        <span className="grid size-14 shrink-0 place-items-center rounded-[20px] bg-sun">
          <FaqIcon category={category} size={26} />
        </span>
        <div>
          <p className="text-[13px] font-bold text-brand">FAQs</p>
          <h1 className="font-display text-[32px] font-bold leading-[1.02] tracking-[-0.035em] md:text-[48px]">{meta.label}</h1>
        </div>
      </header>

      <div className="mt-6 md:mt-8">
        {items.length > 0 ? (
          <Accordion items={items} />
        ) : (
          <EmptyState title="No questions here yet">Answers for this topic are being written.</EmptyState>
        )}
      </div>

      <RelatedLinks title="Read next" items={readNext.map((r) => ({ href: r.href, label: r.label }))} />

      {sources.length > 0 && (
        <p className="mt-8 text-[13px] leading-relaxed text-ink-3">
          Sources:{" "}
          {sources.map((s, i) => (
            <span key={s.href}>
              {i > 0 && " · "}
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="font-semibold underline decoration-line-strong underline-offset-4 hover:text-ink">
                {s.label}
              </a>
            </span>
          ))}
        </p>
      )}

      <CounsellorCard title="Still have a question?" />
    </div>
  );
}
