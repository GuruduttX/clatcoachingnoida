import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";
import {
  ArrowRightIcon,
  CalendarBlankIcon,
  ClockIcon,
  PhoneIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/ssr";
import { BatchFinder } from "@/components/batch-finder";
import { CountUp } from "@/components/count-up";
import { EnquireButton } from "@/components/enquire-button";
import { Gallery } from "@/components/gallery";
import { Greeting, OpenStatus } from "@/components/live";
import { QuickActions } from "@/components/quick-actions";
import { RankWall } from "@/components/rank-wall";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/page-header";
import { StoryRail } from "@/components/story-rail";
import { HomeExplore, HomeFaculty, HomeFaq, HomeReviews } from "@/components/site/home-sections";
import { academicHead, noidaToppers } from "@/lib/data";
import { site, whatsappLink } from "@/lib/site";
import { button } from "@/lib/ui";

const ease = [0.22, 1, 0.36, 1] as const;

function SeeAll({ href, label = "See all" }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="group flex shrink-0 items-center gap-1 pb-1 text-sm font-bold text-brand md:text-[15px]"
    >
      {label}
      <ArrowRightIcon size={15} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-6xl px-4 md:hidden">
        <QuickActions />
      </div>
      <Numbers />
      <Batches />
      <Ranks />
      <HomeReviews />
      <Scholarship />
      <Mentor />
      <HomeFaculty />
      <Inside />
      <HomeExplore />
      <VisitCard />
      <HomeFaq />
    </>
  );
}

