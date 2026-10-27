"use client";

import Link from "next/link";
import { createContext, useContext, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRightIcon,
  BookOpenTextIcon,
  CheckCircleIcon,
  CrownSimpleIcon,
  GlobeHemisphereEastIcon,
  GraduationCapIcon,
  HandTapIcon,
  type Icon,
  MathOperationsIcon,
  PhoneIcon,
  PlusIcon,
  PuzzlePieceIcon,
  ScalesIcon,
  TimerIcon,
} from "@phosphor-icons/react";
import { useEnquiry } from "@/components/enquiry";
import { Sheet } from "@/components/sheet";
import { PersonPhoto } from "@/components/site/avatar";
import { haptic } from "@/lib/haptics";
import { button } from "@/lib/ui";
import { useMediaQuery } from "@/lib/use-media-query";

const ease = [0.22, 1, 0.36, 1] as const;

// A slim, serialisable view of each mentor, built on the server so the
// full profile copy in lib/faculty never ships to the browser.
export type Mentor = {
  slug: string;
  name: string;
  title: string;
  role: string;
  image: string;
  director: boolean;
  credential: string | null;
  years: number | null;
  subjects: string[];
  expertise: string[];
  summary: string;
  points: { title: string; description: string }[];
};

/* ---------- Shared profile sheet: any face on the page opens it ---------- */

const FacultyContext = createContext<{ mentors: Mentor[]; show: (slug: string) => void } | null>(null);

function useFaculty() {
  const ctx = useContext(FacultyContext);
  if (!ctx) throw new Error("useFaculty must be used inside <FacultyProvider>");
  return ctx;
}

export function FacultyProvider({ mentors, children }: { mentors: Mentor[]; children: ReactNode }) {
  // Keep the last mentor while the sheet animates out.
  const [state, setState] = useState<{ slug: string | null; open: boolean }>({ slug: null, open: false });
  const { open: enquire } = useEnquiry();
  const mentor = mentors.find((m) => m.slug === state.slug);
  const close = () => setState((s) => ({ ...s, open: false }));

  return (
    <FacultyContext.Provider
      value={{
        mentors,
        show: (slug) => {
          haptic();
          setState({ slug, open: true });
        },
      }}
    >
      {children}
      <Sheet open={state.open} onClose={close} title={mentor?.name ?? ""} description={mentor?.title}>
        {mentor && (
          <div className="pb-2">
            <div className="flex items-center gap-4">
              <span className="relative size-20 shrink-0 overflow-hidden rounded-[20px] bg-mist">
                <PersonPhoto src={mentor.image} name={mentor.name} sizes="80px" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-[19px] font-bold leading-tight tracking-[-0.02em]">{mentor.role}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {mentor.years && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-tint px-2.5 py-1 text-[12px] font-bold text-brand-deep">
                      <TimerIcon size={13} weight="fill" /> {mentor.years}+ years teaching
                    </span>
                  )}
                  {mentor.director && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-1 text-[12px] font-bold">
                      <CrownSimpleIcon size={13} weight="fill" className="text-brand" /> Director
                    </span>
                  )}
                </div>
              </div>
            </div>

            {mentor.credential && (
              <p className="mt-4 flex items-start gap-2 rounded-[18px] bg-mist px-4 py-3 text-[14px] font-semibold">
                <GraduationCapIcon size={18} weight="fill" className="mt-px shrink-0 text-brand" /> {mentor.credential}
              </p>
            )}

            <h3 className="mt-5 text-[12px] font-bold uppercase tracking-[0.12em] text-ink-3">Teaches</h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {mentor.expertise.map((e) => (
                <li key={e} className="rounded-full border border-line px-3 py-1.5 text-[13px] font-semibold">
                  {e}
                </li>
              ))}
            </ul>

            <h3 className="mt-5 text-[12px] font-bold uppercase tracking-[0.12em] text-ink-3">In class</h3>
            <ul className="mt-2 space-y-2.5">
              {mentor.points.map((p) => (
                <li key={p.title} className="flex gap-2.5">
                  <CheckCircleIcon size={18} weight="fill" className="mt-0.5 shrink-0 text-brand" />
                  <span className="text-[14px] leading-relaxed text-ink-2">
                    <span className="font-bold text-ink">{p.title}.</span> {p.description}
                  </span>
                </li>
              ))}
            </ul>

            <div className="sticky bottom-0 -mx-5 mt-5 grid grid-cols-2 gap-2.5 bg-paper/95 px-5 pt-3 backdrop-blur">
              <button
                type="button"
                onClick={() => {
                  close();
                  enquire("Not sure yet", "faculty");
                }}
                className={button("primary")}
              >
                <PhoneIcon size={17} weight="fill" /> Book a call
              </button>
              <Link href={`/faculty/${mentor.slug}`} onClick={close} className={button("quiet")}>
                Full profile
              </Link>
            </div>
          </div>
        )}
      </Sheet>
    </FacultyContext.Provider>
  );
}

