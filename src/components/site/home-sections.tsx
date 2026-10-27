import Link from "next/link";
import { ArrowRightIcon, ChatCircleDotsIcon } from "@phosphor-icons/react/ssr";
import { Accordion } from "@/components/accordion";
import { faqJsonLd, jsonLd, str } from "@/components/content/doc";
import { DestIcon } from "@/components/dest-icon";
import { EnquireButton } from "@/components/enquire-button";
import { SectionHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { PersonPhoto } from "@/components/site/avatar";
import { ReviewCard } from "@/components/site/review-card";
import { toReviewItem } from "@/components/site/review-item";
import { facultyMembers } from "@/lib/faculty";
import { listPublished } from "@/lib/server/content";
import { FAQ_CATEGORIES } from "@/lib/cms/taxonomy";
import { destinations, site } from "@/lib/site";
import { button } from "@/lib/ui";

function SeeAll({ href, label = "See all" }: { href: string; label?: string }) {
  return (
    <Link href={href} className="group flex shrink-0 items-center gap-1 pb-1 text-sm font-bold text-brand md:text-[15px]">
      {label}
      <ArrowRightIcon size={15} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export async function HomeReviews() {
  let docs = await listPublished("reviews", { filter: { centre: "Noida" }, limit: 10 });
  if (docs.length === 0) docs = await listPublished("reviews", { limit: 10 });
  const reviews = docs.map(toReviewItem).filter((r) => r.text);
  if (reviews.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pt-12 md:px-6 md:pt-16">
      <Reveal>
        <SectionHeader title="What students say" subtitle="From the Noida classroom" action={<SeeAll href="/reviews" />} />
      </Reveal>
      <Reveal delay={0.08}>
        <ul className="rail -mx-4 scroll-pl-4 gap-3 px-4 pb-1 md:mx-0 md:gap-4 md:px-0">
          {reviews.map((r) => (
            <li key={r.id} className="w-[84%] shrink-0 sm:w-[48%] md:w-[calc((100%-2rem)/3)]">
              <ReviewCard review={r} className="h-full" />
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

export function HomeFaculty() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-12 md:px-6 md:pt-16">
      <Reveal>
        <SectionHeader title="Meet your faculty" subtitle="A mentor for every section" action={<SeeAll href="/faculty" />} />
      </Reveal>
      <Reveal delay={0.08}>
        <ul className="rail -mx-4 scroll-pl-4 gap-3 px-4 md:mx-0 md:gap-4 md:px-0">
          {facultyMembers.map((m) => (
            <li key={m.slug} className="w-[38%] shrink-0 sm:w-[24%] md:w-[calc((100%-5rem)/6)]">
              <Link href={`/faculty/${m.slug}`} className="group block active:scale-[0.96]">
                <span className="relative block aspect-[4/5] overflow-hidden rounded-[20px] bg-mist">
                  <PersonPhoto src={m.image} name={m.name} sizes="(min-width: 768px) 16vw, 38vw" className="transition duration-700 group-hover:scale-[1.05]" />
                </span>
                <span className="mt-2 block truncate text-sm font-bold">{m.name}</span>
                <span className="block truncate text-[12px] text-ink-3">{m.role.replace(/ mentor$/i, "")}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

const teaser = ["/scholarship", "/batches", "/reviews", "/resources/study-plan", "/resources/current-affairs", "/faq"];

export function HomeExplore() {
  const items = destinations.flatMap((g) => g.items).filter((d) => teaser.includes(d.href));
  return (
    <section className="mx-auto max-w-6xl px-4 pt-12 md:px-6 md:pt-16">
      <Reveal>
        <SectionHeader title="Explore" subtitle="Free resources and everything about joining" action={<SeeAll href="/explore" label="All" />} />
      </Reveal>
      <Reveal delay={0.08}>
        <ul className="grid grid-cols-3 gap-2.5 md:grid-cols-6 md:gap-4">
          {items.map((d) => (
            <li key={d.href}>
              <Link
                href={d.href}
                className="flex h-full flex-col items-center gap-2 rounded-[22px] bg-mist px-2 py-4 text-center transition hover:bg-fog active:scale-[0.96] md:py-5"
              >
                <span className="grid size-11 place-items-center rounded-[16px] bg-paper text-brand">
                  <DestIcon name={d.icon} size={22} />
                </span>
                <span className="text-[13px] font-bold leading-tight">{d.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

// Shown until FAQs are published in the CMS. Every answer restates facts used elsewhere on the site.
const fallbackFaqs = [
  {
    question: "Which batches does the Noida centre run?",
    answer: "Three: Foundation (2 years, for Class 11), Target (1 year, for Class 12) and Finisher (10 months, for repeat aspirants). All three cover the same syllabus; what changes is how much time you have before the exam.",
  },
  {
    question: "Do you prepare students for AILET as well as CLAT?",
    answer: "Yes. Every batch covers CLAT (UG), AILET and other law entrance tests.",
  },
  {
    question: "Can I join online instead of coming to the centre?",
    answer: "Yes. Batches run in the classroom at the Noida centre and live online, so you can pick whichever suits you.",
  },
  {
    question: "Is there a scholarship?",
    answer: "Yes. Take the scholarship test and your score can earn you up to 100% off your course fee.",
  },
  {
    question: "When should I start preparing for CLAT?",
    answer: "Class 11 is ideal: the Foundation batch gives you two years alongside school. Starting in Class 12 works well too with the one-year Target batch.",
  },
  {
    question: "Where is the centre, and when can I visit?",
    answer: `${site.address}, near the ${site.metro} metro. Office hours are ${site.hours}. Call ahead and a counsellor will show you around.`,
  },
];

export async function HomeFaq() {
  const docs = await listPublished("faqs", { select: "question answer category order" });
  // Same picks as the FAQ hub: the lead question from each category, then the rest in order.
  const leads = FAQ_CATEGORIES.map((c) => docs.find((d) => str(d, "category") === c.value)).filter((d) => d !== undefined);
  const items: { question: string; answer: string }[] = [...leads, ...docs.filter((d) => !leads.includes(d))]
    .slice(0, 6)
    .map((d) => ({ question: str(d, "question"), answer: str(d, "answer") }))
    .filter((f) => f.question && f.answer);
  if (items.length === 0) items.push(...fallbackFaqs);

  return (
    <section className="mx-auto max-w-6xl px-4 pt-12 pb-12 md:grid md:grid-cols-[1fr_1.6fr] md:gap-12 md:px-6 md:pt-16 md:pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd(items))} />
      <Reveal>
        <SectionHeader title="Questions, answered" subtitle="What parents and students ask us most" />
        <div className="hidden md:block">
          <EnquireButton className={button("primary")}>
            <ChatCircleDotsIcon size={18} weight="fill" /> Ask a counsellor
          </EnquireButton>
          <Link href="/faq" className="group mt-4 flex w-fit items-center gap-1 text-[15px] font-bold text-brand">
            All FAQs
            <ArrowRightIcon size={15} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <Accordion items={items} />
        <div className="mt-4 grid grid-cols-2 gap-2.5 md:hidden">
          <EnquireButton className={button("primary")}>Ask a counsellor</EnquireButton>
          <Link href="/faq" className={button("quiet")}>
            All FAQs
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
