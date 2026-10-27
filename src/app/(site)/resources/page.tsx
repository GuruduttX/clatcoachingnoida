import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { CardRail } from "@/components/content/content-card";
import { formatDate, num, str } from "@/components/content/doc";
import { DestIcon } from "@/components/dest-icon";
import { PageHeader, SectionHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import type { CollectionKey } from "@/lib/cms/fields";
import { countPublished, listPublished } from "@/lib/server/content";

export const metadata: Metadata = {
  title: "Free CLAT resources",
  description: "Study plans, topper strategies, current affairs, NLU profiles, articles and FAQs for CLAT and AILET, all free.",
  alternates: { canonical: "/resources" },
};

const hubs: { href: string; label: string; note: string; icon: string; key?: CollectionKey; unit: string; tone: string }[] = [
  { href: "/resources/study-plan", label: "Study plans", note: "Month-by-month plans for every runway", icon: "path", key: "study-plans", unit: "plans", tone: "bg-ink text-white" },
  { href: "/resources/current-affairs", label: "Current affairs", note: "The news that could show up in CLAT", icon: "newspaper", key: "current-affairs", unit: "stories", tone: "bg-sun text-ink" },
  { href: "/resources/toppers-strategy", label: "Topper strategies", note: "How our rank-holders prepared", icon: "lightbulb", key: "toppers-strategy", unit: "stories", tone: "bg-brand text-white" },
  { href: "/resources/nlu-profiles", label: "NLU profiles", note: "Rank, city, seats and fees", icon: "bank", key: "nlu-profiles", unit: "NLUs", tone: "bg-mist text-ink" },
  { href: "/blog", label: "Blog", note: "Advice and exam updates", icon: "article", key: "blogs", unit: "articles", tone: "bg-mist text-ink" },
  { href: "/faq", label: "FAQs", note: "Quick answers to common questions", icon: "question", key: "faqs", unit: "answers", tone: "bg-mist text-ink" },
  { href: "/how-to-apply", label: "How to apply", note: "The CLAT form, step by step", icon: "clipboard", unit: "", tone: "bg-mist text-ink" },
];

export default async function ResourcesPage() {
  const [counts, blogs, news] = await Promise.all([
    Promise.all(hubs.map((h) => (h.key ? countPublished(h.key) : Promise.resolve(null)))),
    listPublished("blogs", { select: "title slug category image alt readTime publishedAt", limit: 6 }),
    listPublished("current-affairs", { select: "title slug category eventDate heroImage", limit: 6 }),
  ]);

  return (
    <>
      <PageHeader eyebrow="Resources" title="Free, and built for CLAT.">
        Everything we&apos;d tell you in class, in one place.
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 pb-14 md:px-6 md:pb-28">
        <Reveal>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {hubs.map((hub, i) => {
              const dark = hub.tone.includes("text-white");
              const count = counts[i];
              // The two lead tiles span full width on phones.
              const wide = i < 2 ? "col-span-2 md:col-span-2" : "";
              return (
                <li key={hub.href} className={wide}>
                  <Link
                    href={hub.href}
                    className={`group flex h-full min-h-[150px] flex-col rounded-[24px] p-4 transition-transform active:scale-[0.97] md:min-h-[180px] md:p-6 ${hub.tone} ${
                      hub.tone.includes("bg-mist") ? "hover:bg-fog" : ""
                    }`}
                  >
                    <span className="flex items-start justify-between">
                      <span className={`grid size-11 place-items-center rounded-2xl ${dark ? "bg-white/12" : hub.tone.includes("bg-sun") ? "bg-paper/70" : "bg-paper text-brand"}`}>
                        <DestIcon name={hub.icon} />
                      </span>
                      <ArrowUpRightIcon size={16} weight="bold" className="opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                    <span className="mt-auto pt-5">
                      {count ? (
                        <span className={`tabular block text-[13px] font-bold ${dark ? "text-white/60" : "text-ink-3"}`}>
                          {count} {hub.unit}
                        </span>
                      ) : null}
                      <span className="block font-display text-[20px] font-bold leading-tight tracking-[-0.02em] md:text-[24px]">{hub.label}</span>
                      <span className={`mt-0.5 block text-[13px] leading-snug ${dark ? "text-white/70" : "text-ink-2"} ${i < 2 ? "" : "max-md:hidden"}`}>
                        {hub.note}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>

        {news.length > 0 && (
          <section className="pt-12 md:pt-24">
            <Reveal>
              <SectionHeader title="In the news" subtitle="Current affairs, CLAT-ready" action={<SeeAll href="/resources/current-affairs" />} />
              <CardRail
                tone="sun"
                cards={news.map((d) => ({
                  href: `/resources/current-affairs/${d.slug}`,
                  title: str(d, "title"),
                  eyebrow: str(d, "category") || undefined,
                  meta: formatDate(str(d, "eventDate")),
                  image: str(d, "heroImage.url") || undefined,
                  alt: str(d, "heroImage.alt"),
                }))}
              />
            </Reveal>
          </section>
        )}

        {blogs.length > 0 && (
          <section className="pt-12 md:pt-24">
            <Reveal>
              <SectionHeader title="Latest reads" subtitle="From the blog" action={<SeeAll href="/blog" />} />
              <CardRail
                cards={blogs.map((d) => ({
                  href: `/blog/${d.slug}`,
                  title: str(d, "title"),
                  eyebrow: str(d, "category") || undefined,
                  meta: formatDate(str(d, "publishedAt")),
                  image: str(d, "image") || undefined,
                  alt: str(d, "alt"),
                  readTime: num(d, "readTime"),
                }))}
              />
            </Reveal>
          </section>
        )}
      </div>
    </>
  );
}

function SeeAll({ href }: { href: string }) {
  return (
    <Link href={href} className="group flex shrink-0 items-center gap-1 pb-1 text-sm font-bold text-brand md:text-[15px]">
      See all
      <ArrowRightIcon size={15} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