/* ---------- Staffroom: every face in one tappable mosaic ---------- */

export function StaffMosaic() {
  const { mentors, show } = useFaculty();
  const { open } = useEnquiry();
  const ordered = [...mentors].sort((a, b) => Number(b.director) - Number(a.director));

  return (
    <div>
      <ul className="grid grid-cols-4 gap-1.5 md:gap-2">
        {ordered.map((m, i) => (
          <motion.li
            key={m.slug}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.04, ease }}
          >
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => show(m.slug)}
              aria-label={`${m.name}, ${m.role}. Open profile`}
              className="group relative block aspect-square w-full overflow-hidden rounded-[16px] bg-mist md:aspect-[4/5] md:rounded-[20px]"
            >
              <PersonPhoto
                src={m.image}
                name={m.name}
                eager={i < 4}
                sizes="(min-width: 768px) 12vw, 24vw"
                className="transition duration-700 ease-out group-hover:scale-[1.06]"
              />
              <span className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/70 to-transparent" />
              <span className="absolute inset-x-1.5 bottom-1.5 truncate text-left text-[11px] font-bold text-white md:inset-x-2.5 md:bottom-2 md:text-[13px]">
                {m.name}
              </span>
              {m.director && (
                <span className="absolute top-1.5 left-1.5 grid size-5 place-items-center rounded-full bg-brand text-white md:top-2 md:left-2 md:size-6">
                  <CrownSimpleIcon size={12} weight="fill" />
                </span>
              )}
            </motion.button>
          </motion.li>
        ))}
        <motion.li
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 + ordered.length * 0.04, ease }}
        >
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => open("Not sure yet", "faculty")}
            className="flex aspect-square w-full flex-col items-start justify-between rounded-[16px] bg-brand p-2 text-left text-white md:aspect-[4/5] md:rounded-[20px] md:p-3"
          >
            <span className="grid size-7 place-items-center rounded-full bg-white/15 md:size-9">
              <PhoneIcon size={15} weight="fill" />
            </span>
            <span className="text-[11px] font-bold leading-tight md:text-[14px]">
              Talk to the team <ArrowRightIcon size={12} weight="bold" className="inline" />
            </span>
          </motion.button>
        </motion.li>
      </ul>
      <p className="mt-2.5 flex items-center justify-between gap-3 text-[12px] font-semibold text-ink-3">
        <span className="flex items-center gap-1.5">
          <HandTapIcon size={14} weight="bold" /> Tap a face for their profile
        </span>
        <span className="flex items-center gap-1.5">
          <span className="grid size-4 place-items-center rounded-full bg-brand text-white">
            <CrownSimpleIcon size={9} weight="fill" />
          </span>
          Director
        </span>
      </p>
    </div>
  );
}

/* ---------- Section finder: the paper's index, mapped to mentors ---------- */

// `compact` fits a phone row next to the dotted leader; `short` fits a button.
const SECTIONS: { key: string; label: string; compact: string; short: string; icon: Icon }[] = [
  { key: "Legal", label: "Legal Reasoning", compact: "Legal Reasoning", short: "Legal", icon: ScalesIcon },
  { key: "Reasoning", label: "Logical & Critical Reasoning", compact: "Logical & Critical", short: "Reasoning", icon: PuzzlePieceIcon },
  { key: "English", label: "English Language", compact: "English", short: "English", icon: BookOpenTextIcon },
  { key: "GK", label: "GK & Current Affairs", compact: "GK & Current Affairs", short: "GK", icon: GlobeHemisphereEastIcon },
  { key: "Quant", label: "Quantitative Techniques", compact: "Quant Techniques", short: "Quant", icon: MathOperationsIcon },
];

