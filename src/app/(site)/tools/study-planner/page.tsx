import type { Metadata } from "next";
import { Accordion } from "@/components/accordion";
import { PageHeader, SectionHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/site/section";
import { Stepper } from "@/components/site/stepper";
import { StudyPlanner } from "@/components/site/study-planner";

export const metadata: Metadata = {
  title: "CLAT & AILET study planner",
  description:
    "Free CLAT and AILET study planner. Pick your exam and daily study hours and get a topic-wise plan with remaining hours and a realistic end date for your preparation.",
  alternates: { canonical: "/tools/study-planner" },
};

const runways = [
  { k: "A year left", v: "3–4 hrs" },
  { k: "6 months left", v: "5–6 hrs" },
  { k: "3 months left", v: "7–8 hrs" },
];

const faqs = [
  {
    question: "How is the end date worked out?",
    answer: "The planner adds up the hours for every topic you haven't finished and divides them by your daily study hours. That gives the number of study days left, counted from today.",
  },
  {
    question: "What if my end date is after the exam?",
    answer: "Increase your daily hours until the end date lands with a few weeks to spare for mocks and revision. If that isn't realistic, talk to a counsellor about which topics to prioritise.",
  },
  {
    question: "Is my progress saved?",
    answer: "Yes, on this device. Tick topics off as you finish them and the planner remembers them the next time you open it in the same browser.",
  },
  {
    question: "Is it free?",
    answer: "Completely. We only ask for a name and number so a counsellor can help if you get stuck.",
  },
];

export default function StudyPlannerPage() {
  return (
    <>
      <PageHeader eyebrow="Free tool" title="CLAT & AILET study planner">
        Plan your prep with real numbers. See every topic, the hours left and when you&apos;ll finish.
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <StudyPlanner />
      </div>

      <Section>
        <Reveal>
          <SectionHeader title="How many hours a day?" subtitle="Focused hours you track beat long, distracted ones" />
          <dl className="grid grid-cols-3 gap-2.5 md:gap-4">
            {runways.map((r, i) => (
              <div key={r.k} className={`rounded-[22px] p-4 md:p-6 ${i === 0 ? "bg-brand text-white" : "bg-mist"}`}>
                <dt className={`text-[12px] font-bold leading-tight md:text-sm ${i === 0 ? "text-white/80" : "text-ink-2"}`}>{r.k}</dt>
                <dd className="tabular mt-3 font-display text-[22px] font-extrabold leading-none tracking-tight md:text-[36px]">{r.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <SectionHeader title="How it works" />
          <Stepper
            steps={[
              { title: "Set your hours", text: "Choose CLAT or AILET and enter how many hours you can study each day." },
              { title: "Get your plan", text: "Every topic in every section of your exam, with the hours each one takes." },
              { title: "Tick topics off", text: "Remaining hours and your end date update as you go." },
            ]}
          />
        </Reveal>
      </Section>

      <Section className="pb-14 md:pb-28">
        <Reveal>
          <SectionHeader title="Questions" />
          <Accordion items={faqs} />
        </Reveal>
      </Section>
    </>
  );
}
