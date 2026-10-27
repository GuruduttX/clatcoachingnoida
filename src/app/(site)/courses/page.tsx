import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";
import {
  ArrowRightIcon,
  BooksIcon,
  ChalkboardTeacherIcon,
  ChatsCircleIcon,
  CheckCircleIcon,
  ExamIcon,
  LaptopIcon,
  NewspaperIcon,
  PhoneIcon,
  SealPercentIcon,
  UserFocusIcon,
  VideoCameraIcon,
} from "@phosphor-icons/react/ssr";
import { Accordion } from "@/components/accordion";
import { faqJsonLd, jsonLd } from "@/components/content/doc";
import { CourseList, OtherFormats } from "@/components/course-list";
import { EnquireButton } from "@/components/enquire-button";
import { EnquiryForm } from "@/components/enquiry";
import { SectionHeader } from "@/components/page-header";
import { RankWall } from "@/components/rank-wall";
import { Reveal } from "@/components/reveal";
import { CourseGrid, CourseRoadmap } from "@/components/site/course-sections";
import { courseDetails, exams, noidaToppers, programs } from "@/lib/data";
import { site } from "@/lib/site";
import { button } from "@/lib/ui";

export const metadata: Metadata = {
  title: "CLAT & AILET courses",
  description:
    "Foundation (2 years), Target (1 year) and Finisher (10 months) batches for CLAT and AILET at LawPrep Tutorial's Noida centre, in the classroom or live online.",
  alternates: { canonical: "/courses" },
};

const ease = [0.22, 1, 0.36, 1] as const;

