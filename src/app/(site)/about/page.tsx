import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, BookOpenTextIcon, BrainIcon, NewspaperIcon, TimerIcon } from "@phosphor-icons/react/ssr";
import { Accordion } from "@/components/accordion";
import { CountUp } from "@/components/count-up";
import { EnquireButton } from "@/components/enquire-button";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/page-header";
import { PersonPhoto } from "@/components/site/avatar";
import { Section } from "@/components/site/section";
import { directorMembers } from "@/lib/faculty";
import { ncrCentres, noidaToppers } from "@/lib/data";
import { button } from "@/lib/ui";

export const metadata: Metadata = {
  title: "About us",
  description:
    "LawPrep Tutorial's Noida centre is part of the Delhi NCR branch of LawPrep Tutorial: 1310+ NLU selections in 23+ years of CLAT and AILET coaching.",
};

const method = [
  { icon: BookOpenTextIcon, title: "Reading first", text: "CLAT and AILET are reading-and-reasoning exams, not memory tests." },
  { icon: TimerIcon, title: "Accuracy, then speed", text: "Accuracy comes first. Timed pressure is added once it's steady." },
  { icon: BrainIcon, title: "Frameworks, not tricks", text: "Legal and logical reasoning taught as methods you can repeat." },
  { icon: NewspaperIcon, title: "GK as a habit", text: "Current affairs revised all year, never crammed at the end." },
];

// Adapted from the Delhi NCR site's About FAQs.
const faqs = [
  {
    question: "Is the Noida centre part of LawPrep Tutorial?",
    answer:
      "Yes. It is one of the five Delhi NCR centres of LawPrep Tutorial and follows the same preparation framework, faculty team and test series as the other centres.",
  },
  {
    question: "What makes the teaching different?",
    answer:
      "We teach CLAT and AILET as comprehension-and-reasoning exams. Reading speed, reasoning frameworks, timed practice and current-affairs revision are connected instead of taught as separate topics.",
  },
  {
    question: "Who teaches the classes?",
    answer:
      "The academic framework is led by Anand Sharma, Advocate and NLIU Bhopal alumnus, with a team of subject mentors. You can meet all of them on the Faculty screen.",
  },
  {
    question: "Do you only coach for CLAT?",
    answer:
      "No. Students prepare for both CLAT and AILET. The papers overlap heavily, but AILET has its own pattern, so the teaching keeps both in view.",
  },
  {
    question: "How can I check your results?",
    answer: "The Results screen lists named CLAT 2026 ranks from this centre, each with the student's score and NLU.",
  },
];

export default function AboutPage() {
  return (
    <>
      <header className="mx-auto max-w-6xl px-4 pt-2 md:px-6 md:pt-10">
        <div className="relative overflow-hidden rounded-[28px] bg-ink md:rounded-[36px]">
          <div className="relative aspect-[4/3] md:aspect-[21/8]">
            <Image
              src="/images/noida/4.webp"
              alt="Students and faculty in front of the LawPrep banner at the Noida centre"
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 768px) 1100px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-black/5" />
          </div>
          <div className="absolute inset-x-5 bottom-5 text-white md:inset-x-10 md:bottom-9">
            <p className="text-[13px] font-bold text-sun">About us</p>
            <h1 className="mt-1.5 max-w-2xl font-display text-[36px] font-bold leading-[0.98] tracking-[-0.04em] md:text-[64px]">
              LawPrep Tutorial, right here in Noida.
            </h1>
          </div>
        </div>
      </header>

      <Section className="pt-3 md:pt-4">
        <Reveal className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4">
          {[
            { value: 1310, suffix: "+", label: "NLU selections", tone: "bg-ink text-white", sub: "text-white/65" },
            { value: 23, suffix: "+", label: "years of coaching", tone: "bg-brand text-white", sub: "text-white/75" },
            { value: 5, suffix: "", label: "Delhi NCR centres", tone: "bg-sun", sub: "text-ink/70" },
            { value: noidaToppers.length, suffix: "", label: "CLAT 2026 ranks from Noida", tone: "bg-mist", sub: "text-ink-2" },
          ].map((s) => (
            <div key={s.label} className={`rounded-[22px] p-4 md:p-6 ${s.tone}`}>
              <p className="font-display text-[38px] font-extrabold leading-none tracking-[-0.04em] md:text-[52px]">
                <CountUp to={s.value} suffix={s.suffix} />
              </p>
              <p className={`mt-1.5 text-[13px] font-semibold leading-snug md:text-[15px] ${s.sub}`}>{s.label}</p>
            </div>
          ))}
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <SectionHeader title="How we teach" subtitle="Four ideas behind every class" />
        </Reveal>
        <Reveal delay={0.06}>
          <ul className="rail -mx-4 scroll-pl-4 gap-3 px-4 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0">
            {method.map((m, i) => (
              <li key={m.title} className="w-[70%] shrink-0 sm:w-[42%] md:w-auto">
                <div className="flex h-full flex-col rounded-[24px] border border-line p-5">
                  <span className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-[16px] bg-brand-tint text-brand">
                      <m.icon size={22} weight="fill" />
                    </span>
                    <span className="tabular font-display text-[15px] font-bold text-ink-3">0{i + 1}</span>
                  </span>
                  <p className="mt-6 font-display text-[21px] font-bold leading-tight tracking-[-0.02em]">{m.title}</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{m.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <SectionHeader
            title="Who leads the academics"
            subtitle="Directors and academic mentors"
            action={
              <Link href="/faculty" className="group flex shrink-0 items-center gap-1 pb-1 text-sm font-bold text-brand md:text-[15px]">
                All faculty <ArrowRightIcon size={15} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            }
          />
        </Reveal>
        <Reveal delay={0.06}>
          <ul className="rail -mx-4 scroll-pl-4 gap-3 px-4 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0">
            {directorMembers.map((m) => (
              <li key={m.slug} className="w-[62%] shrink-0 sm:w-[40%] md:w-auto">
                <Link href={`/faculty/${m.slug}`} className="group block active:scale-[0.98]">
                  <span className="relative block aspect-[4/5] overflow-hidden rounded-[22px] bg-mist">
                    <PersonPhoto src={m.image} name={m.name} sizes="(min-width: 768px) 30vw, 60vw" className="transition duration-700 group-hover:scale-[1.04]" />
                    <span className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent" />
                    <span className="absolute inset-x-4 bottom-4 text-white">
                      <span className="block font-display text-[22px] font-bold leading-tight">{m.name}</span>
                      <span className="block text-[13px] text-white/75">{m.role}</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section>
        <Reveal className="rounded-[28px] bg-sun p-6 md:grid md:grid-cols-[1fr_1.2fr] md:items-center md:gap-10 md:rounded-[36px] md:p-10">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-ink/60">One institute, five centres</p>
            <h2 className="mt-2 font-display text-[30px] font-extrabold leading-[1] tracking-[-0.03em] md:text-[44px]">
              Same faculty and tests across Delhi NCR.
            </h2>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2 md:mt-0">
            <li className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">Noida · Sector 62</li>
            {ncrCentres.map((c) => (
              <li key={c.name} className="rounded-full bg-paper/70 px-4 py-2 text-sm font-semibold">
                {c.name} <span className="text-ink-3">· {c.area}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section className="pb-14 md:pb-28">
        <Reveal>
          <SectionHeader title="Questions" />
          <Accordion items={faqs} />
          <div className="mt-6 flex flex-wrap gap-2.5">
            <EnquireButton source="other" className={button("primary", "lg")}>
              Book a counselling call
            </EnquireButton>
            <Link href="/visit" className={button("outline", "lg")}>
              Visit the centre
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
