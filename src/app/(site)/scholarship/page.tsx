import type { Metadata } from "next";
import { BookOpenTextIcon, BrainIcon, CalculatorIcon, CalendarBlankIcon, NewspaperIcon, ScalesIcon } from "@phosphor-icons/react/ssr";
import { Accordion } from "@/components/accordion";
import { EnquireButton } from "@/components/enquire-button";
import { SectionHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { ScholarshipSlabs } from "@/components/site/scholarship-slabs";
import { Section } from "@/components/site/section";
import { Stepper } from "@/components/site/stepper";
import { button } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Scholarship test",
  description:
    "Take LawPrep Tutorial's scholarship test at the Noida centre or online and earn up to 100% off your CLAT coaching fees. 60 questions, 60 minutes.",
};

const sections = [
  { label: "Legal Reasoning", icon: ScalesIcon },
  { label: "Logical Reasoning", icon: BrainIcon },
  { label: "Reading Comprehension", icon: BookOpenTextIcon },
  { label: "GK & Current Affairs", icon: NewspaperIcon },
  { label: "Quantitative Techniques", icon: CalculatorIcon },
];

const faqs = [
  {
    question: "Who can take the scholarship test?",
    answer: "Any new student joining a course can usually take it. If a class or batch restriction applies this cycle, the counsellor will tell you before you register.",
  },
  {
    question: "When is the next test?",
    answer: "The test runs regularly through the year. Register and the Noida team will confirm the nearest date for you.",
  },
  {
    question: "Is it online or at the centre?",
    answer: "Both are usually available. Tell us your preference when you register.",
  },
  {
    question: "Does it work for both CLAT and AILET courses?",
    answer: "Yes. The waiver applies to whichever course you finally enrol in.",
  },
  {
    question: "How is the waiver applied?",
    answer: "Once your slab is confirmed, the waiver comes off your course fee at enrolment. If there's a validity window this cycle, the counsellor will tell you.",
  },
];

export default function ScholarshipPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-2 md:px-6 md:pt-10">
        <Reveal className="relative overflow-hidden rounded-[28px] bg-sun p-6 md:rounded-[36px] md:p-12">
          <p className="inline-flex rounded-full bg-ink/10 px-3 py-1 text-[12px] font-bold uppercase tracking-[0.12em]">Scholarship test</p>
          <h1 className="mt-4 max-w-2xl font-display text-[42px] font-extrabold leading-[0.95] tracking-[-0.04em] md:text-[76px]">
            Up to 100% off your fees.
          </h1>
          <p className="mt-3 max-w-md text-[16px] leading-relaxed text-ink/75">One test. Your score sets the waiver.</p>
          <dl className="mt-6 grid max-w-lg grid-cols-3 gap-2">
            {[
              { k: "Questions", v: "60" },
              { k: "Minutes", v: "60" },
              { k: "Marking", v: "+1 / −0.25" },
            ].map((f) => (
              <div key={f.k} className="rounded-[18px] bg-paper/60 px-3 py-3">
                <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink/55">{f.k}</dt>
                <dd className="tabular mt-0.5 font-display text-[22px] font-extrabold leading-none tracking-tight md:text-[28px]">{f.v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <EnquireButton interest="Scholarship test" source="scholarship" className={button("ink", "lg")}>
              Register for the test
            </EnquireButton>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/70">
              <CalendarBlankIcon size={16} weight="bold" /> Next date: to be announced
            </span>
          </div>
        </Reveal>
      </div>

      <Section className="md:grid md:grid-cols-[1fr_1.1fr] md:gap-16">
        <Reveal>
          <SectionHeader title="Your score, your waiver" subtitle="Switch between the centre and online tests" />
          <div className="hidden md:block">
            <Stepper
              steps={[
                { title: "Register", text: "Pick the centre or online test and get your slot confirmed." },
                { title: "Write the test", text: "60 questions in 60 minutes, in the CLAT pattern." },
                { title: "Get your slab", text: "The waiver comes off your fee when you enrol." },
              ]}
            />
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <ScholarshipSlabs />
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <SectionHeader title="What's in the test" subtitle="A short CLAT-pattern paper across five sections" />
          <ul className="grid grid-cols-2 gap-2.5 md:grid-cols-5 md:gap-4">
            {sections.map((s, i) => (
              <li
                key={s.label}
                className={`flex flex-col gap-4 rounded-[22px] p-4 md:p-5 ${i === 0 ? "col-span-2 bg-ink text-white md:col-span-1" : "bg-mist"}`}
              >
                <span className={`grid size-11 place-items-center rounded-[16px] ${i === 0 ? "bg-white/10 text-sun" : "bg-paper text-brand"}`}>
                  <s.icon size={22} weight="fill" />
                </span>
                <span className="font-bold leading-tight">{s.label}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section className="md:hidden">
        <Reveal>
          <SectionHeader title="How it works" />
          <Stepper
            steps={[
              { title: "Register", text: "Pick the centre or online test and get your slot confirmed." },
              { title: "Write the test", text: "60 questions in 60 minutes, in the CLAT pattern." },
              { title: "Get your slab", text: "The waiver comes off your fee when you enrol." },
            ]}
          />
        </Reveal>
      </Section>

      <Section className="pb-14 md:pb-28">
        <Reveal>
          <SectionHeader title="Questions" />
          <Accordion items={faqs} />
          <EnquireButton interest="Scholarship test" source="scholarship" className={`${button("primary", "lg")} mt-6 w-full sm:w-auto`}>
            Register for the test
          </EnquireButton>
        </Reveal>
      </Section>
    </>
  );
}
