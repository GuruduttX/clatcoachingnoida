import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, CurrencyInrIcon } from "@phosphor-icons/react/ssr";
import { Accordion } from "@/components/accordion";
import { EnquireButton } from "@/components/enquire-button";
import { PageHeader, SectionHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/site/section";
import { Stepper } from "@/components/site/stepper";
import { programs } from "@/lib/data";
import { button } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Admissions",
  description: "How to join LawPrep Tutorial's Noida centre: free counselling, batch placement, the scholarship test and enrolment.",
};

const steps = [
  { title: "Free counselling", text: "Call, WhatsApp or walk in. We talk about your class, your target and how much time you have." },
  { title: "Get placed", text: "You're matched to the right course and batch, not pushed into one starting point for everyone." },
  { title: "Scholarship test", text: "Optional, and worth taking. Your score can bring the fee down by up to 100%." },
  { title: "Enrol and start", text: "Finish registration and pay the fee. Books, LMS access and your test schedule follow." },
];

// Eligibility basics as published on the Delhi NCR site; students should confirm each cycle's rules.
const eligibility = [
  { label: "Qualification", value: "Class 12 pass, or appearing" },
  { label: "Minimum marks", value: "45% (40% SC/ST/PwD)" },
  { label: "Age limit", value: "None, usually" },
  { label: "Exams", value: "CLAT · AILET" },
];

const faqs = [
  {
    question: "How do I join the Noida centre?",
    answer:
      "Book a free counselling session by phone, WhatsApp or a visit, get placed into the right course and batch, then complete enrolment. Most families finish it in one visit.",
  },
  {
    question: "Is the counselling free?",
    answer: "Yes. It's there to place you in the right batch, and there's no obligation to join.",
  },
  {
    question: "Do I have to choose between CLAT and AILET?",
    answer:
      "No. The courses are built with both in view. The two exams overlap heavily; AILET has its own pattern and leaves out the quantitative section.",
  },
  {
    question: "What are the eligibility rules?",
    answer:
      "Both exams generally need Class 12 with about 45% marks (40% for SC, ST and PwD), and there's usually no upper age limit. Always confirm the current cycle's rules with the Consortium of NLUs and NLU Delhi.",
  },
];

export default function AdmissionsPage() {
  return (
    <>
      <PageHeader eyebrow="Admissions" title="Joining takes one visit.">
        Four steps from first call to first class.
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 md:grid md:grid-cols-[1.1fr_1fr] md:gap-16 md:px-6">
        <Reveal>
          <Stepper steps={steps} />
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <EnquireButton source="admissions" className={button("primary", "lg")}>
              Book free counselling
            </EnquireButton>
            <Link href="/visit" className={button("outline", "lg")}>
              Visit the centre
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.06} className="mt-10 md:mt-0">
          <div className="rounded-[26px] bg-ink p-5 text-white md:p-7">
            <p className="text-[13px] font-bold text-sun">Which course?</p>
            <p className="mt-1 font-display text-[24px] font-bold leading-tight tracking-[-0.02em]">Start from where you are.</p>
            <ul className="mt-5 space-y-2">
              {programs.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/courses/${p.slug}`}
                    className="flex items-center justify-between gap-3 rounded-[18px] bg-white/[0.07] px-4 py-3.5 transition hover:bg-white/[0.12] active:scale-[0.98]"
                  >
                    <span>
                      <span className="block text-[12px] font-semibold text-white/50">{p.audience}</span>
                      <span className="block font-bold">
                        {p.name} · {p.duration}
                      </span>
                    </span>
                    <ArrowRightIcon size={16} weight="bold" className="text-white/50" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <Section>
        <Reveal>
          <SectionHeader title="Who can take CLAT" subtitle="Confirm each year's rules with the Consortium of NLUs" />
          <dl className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4">
            {eligibility.map((f) => (
              <div key={f.label} className="rounded-[20px] bg-mist px-4 py-4 md:px-5 md:py-5">
                <dt className="text-[12px] font-semibold text-ink-3">{f.label}</dt>
                <dd className="mt-1 font-display text-[18px] font-bold leading-tight tracking-[-0.01em] md:text-[21px]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>

      <Section>
        <Reveal className="flex flex-col gap-4 rounded-[26px] bg-sun p-5 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-[18px] bg-ink text-sun">
              <CurrencyInrIcon size={24} weight="bold" />
            </span>
            <div>
              <p className="font-display text-[21px] font-bold leading-tight tracking-[-0.02em] md:text-[26px]">Fees</p>
              <p className="text-sm font-medium text-ink/70">Depend on the course and your scholarship slab. Ask for this year&apos;s fee.</p>
            </div>
          </div>
          <EnquireButton source="admissions" interest="Not sure yet" className={`${button("ink", "lg")} shrink-0`}>
            Ask about fees
          </EnquireButton>
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
