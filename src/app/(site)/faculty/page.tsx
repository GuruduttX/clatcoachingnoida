import type { Metadata } from "next";
import type { ReactNode } from "react";
import * as motion from "motion/react-client";
import { CheckCircleIcon, ChalkboardTeacherIcon, PhoneIcon } from "@phosphor-icons/react/ssr";
import { Accordion } from "@/components/accordion";
import { faqJsonLd, jsonLd } from "@/components/content/doc";
import { CountUp } from "@/components/count-up";
import { EnquireButton } from "@/components/enquire-button";
import { EnquiryForm } from "@/components/enquiry";
import { SectionHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { PersonPhoto } from "@/components/site/avatar";
import {
  DirectorPanels,
  ExperienceRuler,
  FacultyProvider,
  SectionFinder,
  StaffMosaic,
  TeachingThreads,
  type Mentor,
} from "@/components/site/faculty-sections";
import {
  FACULTY_SUBJECTS,
  facultyExperience,
  facultyMembers,
  facultySubjects,
  getFacultyProfileBySlug,
  publicCredential,
} from "@/lib/faculty";
import { site } from "@/lib/site";
import { button } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Faculty",
  description:
    "Meet the CLAT and AILET mentors who teach at LawPrep Tutorial's Noida centre: legal reasoning, critical reasoning, English, GK and quant.",
  alternates: { canonical: "/faculty" },
};

const ease = [0.22, 1, 0.36, 1] as const;

const mentors: Mentor[] = facultyMembers.map((m) => {
  const profile = getFacultyProfileBySlug(m.slug);
  return {
    slug: m.slug,
    name: m.name,
    title: m.title,
    role: m.role,
    image: m.image,
    director: m.group === "director",
    credential: publicCredential(m),
    years: facultyExperience(m.slug),
    subjects: facultySubjects(m),
    expertise: m.expertise,
    summary: profile?.backgroundDescription ?? m.bio,
    points: profile?.teachingPoints ?? [],
  };
});

const years = mentors.flatMap((m) => (m.years ? [m.years] : []));
const totalYears = years.reduce((a, b) => a + b, 0);
const directors = mentors.filter((m) => m.director);
const nluGrads = facultyMembers.filter((m) => /national law university/i.test(publicCredential(m) ?? ""));

const faqs = [
  {
    question: "Who teaches at the Noida centre?",
    answer: `${mentors.length} mentors cover every CLAT section: Legal Reasoning, Logical and Critical Reasoning, English, GK and Current Affairs, and Quantitative Techniques. Three of them, ${directors
      .map((d) => d.name)
      .join(", ")
      .replace(/, ([^,]*)$/, " and $1")}, are also directors. The Noida centre shares its faculty team with LawPrep's other Delhi NCR centres.`,
  },
  {
    question: "Are the mentors NLU graduates?",
    answer: `${nluGrads.map((m) => m.name).join(" and ")} both hold a B.A. LL.B. from National Law University, Bhopal. Each mentor's qualifications are on their profile, and we only list credentials once they're verified.`,
  },
  {
    question: "How much teaching experience do they have?",
    answer: `${totalYears}+ years between them, from ${Math.min(...years)}+ to ${Math.max(...years)}+ years each, as listed on their profiles.`,
  },
  {
    question: "Will I get one-to-one mentoring?",
    answer: "Yes. Every batch includes 1:1 mentorship, with a mentor who tracks your scores. Every mentor on this page lists individual mentoring as part of how they teach.",
  },
];

