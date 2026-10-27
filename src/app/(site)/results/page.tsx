import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";
import { ArrowRightIcon, QuotesIcon, TrophyIcon } from "@phosphor-icons/react/ssr";
import { str } from "@/components/content/doc";
import { CountUp } from "@/components/count-up";
import { EnquireButton } from "@/components/enquire-button";
import { SectionHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { ResultsExplorer } from "@/components/results-explorer";
import { DeparturesBoard, NextBoard, PhotoDeck, Podium, RankBands, RankTicker } from "@/components/site/results-sections";
import { centrePhotos, noidaToppers, topperSlug } from "@/lib/data";
import { listPublished } from "@/lib/server/content";
import { site } from "@/lib/site";
import { button } from "@/lib/ui";

export const metadata: Metadata = {
  title: "CLAT 2026 results",
  description: `CLAT 2026 ranks from LawPrep Tutorial's Noida centre: ${noidaToppers.length} students ranked, including AIR ${noidaToppers[0].air} at ${noidaToppers[0].nlu} ${noidaToppers[0].city}.`,
  alternates: { canonical: "/results" },
};

const ease = [0.22, 1, 0.36, 1] as const;

// Results day and felicitation photos from the centre gallery.
const resultsDay = ["/images/noida/2.webp", "/images/noida/3.webp", "/images/noida/1.webp", "/images/noida/4.webp"]
  .map((src) => centrePhotos.find((p) => p.src === src))
  .filter((p) => p !== undefined);

function Block({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-4 pt-10 md:px-6 md:pt-16 ${className}`}>
      {children}
    </section>
  );
}

export default function ResultsPage() {
  return (
    <>
      <Hero />
      <div className="mt-6 md:mt-10">
        <RankTicker />
      </div>
      <Destinations />
      <Bands />
      <AllRanks />
      <Strategies />
      <ResultsDay />
      <Block className="pb-6">
        <Reveal>
          <NextBoard />
        </Reveal>
      </Block>
      <p className="mx-auto max-w-6xl px-4 pt-6 pb-12 text-sm text-ink-3 md:px-6 md:pb-16">
        Results from every LawPrep Delhi NCR centre are on{" "}
        <a href={site.parentUrl} className="font-semibold text-ink underline decoration-line-strong underline-offset-4">
          lawpreptutorialdelhi.com
        </a>
        .
      </p>
    </>
  );
}

function Hero() {
  const best = noidaToppers[0];
  const nlus = new Set(noidaToppers.map((t) => t.nlu)).size;
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  });

  return (
    <section className="mx-auto max-w-6xl px-4 pt-2 md:px-6 md:pt-8">
      <div className="relative overflow-hidden rounded-[28px] bg-ink px-5 pt-6 text-white md:grid md:grid-cols-[1fr_1.05fr] md:items-end md:gap-10 md:rounded-[32px] md:px-10 md:pt-10">
        {/* Soft spotlight behind the podium */}
        <div aria-hidden className="pointer-events-none absolute -top-24 right-0 size-[420px] rounded-full bg-brand/25 blur-[90px] md:right-20" />

        <div className="relative md:pb-10">
          <motion.p {...rise(0)} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[13px] font-bold text-sun">
            <TrophyIcon size={14} weight="fill" /> CLAT 2026 · Noida centre
          </motion.p>
          <motion.h1 {...rise(0.06)} className="mt-4 font-display text-[38px] font-bold leading-[0.98] tracking-[-0.04em] sm:text-[48px] lg:text-[56px]">
            {noidaToppers.length} ranks. {nlus} NLUs. One classroom in Noida.
          </motion.h1>
          <motion.dl {...rise(0.12)} className="mt-6 grid grid-cols-3 divide-x divide-white/10 rounded-[20px] bg-white/[0.06] py-3.5">
            {[
              { k: "Best AIR", v: best.air, prefix: "#" },
              { k: "Top score", v: Math.floor(best.score), suffix: "+" },
              { k: "Ranked", v: noidaToppers.length },
            ].map((s) => (
              <div key={s.k} className="flex flex-col-reverse px-3 md:px-5">
                <dt className="mt-1 text-[12px] font-semibold text-white/55">{s.k}</dt>
                <dd className="tabular font-display text-[26px] font-extrabold leading-none tracking-tight md:text-[32px]">
                  {s.prefix}
                  <CountUp to={s.v} />
                  {s.suffix}
                </dd>
              </div>
            ))}
          </motion.dl>
          <motion.div {...rise(0.18)} className="mt-5 grid grid-cols-2 gap-2.5 md:flex md:gap-3">
            <EnquireButton source="results" className={`${button("primary", "lg")} max-md:h-12 max-md:px-4 max-md:text-[15px]`}>
              <span className="md:hidden">Enquire now</span>
              <span className="hidden md:inline">Join the next batch</span>
            </EnquireButton>
            <a href="#all-ranks" className={`${button("ink", "lg")} bg-white/10 hover:bg-white/15 max-md:h-12 max-md:px-4 max-md:text-[15px]`}>
              All ranks
            </a>
          </motion.div>
        </div>

        <div className="relative mt-8 md:mt-0">
          <p className="mb-3 text-center text-[12px] font-semibold text-white/45">Tap a topper for their story</p>
          <Podium />
        </div>
      </div>
    </section>
  );
}

function Destinations() {
  return (
    <Block>
      <Reveal>
        <SectionHeader title="Where they're headed" subtitle="Tap a law school to see who's going there" />
        <DeparturesBoard />
      </Reveal>
    </Block>
  );
}

function Bands() {
  return (
    <Block className="md:grid md:grid-cols-[1fr_1.6fr] md:items-center md:gap-12">
      <Reveal>
        <SectionHeader title="How high they ranked" subtitle="Every rank, grouped into bands" />
        <p className="hidden max-w-xs text-[15px] leading-relaxed text-ink-2 md:block">
          Four of our ten ranked students finished inside the top 200 in the country.
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <RankBands />
      </Reveal>
    </Block>
  );
}

function AllRanks() {
  return (
    <Block id="all-ranks" className="scroll-mt-16">
      <Reveal>
        <SectionHeader title="Every rank" subtitle="Filter by law school, or switch to a list" />
      </Reveal>
      <ResultsExplorer />
    </Block>
  );
}

async function Strategies() {
  const docs = await listPublished("toppers-strategy", { select: "title slug studentSlug quickAnswer", limit: 6 });
  const items = docs
    .map((d) => ({ d, t: noidaToppers.find((x) => topperSlug(x) === str(d, "studentSlug")) }))
    .filter((x) => x.t && str(x.d, "slug"));
  if (items.length === 0) return null;

  return (
    <Block>
      <Reveal>
        <SectionHeader
          title="How they did it"
          subtitle="Strategies, in the toppers' own words"
          action={
            <Link href="/resources/toppers-strategy" className="group flex shrink-0 items-center gap-1 pb-1 text-sm font-bold text-brand md:text-[15px]">
              See all
              <ArrowRightIcon size={15} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          }
        />
      </Reveal>
      <Reveal delay={0.06}>
        <ul className="rail -mx-4 scroll-pl-4 gap-3 px-4 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:px-0">
          {items.map(({ d, t }) => (
            <li key={str(d, "slug")} className="w-[82%] shrink-0 md:w-auto">
              <Link
                href={`/resources/toppers-strategy/${str(d, "slug")}`}
                className="flex h-full flex-col rounded-[24px] border border-line p-5 transition hover:border-ink active:scale-[0.98]"
              >
                <QuotesIcon size={26} weight="fill" className="text-brand" />
                <p className="mt-3 line-clamp-4 text-[15px] leading-relaxed text-ink-2">{str(d, "quickAnswer") || str(d, "title")}</p>
                <span className="mt-auto flex items-center gap-3 pt-5">
                  <span className="relative size-10 overflow-hidden rounded-full bg-mist">
                    <Image src={t!.photo} alt="" fill sizes="40px" className="object-cover object-top" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm font-bold">{t!.name}</span>
                    <span className="block text-[12px] text-ink-3">
                      AIR {t!.air} · {t!.nlu}
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </Block>
  );
}

function ResultsDay() {
  return (
    <Block className="md:grid md:grid-cols-[1fr_1.1fr] md:items-center md:gap-14">
      <Reveal>
        <SectionHeader title="Results day" subtitle="Felicitations, trophies and a lot of noise" />
        <p className="max-w-sm text-[15px] leading-relaxed text-ink-2">
          Every year the centre celebrates its ranked students on stage, with the faculty who taught them.
          Tap the photo to flip through.
        </p>
        <Link href="/gallery" className={`${button("quiet")} mt-5 hidden md:inline-flex`}>
          Full gallery <ArrowRightIcon size={16} weight="bold" />
        </Link>
      </Reveal>
      <Reveal delay={0.06} className="mt-6 pb-4 md:mt-0">
        <PhotoDeck photos={resultsDay} />
      </Reveal>
    </Block>
  );
}
