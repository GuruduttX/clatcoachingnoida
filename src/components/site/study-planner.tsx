"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowCounterClockwiseIcon,
  ArrowRightIcon,
  CalendarCheckIcon,
  CaretDownIcon,
  CheckIcon,
  CircleNotchIcon,
  HourglassMediumIcon,
  MinusIcon,
  PlusIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import { fieldClass } from "@/components/enquiry";
import { Sheet } from "@/components/sheet";
import { haptic } from "@/lib/haptics";
import { COURSES, SYLLABUS, type CourseId, type Subject } from "@/lib/study-planner";
import { button } from "@/lib/ui";

// Progress lives in this browser only; the lead is what reaches the centre.
const STORAGE_KEY = "lpt-study-planner";

type Saved = { course: CourseId; hours: number; unlocked: boolean; completed: string[] };

function load(): Saved | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

function save(value: Saved) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {}
}

function parseHours(value: string) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0.5 && n <= 24 ? n : null;
}

const hrs = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(1)} hrs`;

const totalHours = (subjects: Subject[]) => subjects.reduce((sum, s) => sum + s.topics.reduce((t, x) => t + x.hours, 0), 0);

const QUICK_HOURS = [2, 4, 6, 8];

function StepButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={() => {
        haptic(5);
        onClick();
      }}
      className="grid size-12 shrink-0 place-items-center rounded-2xl bg-mist text-ink transition active:scale-90 disabled:opacity-35"
    >
      {children}
    </button>
  );
}

const noop = () => () => {};

export function StudyPlanner() {
  // Saved progress only exists in the browser, so the planner remounts with it once hydrated.
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  return <Planner key={hydrated ? "client" : "server"} initial={hydrated ? load() : null} />;
}

function Planner({ initial }: { initial: Saved | null }) {
  // Returning students go straight back to their plan.
  const restored = initial && SYLLABUS[initial.course] ? initial : null;
  const [course, setCourse] = useState<CourseId | "">(restored?.course ?? COURSES[0].id);
  const [hoursInput, setHoursInput] = useState(restored ? String(restored.hours) : "4");
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(restored?.unlocked ?? false);
  const [showPlan, setShowPlan] = useState(restored?.unlocked ?? false);
  const [completed, setCompleted] = useState<Set<string>>(() => new Set(restored?.completed));
  const [sheetOpen, setSheetOpen] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);
  // Keep the last valid value so the plan doesn't vanish while hours are being retyped.
  const [hours, setHours] = useState<number | null>(restored?.hours ?? null);
  const parsed = parseHours(hoursInput);
  if (parsed && parsed !== hours) setHours(parsed);

  useEffect(() => {
    if (!showPlan || !course || !hours) return;
    save({ course, hours, unlocked, completed: [...completed] });
  }, [showPlan, course, hours, unlocked, completed]);

  function reveal() {
    setShowPlan(true);
    requestAnimationFrame(() => planRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function create() {
    if (!course || !parsed) {
      setError(!course ? "Pick what you're preparing for" : "Enter between 1 and 24 hours a day");
      haptic(30);
      return;
    }
    setError(null);
    haptic(12);
    if (unlocked) reveal();
    else setSheetOpen(true);
  }

  function toggle(topicId: string) {
    haptic(6);
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-[28px] bg-brand p-5 text-white md:rounded-[36px] md:p-10">
        <div className="flex items-start gap-3.5">
          <span className="grid size-12 shrink-0 place-items-center rounded-[18px] bg-paper text-brand shadow-float">
            <CalendarCheckIcon size={24} weight="fill" />
          </span>
          <div>
            <h2 className="font-display text-[24px] font-bold leading-[1.05] tracking-[-0.03em] md:text-[36px]">Build your study plan</h2>
            <p className="mt-1 text-[14px] text-white/80 md:text-[15px]">Two quick choices. Your plan in under a minute.</p>
          </div>
        </div>

        <form
          className="mt-6 space-y-6"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            create();
          }}
        >
          <fieldset>
            <legend className="text-[12px] font-bold uppercase tracking-[0.1em] text-white/70">Preparing for</legend>
            <div className="mt-2.5 grid grid-cols-2 gap-2.5">
              {COURSES.map((c) => {
                const selected = course === c.id;
                const subjects = SYLLABUS[c.id];
                const total = totalHours(subjects);
                return (
                  <label key={c.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="course"
                      value={c.id}
                      checked={selected}
                      onChange={() => {
                        haptic(5);
                        setCourse(c.id);
                      }}
                      className="peer sr-only"
                    />
                    <motion.span
                      whileTap={{ scale: 0.97 }}
                      className={`flex h-full items-start gap-2 rounded-[20px] px-4 py-3.5 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white ${
                        selected ? "bg-paper text-ink shadow-float" : "bg-white/12 text-white hover:bg-white/18"
                      }`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-[20px] font-extrabold leading-none tracking-tight">{c.label}</span>
                        <span className={`tabular mt-1.5 block text-[13px] font-semibold leading-snug ${selected ? "text-ink-3" : "text-white/70"}`}>
                          {subjects.length} sections
                          <br />
                          {total} hrs
                        </span>
                      </span>
                      <span
                        className={`grid size-7 shrink-0 place-items-center rounded-full transition-colors ${
                          selected ? "bg-brand text-white" : "border-2 border-white/40"
                        }`}
                      >
                        {selected && <CheckIcon size={14} weight="bold" />}
                      </span>
                    </motion.span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-[12px] font-bold uppercase tracking-[0.1em] text-white/70">Hours you can study a day</legend>
            <div className="mt-2.5 flex items-center gap-2 rounded-[20px] bg-paper p-2 text-ink">
              <StepButton label="Fewer hours" disabled={(parsed ?? 1) <= 1} onClick={() => setHoursInput(String(Math.max(1, Math.ceil((parsed ?? 2) - 1))))}>
                <MinusIcon size={18} weight="bold" />
              </StepButton>
              <label className="flex flex-1 items-baseline justify-center gap-1.5">
                <span className="sr-only">Daily study hours</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={1}
                  max={24}
                  step={0.5}
                  value={hoursInput}
                  onChange={(e) => setHoursInput(e.target.value)}
                  placeholder="0"
                  className="tabular w-[2.6ch] bg-transparent text-right font-display text-[40px] font-extrabold leading-none tracking-tight outline-none [appearance:textfield] placeholder:text-ink-3/50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="text-[15px] font-bold text-ink-3">hrs</span>
              </label>
              <StepButton label="More hours" disabled={(parsed ?? 0) >= 24} onClick={() => setHoursInput(String(Math.min(24, Math.floor((parsed ?? 0) + 1))))}>
                <PlusIcon size={18} weight="bold" />
              </StepButton>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {QUICK_HOURS.map((h) => {
                const selected = parsed === h;
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => {
                      haptic(5);
                      setHoursInput(String(h));
                    }}
                    className={`tabular rounded-full px-4 py-2 text-sm font-bold transition active:scale-95 ${
                      selected ? "bg-paper text-brand" : "bg-white/12 text-white hover:bg-white/20"
                    }`}
                  >
                    {h} hrs
                  </button>
                );
              })}
            </div>
          </fieldset>

          <AnimatePresence initial={false}>
            {course && parsed && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <span className="flex items-center gap-2 rounded-2xl bg-black/15 px-4 py-3 text-[14px] font-semibold">
                  <HourglassMediumIcon size={18} weight="fill" className="shrink-0" />
                  <span>
                    At {hrs(parsed)} a day, you&apos;d cover the syllabus in about{" "}
                    <span className="tabular font-extrabold">{Math.ceil(totalHours(SYLLABUS[course]) / parsed)} days</span>.
                  </span>
                </span>
              </motion.p>
            )}
          </AnimatePresence>

          {error && (
            <p role="alert" className="rounded-2xl bg-paper px-4 py-3 text-sm font-semibold text-brand-deep">
              {error}
            </p>
          )}

          <div>
            <button type="submit" className={`${button("white", "lg")} w-full sm:w-auto`}>
              {unlocked ? "Show my plan" : "Build my plan"}
              <ArrowRightIcon size={20} weight="bold" />
            </button>
            {!unlocked && <p className="mt-2.5 text-[13px] font-semibold text-white/75">Free. Just your name and number to unlock it.</p>}
          </div>
        </form>
      </div>

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Get your study plan"
        description="Tell us who it's for and your plan opens right away."
      >
        <LeadForm
          course={course}
          hours={hours}
          onDone={() => {
            setSheetOpen(false);
            setUnlocked(true);
            reveal();
          }}
        />
      </Sheet>

      <div ref={planRef} className="scroll-mt-20 md:scroll-mt-24">
        <AnimatePresence>
          {showPlan && course && hours && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4 pt-4 md:space-y-6 md:pt-6"
            >
              <Summary subjects={SYLLABUS[course]} completed={completed} hours={hours} onReset={() => setCompleted(new Set())} />
              <CourseContent subjects={SYLLABUS[course]} completed={completed} onToggle={toggle} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function LeadForm({ course, hours, onDone }: { course: CourseId | ""; hours: number | null; onDone: () => void }) {
  // When the form appeared, so the server can spot instant bot submissions.
  const loadedAt = useRef(0);
  useEffect(() => {
    loadedAt.current = Date.now();
  }, []);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const label = COURSES.find((c) => c.id === course)?.label ?? "CLAT";

  async function submit(form: HTMLFormElement) {
    setError(null);
    setBusy(true);
    haptic(12);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          programInterest: label,
          message: `Study planner: ${label}, ${hours ?? "?"} hrs a day`,
          source: "study-planner",
          pageUrl: window.location.href,
          formLoadedAt: loadedAt.current,
          company: (form.elements.namedItem("company") as HTMLInputElement | null)?.value,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      haptic(30);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      className="space-y-5 pt-2"
      onSubmit={(e) => {
        e.preventDefault();
        void submit(e.currentTarget);
      }}
    >
      {/* Honeypot: invisible to people, filled in by bots */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] size-px opacity-0" />

      <label className="block">
        <span className="text-sm font-semibold">Student&apos;s name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          required
          minLength={2}
          placeholder="e.g. Ananya"
          className={`${fieldClass} mt-2`}
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Mobile number</span>
        <span className="relative mt-2 block">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-base font-semibold text-ink-3">+91</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d\s-]/g, "").slice(0, 14))}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            required
            placeholder="98765 43210"
            className={`${fieldClass} pl-13 tabular`}
          />
        </span>
      </label>

      {error && (
        <p role="alert" className="rounded-2xl bg-brand-tint px-4 py-3 text-sm font-semibold text-brand-deep">
          {error}
        </p>
      )}

      <button type="submit" disabled={busy} className={`${button("primary", "lg")} w-full disabled:opacity-70`}>
        {busy ? <CircleNotchIcon size={20} weight="bold" className="animate-spin" /> : <SparkleIcon size={20} weight="fill" />}
        {busy ? "Creating your plan…" : "Get My Study Plan"}
      </button>
      <p className="pb-1 text-center text-[13px] text-ink-3">A counsellor may call to help you stick to it.</p>
    </form>
  );
}

function Summary({
  subjects,
  completed,
  hours,
  onReset,
}: {
  subjects: Subject[];
  completed: Set<string>;
  hours: number;
  onReset: () => void;
}) {
  const { total, done } = useMemo(() => {
    let total = 0;
    let done = 0;
    for (const s of subjects)
      for (const t of s.topics) {
        total += t.hours;
        if (completed.has(t.id)) done += t.hours;
      }
    return { total, done };
  }, [subjects, completed]);
  const remaining = total - done;
  const days = Math.ceil(remaining / hours);
  const end = new Date();
  end.setDate(end.getDate() + days);
  const endLabel = end.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const progress = total ? (done / total) * 100 : 0;

  const tiles = [
    { k: "Total Duration", v: hrs(total) },
    { k: "Completed", v: hrs(done) },
    { k: "Remaining", v: hrs(remaining) },
    { k: "Expected End Date", v: remaining > 0 ? endLabel : "Done!" },
  ];

  return (
    <section aria-label="Course summary" className="rounded-[28px] bg-ink p-5 text-white md:rounded-[36px] md:p-10">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-[22px] font-bold tracking-[-0.02em] md:text-[32px]">
          <span aria-hidden>📊 </span>Course Summary
        </h2>
        {done > 0 && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Clear all completed topics?")) onReset();
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-semibold text-white/80 transition active:scale-95"
          >
            <ArrowCounterClockwiseIcon size={14} weight="bold" /> Reset
          </button>
        )}
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between text-[13px] font-semibold text-white/60">
          <span>Progress</span>
          <span className="tabular">{Math.round(progress)}%</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/12">
          <motion.div
            className="h-full rounded-full bg-brand"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          />
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4">
        {tiles.map((t) => (
          <div key={t.k} className="rounded-[18px] bg-white/8 px-4 py-3.5">
            <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/55">{t.k}</dt>
            <dd className="tabular mt-1 font-display text-[22px] font-extrabold leading-tight tracking-tight md:text-[28px]">{t.v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-[13px] leading-relaxed text-white/60">
        At {hrs(hours)} a day, that&apos;s about {days} {days === 1 ? "day" : "days"} of study left. Change your hours above to see a new end date.
      </p>
    </section>
  );
}

function CourseContent({
  subjects,
  completed,
  onToggle,
}: {
  subjects: Subject[];
  completed: Set<string>;
  onToggle: (topicId: string) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section aria-label="Course content" className="rounded-[28px] bg-mist p-3 md:rounded-[36px] md:p-6">
      <h2 className="px-2 pt-2 pb-3 font-display text-[22px] font-bold tracking-[-0.02em] md:text-[32px]">
        <span aria-hidden>📖 </span>Course Content
      </h2>
      <ul className="space-y-2.5">
        {subjects.map((s) => {
          const expanded = open === s.id;
          const doneTopics = s.topics.filter((t) => completed.has(t.id));
          const total = s.topics.reduce((sum, t) => sum + t.hours, 0);
          const done = doneTopics.reduce((sum, t) => sum + t.hours, 0);
          return (
            <li key={s.id} className="overflow-hidden rounded-[22px] bg-paper">
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => {
                  haptic(5);
                  setOpen(expanded ? null : s.id);
                }}
                className="flex w-full items-center gap-3 px-4 py-4 text-left md:px-6 md:py-5"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-bold leading-tight md:text-lg">{s.name}</span>
                  <span className="tabular mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[13px] font-semibold text-ink-3">
                    <span>📝 {doneTopics.length}/{s.topics.length} Topics</span>
                    <span>⏱️ {done.toFixed(1)}/{total.toFixed(1)} hrs</span>
                  </span>
                  <span className="mt-2.5 block h-1.5 overflow-hidden rounded-full bg-mist">
                    <span className="block h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${(done / total) * 100}%` }} />
                  </span>
                </span>
                <motion.span
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`grid size-8 shrink-0 place-items-center rounded-full ${expanded ? "bg-ink text-white" : "bg-mist text-ink"}`}
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
                    className="divide-y divide-line overflow-hidden border-t border-line"
                  >
                    {s.topics.map((t) => {
                      const isDone = completed.has(t.id);
                      return (
                        <li key={t.id}>
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={isDone}
                            onClick={() => onToggle(t.id)}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-mist md:px-6"
                          >
                            <span
                              className={`grid size-6 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                                isDone ? "border-brand bg-brand text-white" : "border-line-strong"
                              }`}
                            >
                              {isDone && <CheckIcon size={13} weight="bold" />}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className={`block text-[15px] font-semibold leading-snug ${isDone ? "text-ink-3 line-through" : ""}`}>{t.title}</span>
                              <span className="text-[12px] text-ink-3">Duration: {t.hours} {t.hours === 1 ? "hour" : "hours"}</span>
                            </span>
                            <span
                              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                isDone ? "bg-[#e6f6ec] text-[#1a7f43]" : "bg-brand-tint text-brand-deep"
                              }`}
                            >
                              {isDone ? "✓ Completed" : "Pending"}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
