"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Segmented } from "@/components/segmented";

type Slab = { score: string; percent: number };

// Slabs as published on lawpreptutorialdelhi.com/scholarship.
const modes: { label: string; note: string; slabs: Slab[] }[] = [
  {
    label: "Grand test · Offline",
    note: "At the centre",
    slabs: [
      { score: "1–20", percent: 15 },
      { score: "21–30", percent: 20 },
      { score: "31–35", percent: 25 },
      { score: "36–40", percent: 35 },
      { score: "41–45", percent: 40 },
      { score: "46–50", percent: 42 },
      { score: "51–55", percent: 45 },
      { score: "56–60", percent: 100 },
    ],
  },
  {
    label: "Online test",
    note: "From home",
    slabs: [
      { score: "0–20", percent: 10 },
      { score: "21–30", percent: 15 },
      { score: "31–35", percent: 18 },
      { score: "36–45", percent: 20 },
      { score: "45–50", percent: 25 },
      { score: "50–58", percent: 28 },
      { score: "58–60", percent: 100 },
    ],
  },
];

export function ScholarshipSlabs() {
  const [mode, setMode] = useState(0);
  const active = modes[mode];

  return (
    <div>
      <Segmented label="Test mode" options={modes.map((m) => m.label)} value={mode} onChange={setMode} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.ol
          key={mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="mt-4 divide-y divide-line overflow-hidden rounded-[22px] bg-mist"
        >
          <li className="flex items-center px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ink-3 md:px-5">
            <span className="w-20">Score /60</span>
            <span className="flex-1">Fee waiver</span>
          </li>
          {active.slabs.map((s, i) => {
            const top = s.percent === 100;
            return (
              <li key={s.score} className={`flex items-center gap-3 px-4 py-3 md:px-5 ${top ? "bg-sun" : ""}`}>
                <span className="tabular w-[4.25rem] shrink-0 font-bold">{s.score}</span>
                <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-paper/80">
                  <motion.span
                    className={`absolute inset-y-0 left-0 rounded-full ${top ? "bg-ink" : "bg-brand"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${s.percent}%` }}
                    transition={{ delay: 0.05 + i * 0.04, type: "spring", stiffness: 160, damping: 24 }}
                  />
                </span>
                <span className="tabular w-12 shrink-0 text-right font-display text-[19px] font-extrabold">{s.percent}%</span>
              </li>
            );
          })}
        </motion.ol>
      </AnimatePresence>
      <p className="mt-3 text-[13px] text-ink-3">Slabs are confirmed when you register. Ask the counsellor which slab applies at your score.</p>
    </div>
  );
}
