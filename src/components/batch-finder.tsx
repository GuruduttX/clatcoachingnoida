"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react";
import { Segmented } from "@/components/segmented";
import { Sheet } from "@/components/sheet";
import { useEnquiry } from "@/components/enquiry";
import { programs } from "@/lib/data";
import { haptic } from "@/lib/haptics";
import { button } from "@/lib/ui";

const MAX_MONTHS = 24;

export function BatchFinder() {
  const [[index, dir], setState] = useState<[number, number]>([1, 0]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { open } = useEnquiry();
  const program = programs[index];

  function select(next: number) {
    if (next < 0 || next >= programs.length || next === index) return;
    setState([next, next > index ? 1 : -1]);
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (Math.abs(info.offset.x) < 60 && Math.abs(info.velocity.x) < 400) return;
    haptic(5);
    select(index + (info.offset.x < 0 ? 1 : -1));
  }

  return (
    <div>
      <Segmented
        label="I am in"
        options={programs.map((p) => p.stage)}
        value={index}
        onChange={select}
      />

      <div className="relative mt-4">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.article
            key={program.slug}
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: d * 70, opacity: 0, scale: 0.97 }),
              center: { x: 0, opacity: 1, scale: 1 },
              exit: (d: number) => ({ x: d * -70, opacity: 0, scale: 0.97 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 420, damping: 38 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={onDragEnd}
            className="no-select relative touch-pan-y overflow-hidden rounded-[28px] bg-ink p-5 text-white md:p-6"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/10 px-3 py-1 text-[13px] font-semibold text-white/85">
                For {program.audience}
              </span>
              <span className="text-[13px] font-semibold text-white/45">Swipe for more</span>
            </div>

            <p className="mt-8 flex items-baseline gap-2 md:mt-5">
              <span className="tabular font-display text-[72px] font-extrabold leading-[0.85] tracking-[-0.04em] md:text-[64px]">
                {program.months}
              </span>
              <span className="text-lg font-bold text-white/55">months</span>
            </p>

            <div className="mt-5 flex gap-[3px]" aria-hidden>
              {Array.from({ length: MAX_MONTHS }, (_, i) => (
                <motion.span
                  key={i}
                  className="h-2 flex-1 rounded-full"
                  initial={false}
                  animate={{ backgroundColor: i < program.months ? "#e40014" : "rgba(255,255,255,0.12)" }}
                  transition={{ delay: i * 0.018, duration: 0.25 }}
                />
              ))}
            </div>

            <h3 className="mt-6 font-display text-[28px] md:mt-5 md:text-[24px] font-bold leading-none tracking-[-0.02em]">
              {program.name} batch
            </h3>
            <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-white/70">{program.summary}</p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <Fact label="Mode" value="Classroom + online" />
              <Fact label="Prepares for" value="CLAT · AILET" />
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => open(program.name, "course")}
                className={`${button("primary")} flex-1`}
              >
                Enquire
              </button>
              <button
                type="button"
                onClick={() => {
                  haptic();
                  setDetailsOpen(true);
                }}
                className={`${button("ink")} bg-white/10 hover:bg-white/15`}
              >
                Details
              </button>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      <Sheet
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={`${program.name} batch`}
        description={`${program.duration} · For ${program.audience}`}
      >
        <p className="text-[15px] leading-relaxed text-ink-2">{program.detail}</p>
        <ul className="mt-5 divide-y divide-line rounded-2xl bg-mist">
          {[
            `${program.months} months of preparation`,
            "Classroom at the Noida centre, or live online",
            "Covers CLAT (UG), AILET and other law entrance tests",
          ].map((line) => (
            <li key={line} className="flex items-start gap-3 px-4 py-3.5 text-[15px] font-medium">
              <CheckIcon size={18} weight="bold" className="mt-0.5 shrink-0 text-brand" />
              {line}
            </li>
          ))}
        </ul>
        <div className="mt-6 grid gap-2">
          <button
            type="button"
            onClick={() => {
              setDetailsOpen(false);
              open(program.name, "course");
            }}
            className={`${button("primary", "lg")} w-full`}
          >
            Enquire about {program.name}
          </button>
          <Link href={`/courses/${program.slug}`} className={`${button("quiet", "lg")} w-full`}>
            Full course details <ArrowRightIcon size={16} weight="bold" />
          </Link>
        </div>
      </Sheet>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.07] px-3.5 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