function Hero() {
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  });
  const samiksha = noidaToppers[0];

  return (
    <section className="mx-auto max-w-6xl px-4 pt-2 pb-7 md:grid md:grid-cols-[1.15fr_1fr] md:items-center md:gap-12 md:px-6 md:pt-8 md:pb-12">
      <div className="min-w-0">
        <motion.p {...rise(0)} className="text-[15px] font-semibold text-ink-3">
          <Greeting />
        </motion.p>
        <motion.h1
          {...rise(0.06)}
          className="mt-1 font-display text-[38px] font-bold leading-[0.98] tracking-[-0.04em] sm:text-[52px] lg:text-[60px]"
        >
          CLAT coaching, right here in{" "}
          <span className="relative isolate inline-block whitespace-nowrap">
            <motion.span
              aria-hidden
              className="absolute inset-x-[-0.08em] bottom-[0.04em] -z-10 h-[0.42em] origin-left -rotate-1 rounded-[0.12em] bg-sun"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease }}
            />
            Noida.
          </span>
        </motion.h1>
        <motion.p
          {...rise(0.12)}
          className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-2 md:mt-4 md:text-[17px]"
        >
          LawPrep Tutorial&apos;s Noida centre. Classroom and online batches for CLAT &amp; AILET, from
          Class 11 to repeat attempts.
        </motion.p>

        <motion.div {...rise(0.18)} className="mt-6 hidden gap-3 md:flex">
          <EnquireButton className={button("primary", "lg")}>Book a counselling call</EnquireButton>
          <Link href="/courses" className={button("outline", "lg")}>
            Explore batches
          </Link>
        </motion.div>

        <motion.div {...rise(0.22)} className="mt-6 md:mt-8">
          <p className="mb-3 hidden text-[13px] font-semibold text-ink-3 md:block">
            Tap a story · CLAT 2026 ranks from this centre
          </p>
          <StoryRail />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.15, ease }}
        className="relative mt-5 md:mt-0"
      >
        <div className="relative aspect-[5/4] overflow-hidden rounded-[28px] bg-mist md:aspect-[11/10] md:rounded-[32px]">
          <Image
            src="/images/noida/5.webp"
            alt="Students writing a timed test in a classroom at the Noida centre"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 md:inset-x-6 md:bottom-6">
            <div className="text-white">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/70">Inside the Noida centre</p>
              <p className="mt-1 font-display text-[22px] font-bold leading-tight tracking-[-0.02em] md:text-[28px]">
                Prepare in a real classroom.
              </p>
            </div>
            <EnquireButton className={`${button("primary", "sm")} shrink-0 md:hidden`}>Enquire</EnquireButton>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease }}
          className="absolute top-4 left-4 md:top-8 md:-left-8"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2.5 rounded-full bg-paper/95 py-1.5 pr-4 pl-1.5 shadow-float backdrop-blur"
          >
            <span className="relative size-9 overflow-hidden rounded-full bg-mist">
              <Image src={samiksha.photo} alt="" fill sizes="36px" className="object-cover object-top" />
            </span>
            <span className="leading-tight">
              <span className="block text-[13px] font-extrabold">
                AIR {samiksha.air} · {samiksha.name}
              </span>
              <span className="block text-[11px] font-semibold text-ink-3">
                {samiksha.nlu} {samiksha.city}
              </span>
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.85, ease }}
          className="absolute top-1/2 -right-6 hidden md:block"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-[20px] bg-sun px-4 py-3 shadow-float"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.14em]">Scholarship</p>
            <p className="font-display text-[26px] font-extrabold leading-none tracking-tight">Up to 100%</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Numbers() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-8 md:px-6 md:pt-4">
      <Reveal className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <div className="col-span-2 flex flex-col justify-between rounded-[26px] bg-ink p-5 text-white md:flex-row md:items-end md:gap-6 md:p-6">
          <div className="flex -space-x-2.5">
            {noidaToppers.slice(0, 5).map((t) => (
              <span key={t.name} className="relative size-9 overflow-hidden rounded-full ring-[2.5px] ring-ink">
                <Image src={t.photo} alt="" fill sizes="36px" className="object-cover object-top" />
              </span>
            ))}
            <span className="relative grid size-9 place-items-center rounded-full bg-white/15 text-[11px] font-bold ring-[2.5px] ring-ink">
              +{noidaToppers.length - 5}
            </span>
          </div>
          <div className="mt-8 md:order-first md:mt-0">
            <p className="font-display text-[52px] font-extrabold leading-none tracking-[-0.04em] md:text-[56px]">
              <CountUp to={1310} suffix="+" />
            </p>
            <p className="mt-2 text-[15px] text-white/70">NLU selections across LawPrep Tutorial</p>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-[26px] bg-brand p-5 text-white md:p-6">
          <p className="text-[13px] font-bold text-white/75">LawPrep Tutorial</p>
          <div className="mt-8 md:mt-6">
            <p className="font-display text-[44px] font-extrabold leading-none tracking-[-0.04em] md:text-[48px]">
              <CountUp to={23} suffix="+" />
            </p>
            <p className="mt-1.5 text-[13px] leading-snug text-white/80 md:text-[15px]">years of law entrance coaching</p>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-[26px] bg-sun p-5 md:p-6">
          <p className="text-[13px] font-bold text-ink/70">CLAT 2026</p>
          <div className="mt-8 md:mt-6">
            <p className="font-display text-[44px] font-extrabold leading-none tracking-[-0.04em] md:text-[48px]">
              <CountUp to={noidaToppers.length} />
            </p>
            <p className="mt-1.5 text-[13px] leading-snug text-ink/75 md:text-[15px]">ranks from the Noida centre</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Batches() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-12 md:grid md:grid-cols-[1fr_1.1fr] md:items-center md:gap-12 md:px-6 md:pt-16">
      <Reveal>
        <SectionHeader title="Find your batch" subtitle="Pick where you are now. Swipe the card to compare." />
        <div className="hidden md:block">
          <p className="max-w-sm text-base leading-relaxed text-ink-2">
            Three tracks, one syllabus. The difference is how much time you have before the exam,
            and how the hours are spread across it.
          </p>
          <Link href="/courses" className={`${button("quiet")} mt-6`}>
            Compare all courses <ArrowRightIcon size={16} weight="bold" />
          </Link>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <BatchFinder />
      </Reveal>
    </section>
  );
}

function Ranks() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-12 md:px-6 md:pt-16">
      <Reveal>
        <SectionHeader
          title="Ranks from this centre"
          subtitle="CLAT 2026 · tap a card for the story"
          action={<SeeAll href="/results" />}
        />
      </Reveal>
      <Reveal delay={0.08}>
        <RankWall />
      </Reveal>
    </section>
  );
}

