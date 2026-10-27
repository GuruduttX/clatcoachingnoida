"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRightIcon, CaretDownIcon, HandTapIcon, SparkleIcon } from "@phosphor-icons/react";
import { useEnquiry } from "@/components/enquiry";
import { StoryLayer, topperStories, type StorySession } from "@/components/stories";
import { noidaToppers, type Photo, type Topper } from "@/lib/data";
import { haptic } from "@/lib/haptics";
import { button } from "@/lib/ui";

const ease = [0.22, 1, 0.36, 1] as const;
const stories = topperStories(noidaToppers);

/* ---------- Podium: the top three, rising into place ---------- */

const PODIUM = [
  { place: 2, height: "h-24 md:h-32", tone: "bg-white/12 text-white", delay: 0.35 },
  { place: 1, height: "h-36 md:h-48", tone: "bg-brand text-white", delay: 0.2 },
  { place: 3, height: "h-16 md:h-24", tone: "bg-white/8 text-white", delay: 0.5 },
];

export function Podium() {
  const [session, setSession] = useState<StorySession | null>(null);
  return (
    <>
      <div className="grid grid-cols-3 items-end gap-2 md:gap-3">
        {PODIUM.map(({ place, height, tone, delay }) => {
          const t = noidaToppers[place - 1];
          return (
            <button
              key={t.name}
              type="button"
              onClick={() => {
                haptic();
                setSession({ stories, start: place - 1 });
              }}
              aria-label={`${t.name}, AIR ${t.air}, ${t.nlu}. Open story`}
              className="group flex flex-col items-center text-center"
            >
              <motion.span
                initial={{ opacity: 0, y: 16, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: delay + 0.45 }}
                className={`relative block overflow-hidden rounded-full ring-[3px] transition-transform group-hover:scale-105 ${
                  place === 1 ? "size-20 ring-sun md:size-28" : "size-14 ring-white/30 md:size-20"
                }`}
              >
                <Image src={t.photo} alt="" fill sizes="112px" className="object-cover object-top" />
              </motion.span>
              <span className="mt-2 block w-full truncate text-[13px] font-bold text-white md:text-[15px]">{t.name.split(" ")[0]}</span>
              <span className="block text-[11px] font-semibold text-white/55 md:text-[12px]">{t.nlu}</span>
              <motion.span
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.7, delay, ease }}
                style={{ originY: 1 }}
                className={`mt-2.5 flex w-full flex-col items-center justify-start rounded-t-[18px] pt-3 ${height} ${tone}`}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] opacity-70">AIR</span>
                <span className="tabular font-display text-[24px] font-extrabold leading-none tracking-tight md:text-[34px]">{t.air}</span>
              </motion.span>
            </button>
          );
        })}
      </div>
      <StoryLayer session={session} onClose={() => setSession(null)} />
    </>
  );
}

/* ---------- Ticker: every rank, scrolling past ---------- */

export function RankTicker() {
  const reduce = useReducedMotion();
  const items = [...noidaToppers, ...noidaToppers];
  return (
    <div className="overflow-hidden border-y border-line bg-paper py-3 [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]">
      <motion.ul
        aria-label="CLAT 2026 ranks from the Noida centre"
        className="flex w-max gap-8"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {items.map((t, i) => (
          <li key={i} aria-hidden={i >= noidaToppers.length} className="flex shrink-0 items-center gap-2.5 text-[14px] font-semibold">
            <span className="relative size-7 overflow-hidden rounded-full bg-mist">
              <Image src={t.photo} alt="" fill sizes="28px" className="object-cover object-top" />
            </span>
            <span className="tabular font-display font-extrabold text-brand">AIR {t.air}</span>
            <span>{t.name}</span>
            <span className="text-ink-3">{t.nlu}</span>
            <SparkleIcon size={12} weight="fill" className="ml-4 text-sun-deep" />
          </li>
        ))}
      </motion.ul>
    </div>
  );
}

/* ---------- Departures board: where the batch is headed ---------- */

