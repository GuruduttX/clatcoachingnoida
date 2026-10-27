import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRightIcon, BellRingingIcon } from "@phosphor-icons/react/ssr";
import { EnquireButton } from "@/components/enquire-button";
import { PageHeader, SectionHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/site/section";
import { Stepper } from "@/components/site/stepper";
import { button } from "@/lib/ui";

export const metadata: Metadata = {
  title: "How to apply for CLAT",
  description: "The CLAT application, step by step: eligibility, registration on the Consortium portal, documents, admit card, results and NLU counselling.",
};

const CONSORTIUM = "https://consortiumofnlus.ac.in";
const NLU_DELHI = "https://nationallawuniversitydelhi.in";

// Deliberately free of dates and fees: they change every cycle, so the official notice is the source.
const steps = [
  { title: "Check eligibility", text: "Class 12 passed or appearing, with about 45% marks (40% for SC, ST and PwD)." },
  { title: "Register on the Consortium portal", text: "Create an account with your mobile number and email when applications open." },
  { title: "Fill in the form", text: "Personal and academic details, category, and your exam-centre preferences." },
  { title: "Upload documents and pay", text: "Photo, signature and any category certificate. The fee depends on your category." },
  { title: "Download the admit card", text: "It's released on the portal a few weeks before the exam. Check every detail on it." },
  { title: "Write the exam", text: "Reach the centre early with your admit card and a valid photo ID." },
  { title: "Results and counselling", text: "Register for counselling, rank your NLU preferences, and follow the allotment rounds." },
];

export default function HowToApplyPage() {
  return (
    <>
      <PageHeader eyebrow="How to apply" title="The CLAT form, step by step.">
        Seven steps from eligibility to your NLU seat.
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 md:grid md:grid-cols-[1.15fr_1fr] md:gap-16 md:px-6">
        <Reveal>
          <Stepper steps={steps} />
        </Reveal>

        <Reveal delay={0.06} className="mt-10 space-y-3 md:sticky md:top-24 md:mt-0 md:self-start">
          <a
            href={CONSORTIUM}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-[24px] bg-ink p-5 text-white transition active:scale-[0.98]"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[12px] font-bold text-sun">CLAT UG</span>
              <span className="block font-display text-[21px] font-bold leading-tight">Consortium of NLUs</span>
              <span className="block truncate text-sm text-white/60">consortiumofnlus.ac.in</span>
            </span>
            <ArrowUpRightIcon size={20} weight="bold" />
          </a>
          <a
            href={NLU_DELHI}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-[24px] bg-mist p-5 transition hover:bg-fog active:scale-[0.98]"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[12px] font-bold text-brand">AILET</span>
              <span className="block font-display text-[21px] font-bold leading-tight">NLU Delhi applies separately</span>
              <span className="block truncate text-sm text-ink-2">nationallawuniversitydelhi.in</span>
            </span>
            <ArrowUpRightIcon size={20} weight="bold" className="text-ink-3" />
          </a>
          <div className="rounded-[24px] bg-sun p-5">
            <BellRingingIcon size={26} weight="fill" />
            <p className="mt-3 font-display text-[21px] font-bold leading-tight tracking-[-0.02em]">Don&apos;t miss the window</p>
            <p className="mt-1 text-sm font-medium text-ink/70">
              Dates are announced by the Consortium each year. Leave your number and we&apos;ll remind you when the form opens.
            </p>
            <EnquireButton source="other" interest="Not sure yet" className={`${button("ink")} mt-4 w-full`}>
              Remind me
            </EnquireButton>
          </div>
        </Reveal>
      </div>

      <Section className="pb-14 md:pb-28">
        <Reveal>
          <SectionHeader title="Still unsure?" subtitle="Quick answers on eligibility, the form and counselling" />
          <div className="flex flex-wrap gap-2.5">
            <Link href="/faq/eligibility-registration" className={button("quiet", "lg")}>
              Eligibility FAQs
            </Link>
            <Link href="/faq/nlus-counselling" className={button("quiet", "lg")}>
              Counselling FAQs
            </Link>
            <Link href="/resources/nlu-profiles" className={button("outline", "lg")}>
              Compare NLUs
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
