import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowRightIcon, CheckIcon, SealPercentIcon } from "@phosphor-icons/react/ssr";
import { Accordion } from "@/components/accordion";
import { EnquireButton } from "@/components/enquire-button";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/page-header";
import { FactTiles } from "@/components/site/fact-tiles";
import { Section } from "@/components/site/section";
import { Stepper } from "@/components/site/stepper";
import { courseDetails, exams, programs } from "@/lib/data";
import { button } from "@/lib/ui";

const MAX_MONTHS = 24;

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/courses/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const program = programs.find((p) => p.slug === slug);
  if (!program) return {};
  return {
    title: `${program.name} batch · ${program.duration} CLAT course`,
    description: `${program.detail} Classroom at the Noida centre or live online.`,
  };
}

export default function CoursePage({ params }: PageProps<"/courses/[slug]">) {
  return (
    <Suspense fallback={<CourseSkeleton />}>
      <Course params={params} />
    </Suspense>
  );
}

function CourseSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 pt-2 md:px-6 md:pt-10">
      <div className="h-[420px] rounded-[28px] bg-ink/90 md:h-[380px] md:rounded-[36px]" />
      <div className="mt-3 grid grid-cols-2 gap-2.5 md:mt-4 md:grid-cols-4 md:gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-20 rounded-[20px] bg-mist" />
        ))}
      </div>
    </div>
  );
}

async function Course({ params }: { params: PageProps<"/courses/[slug]">["params"] }) {
  const { slug } = await params;
  const program = programs.find((p) => p.slug === slug);
  const detail = courseDetails[slug];
  if (!program || !detail) notFound();

  const others = programs.filter((p) => p.slug !== slug);

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-2 md:px-6 md:pt-10">
        <Reveal className="overflow-hidden rounded-[28px] bg-ink p-5 text-white md:grid md:grid-cols-[1.1fr_1fr] md:gap-12 md:rounded-[36px] md:p-10">
          <div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[13px] font-semibold text-white/85">For {program.audience}</span>
            <h1 className="mt-5 font-display text-[44px] font-bold leading-[0.95] tracking-[-0.04em] md:text-[72px]">{program.name} batch</h1>
            <p className="mt-3 max-w-md text-[16px] leading-relaxed text-white/70">{program.summary}</p>
            <div className="mt-6 hidden gap-2.5 md:flex">
              <EnquireButton interest={program.name} source="course" className={button("primary", "lg")}>
                Enquire about {program.name}
              </EnquireButton>
              <Link href="/batches" className={`${button("ink", "lg")} bg-white/10 hover:bg-white/15`}>
                See start dates
              </Link>
            </div>
          </div>
          <div className="mt-8 md:mt-0 md:self-end">
            <p className="flex items-baseline gap-2">
              <span className="tabular font-display text-[80px] font-extrabold leading-[0.85] tracking-[-0.04em] md:text-[110px]">
                {program.months}
              </span>
              <span className="text-lg font-bold text-white/55">months</span>
            </p>
            <div className="mt-5 flex gap-[3px]" aria-hidden>
              {Array.from({ length: MAX_MONTHS }, (_, i) => (
                <span key={i} className={`h-2 flex-1 rounded-full ${i < program.months ? "bg-brand" : "bg-white/12"}`} />
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2 md:hidden">
              <EnquireButton interest={program.name} source="course" className={button("primary")}>
                Enquire
              </EnquireButton>
              <Link href="/batches" className={`${button("ink")} bg-white/10`}>
                Start dates
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="mt-3 md:mt-4">
          <FactTiles
            facts={[
              { label: "Duration", value: program.duration },
              { label: "Teaching hours", value: detail.hours },
              { label: "Schedule", value: detail.schedule },
              { label: "Mode", value: "Classroom + online" },
            ]}
          />
        </Reveal>
      </div>

      <Section className="md:grid md:grid-cols-[1fr_1.15fr] md:gap-16">
        <Reveal>
          <SectionHeader title="How the year runs" subtitle={program.detail} />
        </Reveal>
        <Reveal delay={0.06}>
          <Stepper steps={detail.phases.map((p) => ({ title: p.title, text: p.focus, extra: <p className="mt-2 inline-block rounded-full bg-sun-tint px-2.5 py-0.5 text-[12px] font-bold">{p.span}</p> }))} />
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <SectionHeader title="What's included" />
          <ul className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-4">
            {detail.includes.map((item) => (
              <li key={item} className="flex items-center gap-3 rounded-[20px] bg-mist px-4 py-3.5 text-[15px] font-semibold">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-white">
                  <CheckIcon size={14} weight="bold" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Exams covered">
            {exams.map((exam) => (
              <li key={exam} className="rounded-full border border-line px-3.5 py-1.5 text-[13px] font-semibold text-ink-2 first-letter:uppercase">
                {exam}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <Link
            href="/scholarship"
            className="group flex items-center gap-4 rounded-[26px] bg-sun p-5 transition active:scale-[0.98] md:p-7"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-[18px] bg-ink text-sun">
              <SealPercentIcon size={26} weight="fill" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-[21px] font-bold leading-tight tracking-[-0.02em] md:text-[26px]">
                Up to 100% off the fees
              </span>
              <span className="block text-sm font-medium text-ink/70">Take the scholarship test before you enrol</span>
            </span>
            <ArrowRightIcon size={20} weight="bold" className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <SectionHeader title="Questions" />
          <Accordion items={detail.faqs} />
        </Reveal>
      </Section>

      <Section className="pb-14 md:pb-28">
        <Reveal>
          <SectionHeader title="Other courses" />
          <ul className="grid gap-2.5 md:grid-cols-2 md:gap-4">
            {others.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/courses/${p.slug}`}
                  className="flex items-center gap-4 rounded-[22px] border border-line p-4 transition hover:bg-mist active:scale-[0.98] md:p-5"
                >
                  <span className="tabular grid size-12 shrink-0 place-items-center rounded-2xl bg-mist font-display text-lg font-extrabold">
                    {p.months}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[20px] font-bold leading-tight">{p.name}</span>
                    <span className="block text-sm text-ink-2">
                      {p.duration} · For {p.audience}
                    </span>
                  </span>
                  <ArrowRightIcon size={18} weight="bold" className="text-ink-3" />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>
    </>
  );
}