function FlapText({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span className="inline-flex gap-[2px]" aria-label={text}>
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ rotateX: -90, opacity: 0 }}
          whileInView={{ rotateX: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: delay + i * 0.05, ease }}
          className="inline-grid min-w-[1.05em] place-items-center rounded-[4px] bg-white/[0.06] px-[1px] py-[1px] [transform-style:preserve-3d]"
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export function DeparturesBoard() {
  const [open, setOpen] = useState<string | null>(null);
  const byNlu = new Map<string, Topper[]>();
  for (const t of noidaToppers) byNlu.set(t.nlu, [...(byNlu.get(t.nlu) ?? []), t]);
  const groups = [...byNlu]
    .map(([nlu, students]) => ({ nlu, city: students[0].city, students }))
    .sort((a, b) => b.students.length - a.students.length || a.students[0].air - b.students[0].air);

  return (
    <div className="overflow-hidden rounded-[28px] bg-ink p-2 text-white md:p-3">
      <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-3 pt-2 pb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white/40 md:grid-cols-[1.2fr_1fr_1fr_auto] md:px-5">
        <span>Destination</span>
        <span className="hidden md:block">City</span>
        <span>Students</span>
        <span className="w-8" />
      </div>
      <ul className="space-y-1.5">
        {groups.map((g, gi) => {
          const expanded = open === g.nlu;
          return (
            <li key={g.nlu} className={`overflow-hidden rounded-[18px] transition-colors ${expanded ? "bg-white/10" : "bg-white/[0.04] hover:bg-white/[0.07]"}`}>
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => {
                  haptic(5);
                  setOpen(expanded ? null : g.nlu);
                }}
                className="grid w-full grid-cols-[1fr_auto_auto] items-center gap-3 px-3 py-3 text-left md:grid-cols-[1.2fr_1fr_1fr_auto] md:px-5"
              >
                <span className="min-w-0">
                  <span className="tabular block font-mono text-[17px] font-bold tracking-wider text-sun md:text-[20px]">
                    <FlapText text={g.nlu} delay={gi * 0.08} />
                  </span>
                  <span className="mt-0.5 block text-[12px] font-semibold text-white/50 md:hidden">{g.city}</span>
                </span>
                <span className="hidden text-[15px] font-semibold text-white/75 md:block">{g.city}</span>
                <span className="flex items-center gap-2">
                  <span className="flex -space-x-2">
                    {g.students.map((s) => (
                      <span key={s.name} className="relative size-8 overflow-hidden rounded-full ring-2 ring-ink">
                        <Image src={s.photo} alt="" fill sizes="32px" className="object-cover object-top" />
                      </span>
                    ))}
                  </span>
                  <span className="tabular text-[13px] font-bold text-white/70">×{g.students.length}</span>
                </span>
                <motion.span
                  animate={{ rotate: expanded ? 180 : 0 }}
                  className="grid size-8 place-items-center rounded-full bg-white/10"
                >
                  <CaretDownIcon size={14} weight="bold" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                    className="grid gap-1.5 px-3 pb-3 sm:grid-cols-2 md:grid-cols-3 md:px-5"
                  >
                    {g.students.map((s) => (
                      <li key={s.name} className="flex items-center gap-3 rounded-2xl bg-white/[0.06] p-2.5">
                        <span className="relative size-10 shrink-0 overflow-hidden rounded-xl">
                          <Image src={s.photo} alt="" fill sizes="40px" className="object-cover object-top" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14px] font-bold">{s.name}</span>
                          <span className="tabular block text-[12px] text-white/55">Score {s.score}</span>
                        </span>
                        <span className="tabular font-display text-[18px] font-extrabold text-sun">#{s.air}</span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- Rank bands: how high the batch landed ---------- */

// One hue, darkest for the best band.
const BANDS: { label: string; test: (air: number) => boolean; fill: string }[] = [
  { label: "Top 200", test: (a) => a <= 200, fill: "#8f000b" },
  { label: "201–500", test: (a) => a > 200 && a <= 500, fill: "#e40014" },
  { label: "501–1000", test: (a) => a > 500 && a <= 1000, fill: "#f2606c" },
  { label: "1000+", test: (a) => a > 1000, fill: "#f8a9af" },
];

export function RankBands() {
  const bands = BANDS.map((b) => ({ ...b, students: noidaToppers.filter((t) => b.test(t.air)) })).filter((b) => b.students.length);
  const [active, setActive] = useState(0);
  const current = bands[active];

  return (
    <div className="rounded-[28px] bg-mist p-4 md:p-6">
      <div className="flex gap-[2px]" role="tablist" aria-label="Rank bands">
        {bands.map((b, i) => (
          <button
            key={b.label}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => {
              haptic(5);
              setActive(i);
            }}
            style={{ flexGrow: b.students.length, minWidth: 64 }}
            className="group min-w-0 basis-0 text-left"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              style={{ backgroundColor: b.fill, originX: 0 }}
              className={`block h-12 transition-opacity md:h-14 ${i === 0 ? "rounded-l-[14px]" : ""} ${i === bands.length - 1 ? "rounded-r-[14px]" : ""} ${
                active === i ? "opacity-100" : "opacity-45 group-hover:opacity-75"
              }`}
            />
            <span className="mt-2 block truncate px-0.5 text-[11px] font-bold md:text-[14px]">{b.label}</span>
            <span className="tabular block truncate px-0.5 text-[11px] text-ink-3 md:text-[13px]">
              {b.students.length}<span className="max-md:hidden"> {b.students.length === 1 ? "student" : "students"}</span>
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={current.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="mt-5 flex flex-wrap gap-2"
          aria-label={`Students ranked ${current.label}`}
        >
          {current.students.map((s) => (
            <li key={s.name} className="flex items-center gap-2 rounded-full bg-paper py-1 pr-3.5 pl-1 text-[13px] font-semibold md:text-[14px]">
              <span className="relative size-7 overflow-hidden rounded-full bg-mist">
                <Image src={s.photo} alt="" fill sizes="28px" className="object-cover object-top" />
              </span>
              {s.name}
              <span className="tabular font-bold text-ink-3">#{s.air}</span>
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
      <p className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-ink-3">
        <HandTapIcon size={14} weight="bold" /> Tap a band to see who&apos;s in it
      </p>
    </div>
  );
}

/* ---------- Photo deck: results day, one tap at a time ---------- */

export function PhotoDeck({ photos }: { photos: Photo[] }) {
  const [order, setOrder] = useState(() => photos.map((_, i) => i));
  const tilt = [-4, 3, -2, 5];

  return (
    <div className="relative mx-auto aspect-[4/3] w-[88%] md:w-full">
      {order
        .slice()
        .reverse()
        .map((idx) => {
          const depth = order.indexOf(idx);
          const p = photos[idx];
          return (
            <motion.button
              key={p.src}
              type="button"
              aria-label={depth === 0 ? `${p.alt}. Show next photo` : undefined}
              tabIndex={depth === 0 ? 0 : -1}
              onClick={() => {
                if (depth !== 0) return;
                haptic(6);
                setOrder((o) => [...o.slice(1), o[0]]);
              }}
              animate={{ rotate: depth === 0 ? 0 : tilt[depth % tilt.length], scale: 1 - depth * 0.04, y: depth * 10 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              style={{ zIndex: photos.length - depth }}
              className="absolute inset-0 overflow-hidden rounded-[24px] border-[6px] border-paper bg-mist shadow-lift"
            >
              <Image src={p.src} alt={depth === 0 ? p.alt : ""} fill sizes="(min-width: 768px) 520px, 88vw" className="object-cover" />
            </motion.button>
          );
        })}
    </div>
  );
}

/* ---------- Next year's board: picture your own card ---------- */

const TARGETS = ["NLSIU Bangalore", "NALSAR Hyderabad", "NLU Delhi", "NUJS Kolkata", "NLIU Bhopal", "GNLU Gandhinagar"];

export function NextBoard() {
  const [name, setName] = useState("");
  const [target, setTarget] = useState(TARGETS[0]);
  const { open } = useEnquiry();
  const shown = name.trim() || "Your name";
  const initial = shown.charAt(0).toUpperCase();

  return (
    <div className="overflow-hidden rounded-[28px] bg-brand text-white md:grid md:grid-cols-[1.2fr_1fr] md:items-center md:gap-10 md:rounded-[32px] md:p-10">
      <div className="p-6 pb-0 md:p-0">
        <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-white/70">CLAT 2027 board</p>
        <h2 className="mt-2 font-display text-[30px] font-extrabold leading-[1] tracking-[-0.03em] md:text-[40px]">Put your name on next year&apos;s board.</h2>
        <p className="mt-2 max-w-md text-[15px] text-white/80">Type it in, pick your dream NLU, and see how it looks.</p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          <label className="block">
            <span className="sr-only">Your name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 24))}
              placeholder="Your name"
              autoComplete="given-name"
              className="h-12 w-full rounded-2xl border border-white/25 bg-white/10 px-4 text-base font-semibold text-white outline-none transition placeholder:text-white/55 focus:border-white focus:bg-white/15"
            />
          </label>
          <label className="block">
            <span className="sr-only">Dream NLU</span>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="h-12 w-full appearance-none rounded-2xl border border-white/25 bg-white/10 px-4 text-base font-semibold text-white outline-none focus:border-white [&>option]:text-ink"
            >
              {TARGETS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={() => open("Not sure yet", "results")}
          className={`${button("white", "lg")} mt-3 w-full sm:w-auto`}
        >
          <span className="md:hidden">Free counselling call</span>
          <span className="hidden md:inline">Start with a free counselling call</span>
          <ArrowRightIcon size={18} weight="bold" />
        </button>
      </div>

      {/* Mirrors the topper cards above, with a blank rank waiting to be filled. */}
      <div className="p-6 md:p-0">
        <motion.div
          layout
          className="relative mx-auto aspect-[4/5] w-[62%] max-w-[260px] overflow-hidden rounded-[22px] bg-ink shadow-float md:w-[78%]"
          initial={{ rotate: -3 }}
          whileHover={{ rotate: 0, scale: 1.02 }}
        >
          <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_35%,#2a2622,#141210)]">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={initial}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                className="mb-10 grid size-24 place-items-center rounded-full bg-white/10 font-display text-[44px] font-extrabold text-white/80"
              >
                {initial}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="absolute top-2.5 left-2.5 rounded-full bg-sun px-2.5 py-1 text-[12px] font-extrabold text-ink">AIR ?</span>
          <span className="absolute inset-x-3 bottom-3">
            <span className="block truncate text-[16px] font-bold">{shown}</span>
            <span className="block truncate text-[12px] text-white/70">{target}</span>
          </span>
        </motion.div>
      </div>
    </div>
  );
}