export function SectionFinder() {
  const { mentors, show } = useFaculty();
  const { open } = useEnquiry();
  const [active, setActive] = useState(0);
  const section = SECTIONS[active];
  const team = mentors.filter((m) => m.subjects.includes(section.key));

  return (
    <div className="grid gap-3 md:grid-cols-[1fr_1.15fr] md:gap-5">
      <ol aria-label="CLAT sections" className="min-w-0 rounded-[28px] bg-mist p-2 md:p-3">
        {SECTIONS.map((s, i) => {
          const selected = i === active;
          const count = mentors.filter((m) => m.subjects.includes(s.key)).length;
          return (
            <li key={s.key}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  haptic(5);
                  setActive(i);
                }}
                className="relative flex w-full items-center gap-3 rounded-[20px] px-3 py-3 text-left md:px-4 md:py-4"
              >
                {selected && (
                  <motion.span
                    layoutId="finder-row"
                    className="absolute inset-0 rounded-[20px] bg-paper shadow-card"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
                <span
                  className={`relative grid size-10 shrink-0 place-items-center rounded-[14px] transition-colors ${
                    selected ? "bg-brand text-white" : "bg-paper text-ink-2"
                  }`}
                >
                  <s.icon size={20} weight="fill" />
                </span>
                <span className={`relative shrink-0 font-bold leading-tight md:text-[17px] ${selected ? "text-ink" : "text-ink-2"}`}>
                  <span className="sm:hidden">{s.compact}</span>
                  <span className="max-sm:hidden">{s.label}</span>
                </span>
                {/* Dotted leader, like the contents page of a question paper */}
                <span aria-hidden className="relative mx-1 h-0 min-w-4 flex-1 translate-y-1 border-b-2 border-dotted border-line-strong" />
                <span className={`tabular relative shrink-0 text-[13px] font-bold ${selected ? "text-brand" : "text-ink-3"}`}>
                  {count} {count === 1 ? "mentor" : "mentors"}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="flex min-w-0 flex-col rounded-[28px] bg-ink p-5 text-white md:p-7">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease }}
            className="flex-1"
          >
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-white/45">Who teaches it</p>
            <h3 className="mt-1.5 font-display text-[24px] font-bold leading-tight tracking-[-0.02em] md:text-[30px]">{section.label}</h3>
            <ul className="mt-4 space-y-2">
              {team.map((m) => (
                <li key={m.slug}>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => show(m.slug)}
                    className="flex w-full items-center gap-3 rounded-[18px] bg-white/[0.06] p-2 pr-3 text-left transition-colors hover:bg-white/10"
                  >
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-[14px] bg-white/10 text-[0.55em]">
                      <PersonPhoto src={m.image} name={m.name} sizes="48px" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold">{m.name}</span>
                      <span className="block truncate text-[13px] text-white/55">{m.role}</span>
                    </span>
                    {m.years && <span className="tabular shrink-0 text-[13px] font-bold text-sun">{m.years}+ yrs</span>}
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
        <button type="button" onClick={() => open("Not sure yet", "faculty")} className={`${button("primary")} mt-5 w-full md:w-auto md:self-start`}>
          Get help with {section.short}
          <ArrowRightIcon size={16} weight="bold" />
        </button>
      </div>
    </div>
  );
}

/* ---------- Directors: expanding portrait panels ---------- */

export function DirectorPanels() {
  const { mentors, show } = useFaculty();
  const { open } = useEnquiry();
  const directors = mentors.filter((m) => m.director);
  const [active, setActive] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="flex flex-col gap-2.5 md:h-[460px] md:flex-row md:gap-3">
      {directors.map((d, i) => {
        const expanded = i === active;
        return (
          <motion.div
            key={d.slug}
            initial={false}
            animate={isDesktop ? { flexGrow: expanded ? 2.6 : 1, height: "100%" } : { flexGrow: 0, height: expanded ? 440 : 92 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="relative min-w-0 shrink-0 overflow-hidden rounded-[24px] bg-ink text-white md:shrink md:basis-0 md:rounded-[28px]"
          >
            {/* A 92px strip crops faces badly on phones, so collapsed rows show an avatar instead. */}
            <span className={`absolute inset-0 transition-opacity duration-500 ${expanded ? "" : "max-md:opacity-0"}`}>
              <PersonPhoto
                src={d.image}
                name={d.name}
                sizes="(min-width: 768px) 50vw, 100vw"
                className={`transition-[filter] duration-500 ${expanded ? "" : "grayscale-[0.6]"}`}
              />
            </span>
            <span
              className={`absolute inset-0 transition-opacity duration-500 ${
                expanded ? "bg-linear-to-t from-black/90 via-black/30 to-transparent" : "bg-linear-to-r from-black/75 to-black/10 md:bg-linear-to-t"
              }`}
            />

            {!expanded && (
              <button
                type="button"
                onClick={() => {
                  haptic(5);
                  setActive(i);
                }}
                aria-label={`Show ${d.name}`}
                className="absolute inset-0 flex items-center gap-4 px-5 text-left md:items-end md:p-5"
              >
                <span className="relative size-14 shrink-0 overflow-hidden rounded-full ring-2 ring-white/20 md:hidden">
                  <PersonPhoto src={d.image} name={d.name} sizes="56px" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[20px] font-bold leading-tight tracking-[-0.02em]">{d.name}</span>
                  <span className="block text-[13px] font-semibold text-white/65">{d.role.replace(/ mentor$/i, "")}</span>
                </span>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 md:hidden">
                  <PlusIcon size={16} weight="bold" />
                </span>
              </button>
            )}

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.15, ease } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  className="absolute inset-x-0 bottom-0 p-5 md:w-[min(100%,560px)] md:p-7"
                >
                  <p className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-[12px] font-bold">
                    <CrownSimpleIcon size={13} weight="fill" /> {d.role.replace(/ mentor$/i, "")}
                  </p>
                  <h3 className="mt-2.5 font-display text-[32px] font-bold leading-none tracking-[-0.03em] md:text-[40px]">{d.name}</h3>
                  <p className="mt-2.5 line-clamp-3 text-[14px] leading-relaxed text-white/75 md:text-[15px]">{d.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[12px] font-semibold md:text-[13px]">
                    {d.credential && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 backdrop-blur">
                        <GraduationCapIcon size={14} weight="fill" className="text-sun" /> {d.credential}
                      </span>
                    )}
                    {d.years && <span className="tabular rounded-full bg-white/12 px-3 py-1.5 backdrop-blur">{d.years}+ years teaching</span>}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 md:flex">
                    <button type="button" onClick={() => open("Not sure yet", "faculty")} className={button("primary")}>
                      Book a call
                    </button>
                    <button type="button" onClick={() => show(d.slug)} className={`${button("ink")} bg-white/12 backdrop-blur hover:bg-white/20`}>
                      Profile
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ---------- Experience ruler: everyone placed on a 0–15 year scale ---------- */

const SCALE = 15;
// Avatars closer than this many years would overlap on a phone, so they stack.
const GAP = 2;

export function ExperienceRuler() {
  const { mentors, show } = useFaculty();
  const placed = mentors
    .filter((m): m is Mentor & { years: number } => m.years !== null)
    .sort((a, b) => a.years - b.years || a.name.localeCompare(b.name));
  const lanes: number[][] = [];
  const dots = placed.map((m) => {
    let lane = lanes.findIndex((l) => l.every((y) => Math.abs(y - m.years) >= GAP));
    if (lane === -1) lane = lanes.push([]) - 1;
    lanes[lane].push(m.years);
    return { m, lane };
  });
  const [activeSlug, setActiveSlug] = useState(placed.at(-1)?.slug);
  const active = placed.find((m) => m.slug === activeSlug);

  return (
    <div className="rounded-[28px] bg-mist p-5 md:p-8">
      <div className="relative" style={{ height: lanes.length * 44 + 40 }}>
        {dots.map(({ m, lane }, i) => {
          const selected = m.slug === activeSlug;
          return (
            <motion.button
              key={m.slug}
              type="button"
              aria-label={`${m.name}, ${m.years}+ years`}
              aria-pressed={selected}
              onClick={() => {
                haptic(5);
                setActiveSlug(m.slug);
              }}
              initial={{ left: "0%", opacity: 0 }}
              whileInView={{ left: `${(m.years / SCALE) * 100}%`, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.05, ease }}
              whileTap={{ scale: 0.9 }}
              style={{ bottom: 32 + lane * 44 }}
              className={`absolute size-9 -translate-x-1/2 overflow-hidden rounded-full text-[0.4em] ring-[3px] transition-[box-shadow,transform] md:size-10 ${
                selected ? "z-10 scale-110 ring-brand" : "ring-paper hover:ring-line-strong"
              }`}
            >
              <PersonPhoto src={m.image} name={m.name} sizes="40px" />
            </motion.button>
          );
        })}
        {/* The ruler */}
        <div className="absolute inset-x-0 bottom-5 h-0.5 rounded-full bg-line-strong" />
        {[0, 5, 10, 15].map((y) => (
          <span key={y} className="absolute bottom-0 -translate-x-1/2 text-center" style={{ left: `${(y / SCALE) * 100}%` }}>
            <span className="mx-auto mb-1 block h-2 w-0.5 bg-line-strong" />
            <span className="tabular block text-[11px] font-bold text-ink-3">{y}</span>
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {active && (
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="mt-5 flex items-center gap-3 rounded-[20px] bg-paper p-3 pl-4"
          >
            <span className="tabular font-display text-[28px] font-extrabold leading-none tracking-tight text-brand">{active.years}+</span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate font-bold">{active.name}</span>
              <span className="block truncate text-[13px] text-ink-3">{active.role.replace(/ mentor$/i, "")}</span>
            </span>
            <button type="button" onClick={() => show(active.slug)} className={`${button("quiet", "sm")} shrink-0`}>
              Profile
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="mt-3 text-[12px] font-semibold text-ink-3">Years of teaching · tap a face</p>
    </div>
  );
}

/* ---------- Common threads: what shows up across their teaching notes ---------- */

const THREADS = [
  { title: "Concepts before shortcuts", match: /concept/i },
  { title: "Practice built around the exam", match: /exam/i },
  { title: "One-to-one mentoring", match: /mentor|guidance/i },
];

export function TeachingThreads() {
  const { mentors } = useFaculty();
  const threads = THREADS.map((t) => ({
    ...t,
    entries: mentors.flatMap((m) => {
      const point = m.points.find((p) => t.match.test(p.title));
      return point ? [{ m, point }] : [];
    }),
  }));
  const [turn, setTurn] = useState<number[]>(() => threads.map(() => 0));

  return (
    <ul className="rail -mx-4 scroll-pl-4 gap-3 px-4 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0">
      {threads.map((t, ti) => {
        const { m, point } = t.entries[turn[ti] % t.entries.length];
        const loud = ti === 2;
        return (
          <li key={t.title} className="w-[84%] shrink-0 sm:w-[48%] md:w-auto">
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                haptic(5);
                setTurn((all) => all.map((n, i) => (i === ti ? n + 1 : n)));
              }}
              aria-label={`${t.title}. Show another mentor's note`}
              className={`flex h-full w-full flex-col rounded-[28px] p-5 text-left md:p-6 ${loud ? "bg-brand text-white" : "bg-mist"}`}
            >
              <span className="flex items-baseline gap-1">
                <span className="tabular font-display text-[44px] font-extrabold leading-none tracking-[-0.04em]">{t.entries.length}</span>
                <span className={`tabular text-[15px] font-bold ${loud ? "text-white/60" : "text-ink-3"}`}>/ {mentors.length} mentors</span>
              </span>
              <span className="mt-2 font-display text-[21px] font-bold leading-tight tracking-[-0.02em]">{t.title}</span>
              <span className="mt-3 flex -space-x-1.5" aria-hidden>
                {mentors.map((x) => {
                  const on = t.entries.some((e) => e.m.slug === x.slug);
                  return (
                    <span
                      key={x.slug}
                      className={`relative size-7 overflow-hidden rounded-full text-[0.35em] ring-2 transition ${loud ? "ring-brand" : "ring-mist"} ${
                        on ? "" : "opacity-30 grayscale"
                      } ${x.slug === m.slug ? "z-10 scale-110" : ""}`}
                    >
                      <PersonPhoto src={x.image} name={x.name} sizes="28px" />
                    </span>
                  );
                })}
              </span>
              <span className={`mt-4 block min-h-[150px] rounded-[20px] p-4 ${loud ? "bg-white/12" : "bg-paper"}`}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={m.slug}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2, ease }}
                    className="block"
                  >
                    <span className={`block text-[12px] font-bold uppercase tracking-[0.1em] ${loud ? "text-white/60" : "text-brand"}`}>
                      {m.name} · {point.title}
                    </span>
                    <span className={`mt-1.5 block text-[14px] leading-relaxed ${loud ? "text-white/85" : "text-ink-2"}`}>{point.description}</span>
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className={`mt-3 flex items-center gap-1.5 text-[12px] font-semibold ${loud ? "text-white/60" : "text-ink-3"}`}>
                <HandTapIcon size={14} weight="bold" /> Tap for another mentor
              </span>
            </motion.button>
          </li>
        );
      })}
    </ul>
  );
}