function Scholarship() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-12 md:px-6 md:pt-16">
      <Reveal>
        <div className="relative md:grid md:grid-cols-[1fr_auto_auto]">
          <div className="relative rounded-t-[28px] bg-sun p-6 pb-7 md:rounded-l-[28px] md:rounded-tr-none md:px-8 md:py-7">
            <p className="inline-flex items-center gap-2 rounded-full bg-ink/10 px-3 py-1 text-[12px] font-bold uppercase tracking-[0.12em]">
              Scholarship test
            </p>
            <h2 className="mt-4 max-w-md font-display text-[34px] font-extrabold leading-[0.98] tracking-[-0.04em] md:mt-3 md:max-w-xl md:text-[40px]">
              Up to 100% off your fees, on merit.
            </h2>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink/75 md:mt-2">
              Write the test, and your score decides the fee waiver.
            </p>
          </div>

          {/* Perforation between the ticket and its stub */}
          <div aria-hidden className="relative h-0 md:h-auto md:w-0">
            <span className="absolute top-1/2 -left-3 z-10 size-6 -translate-y-1/2 rounded-full bg-paper md:top-0 md:left-1/2 md:-translate-x-1/2" />
            <span className="absolute top-1/2 -right-3 z-10 size-6 -translate-y-1/2 rounded-full bg-paper md:top-auto md:bottom-0 md:left-1/2 md:-translate-x-1/2 md:translate-y-1/2" />
            <span className="absolute inset-x-5 top-1/2 border-t-2 border-dashed border-ink/20 md:inset-x-auto md:inset-y-5 md:left-1/2 md:border-t-0 md:border-l-2" />
          </div>

          <div className="flex flex-col justify-between gap-5 rounded-b-[28px] bg-sun p-6 pt-7 md:w-[280px] md:rounded-r-[28px] md:rounded-bl-none md:px-8 md:py-7">
            <dl className="grid grid-cols-2 gap-4 md:grid-cols-1">
              <div>
                <dt className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.12em] text-ink/60">
                  <CalendarBlankIcon size={14} weight="bold" /> Test date
                </dt>
                <dd className="mt-1 text-[17px] font-bold">To be announced</dd>
              </div>
              <div>
                <dt className="text-[12px] font-bold uppercase tracking-[0.12em] text-ink/60">Waiver</dt>
                <dd className="mt-1 text-[17px] font-bold">Up to 100%</dd>
              </div>
            </dl>
            <EnquireButton interest="Scholarship test" source="scholarship" className={`${button("ink", "lg")} w-full`}>
              Notify me
            </EnquireButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Mentor() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-12 md:px-6 md:pt-16">
      <Reveal className="overflow-hidden rounded-[28px] bg-mist md:grid md:grid-cols-[0.8fr_1fr] md:rounded-[32px]">
        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[300px]">
          <Image
            src={academicHead.photo}
            alt={`${academicHead.name}, ${academicHead.title}`}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover object-[60%_30%]"
          />
        </div>
        <div className="flex flex-col justify-center p-6 md:p-10">
          <p className="text-[13px] font-bold text-brand">Who leads the academics</p>
          <h2 className="mt-2 font-display text-[30px] font-bold leading-[1.02] tracking-[-0.03em] md:text-[36px]">
            {academicHead.name}
          </h2>
          <p className="mt-2 text-[15px] font-semibold text-ink-2">{academicHead.title}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-paper px-3.5 py-1.5 text-[13px] font-semibold">{academicHead.education}</span>
            <span className="rounded-full bg-paper px-3.5 py-1.5 text-[13px] font-semibold">NLU graduate</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Inside() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-12 md:px-6 md:pt-16">
      <Reveal>
        <SectionHeader title="Inside the Noida centre" subtitle="Classes, tests and results day" action={<SeeAll href="/visit" label="Visit" />} />
      </Reveal>
      <Reveal delay={0.08}>
        <Gallery />
      </Reveal>
    </section>
  );
}

function VisitCard() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-12 md:px-6 md:pt-16">
      <Reveal className="rounded-[28px] border border-line p-5 md:flex md:items-center md:justify-between md:gap-10 md:rounded-[28px] md:px-8 md:py-7">
        <div>
          <OpenStatus long className="rounded-full bg-mist px-3 py-1.5 text-[13px] font-bold" />
          <h2 className="mt-4 font-display text-[28px] font-bold leading-[1.05] tracking-[-0.03em] md:text-[36px]">
            Come and meet us.
          </h2>
          <p className="mt-2 flex items-center gap-2 text-[15px] text-ink-2">
            <ClockIcon size={16} weight="bold" /> Office hours {site.hours}
          </p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2.5 md:mt-0 md:flex">
          <a href={site.phoneHref} className={button("primary", "lg")}>
            <PhoneIcon size={18} weight="fill" /> Call
          </a>
          <a
            href={whatsappLink("Hi, I'd like to visit the LawPrep Noida centre.")}
            target="_blank"
            rel="noopener noreferrer"
            className={button("outline", "lg")}
          >
            <WhatsappLogoIcon size={18} weight="fill" /> WhatsApp
          </a>
        </div>
      </Reveal>
    </section>
  );
}