// Tighter desktop rhythm than the shared Section, matching the home page.
function Block({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-4 pt-10 md:px-6 md:pt-16 ${className}`}>
      {children}
    </section>
  );
}

export default function FacultyPage() {
  return (
    <FacultyProvider mentors={mentors}>
      <Hero />
      <Finder />
      <Directors />
      <Experience />
      <Threads />
      <AskUs />
      <Faqs />
    </FacultyProvider>
  );
}

function Hero() {
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  });

  return (
    <section className="mx-auto max-w-6xl px-4 pt-2 md:grid md:grid-cols-[1fr_1.05fr] md:items-center md:gap-12 md:px-6 md:pt-8">
      <div className="min-w-0">
        <motion.p {...rise(0)} className="inline-flex items-center gap-2 rounded-full bg-brand-tint px-3 py-1 text-[13px] font-bold text-brand-deep">
          <ChalkboardTeacherIcon size={14} weight="fill" /> Faculty · Noida centre
        </motion.p>
        <motion.h1
          {...rise(0.06)}
          className="mt-3 font-display text-[38px] font-bold leading-[0.98] tracking-[-0.04em] sm:text-[52px] lg:text-[60px]"
        >
          A mentor for <span className="text-brand">every section.</span>
        </motion.h1>
        <motion.p {...rise(0.12)} className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-2 md:mt-4 md:text-[17px]">
          {mentors.length} mentors teach Legal, Reasoning, English, GK and Quant, and three of them are directors. Tap anyone to see how they teach.
        </motion.p>

        <motion.div {...rise(0.18)} className="mt-5 grid grid-cols-2 gap-2.5 md:mt-7 md:flex md:gap-3">
          <EnquireButton source="faculty" className={`${button("primary", "lg")} max-md:h-12 max-md:px-4 max-md:text-[15px]`}>
            <PhoneIcon size={18} weight="fill" /> <span className="md:hidden">Get a call</span>
            <span className="hidden md:inline">Book a counselling call</span>
          </EnquireButton>
          <a href="#find" className={`${button("outline", "lg")} max-md:h-12 max-md:px-4 max-md:text-[15px]`}>
            Find your mentor
          </a>
        </motion.div>

        <motion.dl {...rise(0.24)} className="mt-5 grid grid-cols-3 gap-2 md:mt-8 md:max-w-md">
          {[
            { v: mentors.length, k: "mentors" },
            { v: totalYears, suffix: "+", k: "years teaching, combined" },
            { v: FACULTY_SUBJECTS.length, k: "CLAT sections covered" },
          ].map((s) => (
            <div key={s.k} className="flex flex-col-reverse justify-end rounded-[18px] bg-mist px-3 py-3 md:bg-transparent md:p-0">
              <dt className="mt-1 text-[12px] font-semibold leading-tight text-ink-3 md:text-[13px]">{s.k}</dt>
              <dd className="font-display text-[22px] font-extrabold leading-none tracking-tight md:text-[28px]">
                <CountUp to={s.v} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      <div className="mt-6 md:mt-0">
        <StaffMosaic />
      </div>
    </section>
  );
}

function Finder() {
  return (
    <Block id="find" className="scroll-mt-20">
      <Reveal>
        <SectionHeader title="Find your mentor" subtitle="Tap the section you find hardest" />
        <SectionFinder />
      </Reveal>
    </Block>
  );
}

function Directors() {
  return (
    <Block>
      <Reveal>
        <SectionHeader title="The directors" subtitle="They teach, and they lead the academic team" />
      </Reveal>
      <Reveal delay={0.06}>
        <DirectorPanels />
      </Reveal>
    </Block>
  );
}

function Experience() {
  return (
    <Block className="md:grid md:grid-cols-[1fr_1.6fr] md:items-center md:gap-12">
      <Reveal>
        <SectionHeader title="Years at the board" subtitle="Teaching experience, from each profile" />
        <p className="flex items-baseline gap-2">
          <span className="font-display text-[56px] font-extrabold leading-none tracking-[-0.04em] text-brand md:text-[72px]">
            <CountUp to={totalYears} suffix="+" />
          </span>
          <span className="text-[15px] font-bold text-ink-2">years between them</span>
        </p>
        <p className="mt-2 mb-5 max-w-xs text-[15px] leading-relaxed text-ink-2 md:mb-0">
          From {Math.min(...years)}+ to {Math.max(...years)}+ years each, teaching CLAT and other law entrance exams.
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <ExperienceRuler />
      </Reveal>
    </Block>
  );
}

function Threads() {
  return (
    <Block>
      <Reveal>
        <SectionHeader title="What their classes share" subtitle="Themes that run through every profile" />
      </Reveal>
      <Reveal delay={0.06}>
        <TeachingThreads />
      </Reveal>
    </Block>
  );
}

function AskUs() {
  return (
    <Block id="ask">
      <Reveal className="overflow-hidden rounded-[28px] bg-brand text-white md:grid md:grid-cols-[1fr_1fr] md:items-center md:rounded-[32px]">
        <div className="p-6 pb-5 md:p-10">
          <div className="flex -space-x-3">
            {directors.map((d) => (
              <span key={d.slug} className="relative size-12 overflow-hidden rounded-full bg-white/15 ring-[3px] ring-brand">
                <PersonPhoto src={d.image} name={d.name} sizes="48px" />
              </span>
            ))}
          </div>
          <h2 className="mt-4 font-display text-[30px] font-bold leading-[1.02] tracking-[-0.03em] md:text-[40px]">Not sure who you need?</h2>
          <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-white/80">
            Leave your number and a counsellor will call you back, usually within a few hours.
          </p>
          <ul className="mt-4 space-y-2">
            {["Which mentors teach your batch", "Current fees and timings", "Scholarship test dates"].map((line) => (
              <li key={line} className="flex items-center gap-2.5 text-[15px] font-semibold">
                <CheckCircleIcon size={19} weight="fill" className="shrink-0 text-white" />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div className="m-2 rounded-[24px] bg-paper p-5 text-ink md:m-3 md:p-7">
          <EnquiryForm source="faculty" submitLabel="Get a call back" compact />
        </div>
      </Reveal>
    </Block>
  );
}

function Faqs() {
  return (
    <Block className="pb-12 md:grid md:grid-cols-[1fr_1.6fr] md:gap-12 md:pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd(faqs))} />
      <Reveal>
        <SectionHeader title="Faculty questions" subtitle="Qualifications, experience and mentoring" />
        <p className="hidden max-w-xs text-[15px] leading-relaxed text-ink-2 md:block">
          Something else? Call us on{" "}
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