// Tighter desktop rhythm than the shared Section, matching the home page.
function Block({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-4 pt-10 md:px-6 md:pt-16 ${className}`}>
      {children}
    </section>
  );
}

const includes = [
  { label: "Printed study material", note: "Section-wise books and practice sets", icon: BooksIcon },
  { label: "Mock tests and analysis", note: "Full-length mocks, then a walkthrough", icon: ExamIcon },
  { label: "1:1 mentorship", note: "A mentor who tracks your scores", icon: UserFocusIcon },
  { label: "LMS access", note: "Classes and tests on your phone", icon: LaptopIcon },
  { label: "Current affairs updates", note: "The news that matters for GK", icon: NewspaperIcon },
  { label: "Doubt sessions", note: "Ask until it makes sense", icon: ChatsCircleIcon },
];

const faqs = [
  {
    question: "Which batch should I join?",
    answer: "It depends on how much time you have. Foundation is a 2-year track for Class 11, Target is a 1-year track for Class 12, and Finisher is a 10-month track for repeat aspirants.",
  },
  {
    question: "What are the fees?",
    answer: "Fees depend on the batch and any scholarship you earn. The counsellor will share the current fee on a call.",
  },
  {
    question: "Do the courses cover AILET too?",
    answer: `Yes. Every batch prepares you for ${exams.join(", ")}.`,
  },
  {
    question: "Can I take the course online?",
    answer: "Yes. Every batch runs in the classroom at the Noida centre and live online. There's also a fully online live program if you can't travel.",
  },
  {
    question: "Will coaching clash with school and board exams?",
    answer: "Foundation is paced to run alongside Class 11 and 12. Target eases off around board exams and picks up again after them. The counsellor can walk you through this year's calendar.",
  },
  {
    question: "I'm in college. Can I still join?",
    answer: "Yes. The Finisher batch runs on weekends, for students who are studying or working alongside preparation.",
  },
];

export default function CoursesPage() {
  return (
    <>
      <Hero />
      <Batches />
      <Compare />
      <Roadmap />
      <Includes />
      <Ranks />
      <Scholarship />
      <OtherWays />
      <Faqs />
      <Counsel />
    </>
  );
}

function Hero() {
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  });

  return (
    <section className="mx-auto max-w-6xl px-4 pt-2 md:grid md:grid-cols-[1.1fr_1fr] md:items-center md:gap-12 md:px-6 md:pt-8">
      <div className="min-w-0">
        <motion.p {...rise(0)} className="inline-flex items-center gap-2 rounded-full bg-brand-tint px-3 py-1 text-[13px] font-bold text-brand-deep">
          <span className="size-1.5 rounded-full bg-brand" /> CLAT &amp; AILET courses
        </motion.p>
        <motion.h1
          {...rise(0.06)}
          className="mt-3 font-display text-[38px] font-bold leading-[0.98] tracking-[-0.04em] sm:text-[52px] lg:text-[60px]"
        >
          Three batches. One goal: <span className="text-brand">your NLU.</span>
        </motion.h1>
        <motion.p {...rise(0.12)} className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-2 md:mt-4 md:text-[17px]">
          Classroom at Sector 62 or live online, from Class 11 to repeat attempts. Pick the track that matches the time you have.
        </motion.p>

        <motion.ul {...rise(0.16)} className="rail -mx-4 mt-4 gap-2 px-4 md:mx-0 md:flex-wrap md:px-0" aria-label="Exams covered">
          {exams.map((exam) => (
            <li key={exam} className="flex shrink-0 items-center gap-1.5 rounded-full bg-mist px-3 py-1.5 text-[13px] font-semibold text-ink-2 first-letter:uppercase">
              <CheckCircleIcon size={14} weight="fill" className="text-brand" />
              {exam}
            </li>
          ))}
        </motion.ul>

        <motion.div {...rise(0.2)} className="mt-5 grid grid-cols-2 gap-2.5 md:mt-7 md:flex md:gap-3">
          <EnquireButton source="course" className={`${button("primary", "lg")} max-md:h-12 max-md:px-4 max-md:text-[15px]`}>
            <PhoneIcon size={18} weight="fill" /> <span className="md:hidden">Get a call</span>
            <span className="hidden md:inline">Book a counselling call</span>
          </EnquireButton>
          <a href="#compare" className={`${button("outline", "lg")} max-md:h-12 max-md:px-4 max-md:text-[15px]`}>
            Compare batches
          </a>
        </motion.div>

        <motion.dl {...rise(0.24)} className="mt-5 grid grid-cols-3 gap-2 md:mt-8 md:max-w-md">
          {[
            { v: "1,310+", k: "NLU selections" },
            { v: "23+", k: "years coaching" },
            { v: String(noidaToppers.length), k: "CLAT 2026 ranks here" },
          ].map((s) => (
            <div key={s.k} className="flex flex-col-reverse justify-end rounded-[18px] bg-mist px-3 py-3 md:bg-transparent md:p-0">
              <dt className="mt-1 text-[12px] font-semibold leading-tight text-ink-3 md:text-[13px]">{s.k}</dt>
              <dd className="tabular font-display text-[22px] font-extrabold leading-none tracking-tight md:text-[28px]">{s.v}</dd>
            </div>
          ))}
        </motion.dl>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.15, ease }}
        className="relative mt-5 md:mt-0"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] bg-mist md:aspect-[11/10] md:rounded-[32px]">
          <Image
            src="/images/noida/4.webp"
            alt="Students and faculty at the LawPrep Noida centre"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-paper/95 px-3 py-1.5 text-[12px] font-bold shadow-float backdrop-blur md:top-5 md:left-5 md:text-[13px]">
            <VideoCameraIcon size={14} weight="fill" className="text-brand" /> Classroom + live online
          </span>
        </div>

        {/* How long each track runs, at a glance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease }}
          className="relative mt-2.5 rounded-[20px] bg-mist p-3.5 md:absolute md:-bottom-6 md:-left-8 md:mt-0 md:w-[300px] md:bg-paper/95 md:p-4 md:shadow-float md:backdrop-blur"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-3">Your runway</p>
          <ul className="mt-2 space-y-2">
            {programs.map((p, i) => (
              <li key={p.slug} className="flex items-center gap-3">
                <span className="w-[72px] shrink-0 text-[13px] font-bold">{p.name}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-paper md:bg-mist">
                  <motion.span
                    className="block h-full rounded-full bg-brand"
                    initial={{ width: 0 }}
                    animate={{ width: `${(p.months / 24) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.8 + i * 0.12, ease }}
                  />
                </span>
                <span className="tabular w-11 shrink-0 text-right text-[12px] font-semibold text-ink-3">{p.months} mo</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Batches() {
  return (
    <Block id="batches">
      <Reveal>
        <SectionHeader title="Choose your batch" subtitle="Same syllabus, different runway" />
      </Reveal>
      <Reveal delay={0.05} className="md:hidden">
        <CourseList />
      </Reveal>
      <Reveal delay={0.05} className="hidden md:block">
        <CourseGrid />
      </Reveal>
    </Block>
  );
}

function Compare() {
  const rows: { label: string; values: string[] }[] = [
    { label: "Best for", values: programs.map((p) => p.audience) },
    { label: "Duration", values: programs.map((p) => p.duration) },
    { label: "Teaching", values: programs.map((p) => courseDetails[p.slug].hours) },
    { label: "Schedule", values: programs.map((p) => courseDetails[p.slug].schedule) },
    { label: "Mode", values: programs.map(() => "Classroom + online") },
    { label: "Exams", values: programs.map(() => "CLAT · AILET") },
  ];

  return (
    <Block id="compare" className="scroll-mt-20">
      <Reveal>
        <SectionHeader title="Compare at a glance" subtitle="Everything that differs, side by side" />
        <div className="overflow-hidden rounded-[22px] bg-mist">
          <table className="w-full table-fixed text-left text-[13px] md:text-[15px]">
            <caption className="sr-only">Batch comparison</caption>
            <thead>
              <tr>
                <th scope="col" className="w-[22%] p-2 md:p-5">
                  <span className="sr-only">Feature</span>
                </th>
                {programs.map((p, i) => (
                  <th key={p.slug} scope="col" className="p-1 pt-2.5 md:p-5">
                    <span className={`block rounded-xl px-1.5 py-2 font-display text-[12px] font-bold tracking-[-0.01em] md:rounded-2xl md:px-4 md:py-3 md:text-[20px] ${i === 1 ? "bg-ink text-white" : "bg-paper"}`}>
                      {p.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.label}>
                  <th scope="row" className="p-2 pl-3 text-[12px] font-semibold text-ink-3 md:px-5 md:py-4 md:text-[15px]">
                    {r.label}
                  </th>
                  {r.values.map((v, i) => (
                    <td key={i} className="p-1 py-2.5 font-semibold leading-snug md:px-5 md:py-4">
                      <span className="block px-2 md:px-4">{v}</span>
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="hidden md:table-row">
                <td className="p-5" />
                {programs.map((p) => (
                  <td key={p.slug} className="px-5 pt-2 pb-5">
                    <EnquireButton interest={p.name} source="course" className={`${button("primary", "sm")} w-full`}>
                      Enquire
                    </EnquireButton>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <EnquireButton source="course" className={`${button("primary")} mt-3 w-full md:hidden`}>
          Help me pick a batch
        </EnquireButton>
      </Reveal>
    </Block>
  );
}

function Roadmap() {
  return (
    <Block>
      <Reveal>
        <SectionHeader title="How the year runs" subtitle="Each batch moves through three phases" />
        <CourseRoadmap />
      </Reveal>
    </Block>
  );
}

function Includes() {
  return (
    <Block>
      <Reveal>
        <SectionHeader title="Included in every batch" subtitle="No add-ons to buy later" />
        <ul className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-4">
          {includes.map((item, i) => (
            <li
              key={item.label}
              className={`flex flex-col gap-3 rounded-[22px] p-4 md:flex-row md:items-center md:gap-4 md:p-5 ${i === 0 ? "bg-brand text-white" : "bg-mist"}`}
            >
              <span className={`grid size-11 shrink-0 place-items-center rounded-[16px] ${i === 0 ? "bg-white/15" : "bg-paper text-brand"}`}>
                <item.icon size={22} weight="fill" />
              </span>
              <span className="min-w-0">
                <span className="block font-bold leading-tight">{item.label}</span>
                <span className={`mt-0.5 block text-[13px] leading-snug ${i === 0 ? "text-white/75" : "text-ink-3"}`}>{item.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </Block>
  );
}

function Ranks() {
  return (
    <Block>
      <Reveal>
        <SectionHeader
          title="Ranks from these batches"
          subtitle="CLAT 2026 · tap a card for the story"
          action={
            <Link href="/results" className="group flex shrink-0 items-center gap-1 pb-1 text-sm font-bold text-brand md:text-[15px]">
              See all
              <ArrowRightIcon size={15} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          }
        />
      </Reveal>
      <Reveal delay={0.08}>
        <RankWall />
      </Reveal>
    </Block>
  );
}

function Scholarship() {
  return (
    <Block>
      <Reveal className="relative overflow-hidden rounded-[28px] bg-brand p-6 text-white md:flex md:items-center md:justify-between md:gap-10 md:px-10 md:py-8">
        <SealPercentIcon aria-hidden size={220} weight="fill" className="pointer-events-none absolute -right-10 -bottom-14 text-white/[0.07]" />
        <div className="relative">
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-white/70">Scholarship test</p>
          <h2 className="mt-2 font-display text-[30px] font-extrabold leading-[1] tracking-[-0.03em] md:text-[40px]">Up to 100% off any batch.</h2>
          <p className="mt-2 max-w-md text-[15px] text-white/80">One test, and your score sets the fee waiver on whichever course you join.</p>
        </div>
        <div className="relative mt-5 grid grid-cols-2 gap-2.5 md:mt-0 md:flex md:shrink-0">
          <EnquireButton interest="Scholarship test" source="scholarship" className={`${button("white", "lg")} max-md:h-12 max-md:px-4 max-md:text-[15px]`}>
            Register
          </EnquireButton>
          <Link href="/scholarship" className={`${button("ink", "lg")} whitespace-nowrap bg-black/20 hover:bg-black/30 max-md:h-12 max-md:px-4 max-md:text-[15px]`}>
            How it works
          </Link>
        </div>
      </Reveal>
    </Block>
  );
}

function OtherWays() {
  return (
    <Block>
      <Reveal>
        <SectionHeader title="Other ways to study" subtitle="Tap one to ask about it" />
        <OtherFormats />
      </Reveal>
    </Block>
  );
}

function Faqs() {
  return (
    <Block className="md:grid md:grid-cols-[1fr_1.6fr] md:gap-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd(faqs))} />
      <Reveal>
        <SectionHeader title="Course questions" subtitle="Fees, timings and fit" />
        <p className="hidden max-w-xs text-[15px] leading-relaxed text-ink-2 md:block">
          Can&apos;t find your answer? Call us on{" "}
          <a href={site.phoneHref} className="font-semibold text-ink underline decoration-line-strong underline-offset-4">
            {site.phone}
          </a>
          .
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <Accordion items={faqs} />
      </Reveal>
    </Block>
  );
}

function Counsel() {
  return (
    <Block id="counsel" className="pb-12 md:pb-16">
      <Reveal className="overflow-hidden rounded-[28px] bg-ink text-white md:grid md:grid-cols-[1fr_1.05fr] md:rounded-[32px]">
        <div className="p-6 md:p-10">
          <p className="text-[13px] font-bold text-sun">Free counselling</p>
          <h2 className="mt-2 font-display text-[30px] font-bold leading-[1.02] tracking-[-0.03em] md:text-[40px]">Not sure which batch?</h2>
          <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-white/70">
            Leave your number and a counsellor will call you back, usually within a few hours.
          </p>
          <ul className="mt-5 space-y-2.5">
            {["Help choosing the right batch", "Current fees and timings", "Scholarship test dates"].map((line) => (
              <li key={line} className="flex items-center gap-2.5 text-[15px] font-semibold">
                <CheckCircleIcon size={20} weight="fill" className="shrink-0 text-brand" />
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-6 hidden items-center gap-2 text-sm text-white/60 md:flex">
            <ChalkboardTeacherIcon size={18} weight="fill" />
            Office hours {site.hours}
          </div>
        </div>
        <div className="m-2 rounded-[24px] bg-paper p-5 text-ink md:m-3 md:p-7">
          <EnquiryForm source="course" submitLabel="Get a call back" />
        </div>
      </Reveal>
    </Block>
  );
}
