"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CaretDownIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useEnquiry } from "@/components/enquiry";
import { otherFormats, programs } from "@/lib/data";
import { haptic } from "@/lib/haptics";
import { button } from "@/lib/ui";

function useHash() {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener("hashchange", onChange);
      return () => window.removeEventListener("hashchange", onChange);
    },
    () => window.location.hash.slice(1),
    () => "",
  );
}

export function CourseList() {
  // Deep links like /courses#foundation open that card until the visitor picks one.
  const hash = useHash();
  const [picked, setPicked] = useState<string | null | undefined>(undefined);
  const openSlug =
    picked !== undefined ? picked : programs.some((p) => p.slug === hash) ? hash : programs[1].slug;
  const { open } = useEnquiry();

  return (
    <ul className="space-y-3">
      {programs.map((p, i) => {
        const expanded = openSlug === p.slug;
        return (
          <motion.li
            key={p.slug}
            id={p.slug}
            layout
            transition={{ type: "spring", stiffness: 400, damping: 38 }}
            className={`scroll-mt-24 overflow-hidden rounded-[26px] border transition-colors duration-300 ${
              expanded ? "border-transparent bg-ink text-white" : "border-line bg-paper"
            }`}
          >
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => {
                haptic(5);
                setPicked(expanded ? null : p.slug);
              }}
              className="flex w-full items-center gap-4 p-5 text-left md:p-7"
            >
              <span
                className={`grid size-12 shrink-0 place-items-center rounded-2xl font-display text-lg font-extrabold transition-colors ${
                  expanded ? "bg-brand text-white" : "bg-mist text-ink"
                }`}
              >
                0{i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[24px] font-bold leading-tight tracking-[-0.02em] md:text-[30px]">
                  {p.name}
                </span>
                <span className={`block text-sm font-semibold ${expanded ? "text-white/60" : "text-ink-3"}`}>
                  {p.duration} · For {p.audience}
                </span>
              </span>
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`grid size-9 shrink-0 place-items-center rounded-full ${expanded ? "bg-white/10" : "bg-mist"}`}
              >
                <CaretDownIcon size={16} weight="bold" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 40 }}
                >
                  <div className="px-5 pb-5 md:grid md:grid-cols-[1.4fr_1fr] md:gap-10 md:px-7 md:pb-7">
                    <p className="text-[15px] leading-relaxed text-white/75 md:text-base">{p.detail}</p>
                    <div className="mt-5 md:mt-0">
                      <dl className="grid grid-cols-2 gap-2">
                        <div className="rounded-2xl bg-white/[0.07] px-3.5 py-3">
                          <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">Duration</dt>
                          <dd className="mt-1 text-sm font-semibold">{p.months} months</dd>
                        </div>
                        <div className="rounded-2xl bg-white/[0.07] px-3.5 py-3">
                          <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">Mode</dt>
                          <dd className="mt-1 text-sm font-semibold">Classroom + online</dd>
                        </div>
                      </dl>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => open(p.name, "course")} className={button("primary")}>
                          Enquire
                        </button>
                        <Link href={`/courses/${p.slug}`} className={`${button("ink")} bg-white/10 hover:bg-white/15`}>
                          Full details
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </ul>
  );
}

export function OtherFormats() {
  const { open } = useEnquiry();
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-[22px] bg-mist md:grid md:grid-cols-3 md:gap-4 md:divide-y-0 md:overflow-visible md:rounded-none md:bg-transparent">
      {otherFormats.map((f) => (
        <li key={f.name}>
          <button
            type="button"
            onClick={() => open(f.name, "course")}
            className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-fog active:bg-fog md:h-full md:rounded-[22px] md:bg-mist md:px-6 md:py-5"
          >
            <span className="min-w-0 flex-1">
              <span className="block font-bold">{f.name}</span>
              <span className="block text-sm text-ink-2">{f.note}</span>
            </span>
            <CaretRightIcon size={16} weight="bold" className="text-ink-3" />
          </button>
        </li>
      ))}
    </ul>
  );
}
