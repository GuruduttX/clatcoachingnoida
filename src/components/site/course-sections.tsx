"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { useEnquiry } from "@/components/enquiry";
import { Segmented } from "@/components/segmented";
import { courseDetails, programs } from "@/lib/data";
import { button } from "@/lib/ui";

const MAX_MONTHS = 24;

// Desktop view of the three batches. Phones keep the tap-to-open CourseList.
export function CourseGrid() {
  const { open } = useEnquiry();

  return (
    <ul className="grid grid-cols-3 gap-4">
      {programs.map((p, i) => {
        const detail = courseDetails[p.slug];
        const dark = i === 1;
        return (
          <li
            key={p.slug}
            id={`${p.slug}-card`}
            className={`group flex flex-col rounded-[28px] p-6 transition-transform duration-300 hover:-translate-y-1 ${
              dark ? "bg-ink text-white" : "bg-mist"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`grid size-11 place-items-center rounded-2xl font-display text-lg font-extrabold ${
                  dark ? "bg-brand text-white" : "bg-paper text-ink"
                }`}
              >
                0{i + 1}
              </span>
              <span className={`rounded-full px-3 py-1 text-[13px] font-semibold ${dark ? "bg-white/10 text-white/85" : "bg-paper text-ink-2"}`}>
                For {p.audience}
              </span>
            </div>

            <h3 className="mt-5 font-display text-[30px] font-bold leading-none tracking-[-0.03em]">{p.name}</h3>
            <p className={`mt-2 text-[15px] leading-relaxed ${dark ? "text-white/70" : "text-ink-2"}`}>{p.summary}</p>

            <p className="mt-5 flex items-baseline gap-1.5">
              <span className="tabular font-display text-[40px] font-extrabold leading-none tracking-[-0.04em]">{p.months}</span>
              <span className={`text-sm font-bold ${dark ? "text-white/55" : "text-ink-3"}`}>months</span>
            </p>
            <div className="mt-3 flex gap-[3px]" aria-hidden>
              {Array.from({ length: MAX_MONTHS }, (_, m) => (
                <span
                  key={m}
                  className={`h-1.5 flex-1 rounded-full ${m < p.months ? "bg-brand" : dark ? "bg-white/12" : "bg-line-strong/60"}`}
                />
              ))}
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-2">
              {[
                { k: "Teaching", v: detail.hours },
                { k: "Schedule", v: detail.schedule },
              ].map((f) => (
                <div key={f.k} className={`rounded-2xl px-3.5 py-3 ${dark ? "bg-white/[0.07]" : "bg-paper"}`}>
                  <dt className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${dark ? "text-white/45" : "text-ink-3"}`}>{f.k}</dt>
                  <dd className="mt-1 text-sm font-semibold">{f.v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
              <button type="button" onClick={() => open(p.name, "course")} className={button("primary")}>
                Enquire
              </button>
              <Link
                href={`/courses/${p.slug}`}
                className={dark ? `${button("ink")} bg-white/10 hover:bg-white/15` : button("white")}
              >
                Details
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function CourseRoadmap() {
  const [index, setIndex] = useState(1);
  const program = programs[index];
  const detail = courseDetails[program.slug];
  const { open } = useEnquiry();

  return (
    <div>
      <div className="md:max-w-md">
        <Segmented label="Batch" options={programs.map((p) => p.name)} value={index} onChange={setIndex} />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.ol
          key={program.slug}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-4 grid gap-2.5 md:mt-6 md:grid-cols-3 md:gap-4"
        >
          {detail.phases.map((phase, i) => (
            <li key={phase.title} className="relative flex gap-4 rounded-[22px] bg-mist p-4 md:flex-col md:gap-0 md:p-6">
              <span
                className={`tabular grid size-11 shrink-0 place-items-center rounded-2xl font-display text-lg font-extrabold ${
                  i === 0 ? "bg-brand text-white shadow-brand" : "bg-paper"
                }`}
              >
                {i + 1}
              </span>
              <div className="min-w-0 md:mt-5">
                <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-brand">{phase.span}</p>
                <p className="mt-1 font-display text-[19px] font-bold leading-tight tracking-[-0.02em] md:text-[22px]">{phase.title}</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2 md:text-[15px]">{phase.focus}</p>
              </div>
            </li>
          ))}
        </motion.ol>
      </AnimatePresence>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 md:mt-6">
        <button type="button" onClick={() => open(program.name, "course")} className={button("primary")}>
          Ask about {program.name}
        </button>
        <Link href={`/courses/${program.slug}`} className="group inline-flex items-center gap-1 text-[15px] font-bold text-brand">
          Full {program.name} plan
          <ArrowRightIcon size={15} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
