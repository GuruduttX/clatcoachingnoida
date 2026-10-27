"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ListBulletsIcon, SquaresFourIcon } from "@phosphor-icons/react";
import { StoryLayer, topperStories, type StorySession } from "@/components/stories";
import { TopperCard } from "@/components/topper-card";
import { noidaToppers } from "@/lib/data";
import { haptic } from "@/lib/haptics";

const stories = topperStories(noidaToppers);
const schools = ["All", ...new Set(noidaToppers.map((t) => t.nlu))];

export function ResultsExplorer() {
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [session, setSession] = useState<StorySession | null>(null);

  const shown = noidaToppers
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => filter === "All" || t.nlu === filter);

  const openStory = (i: number) => setSession({ stories, start: i });

  return (
    <>
      <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-30 -mx-4 flex items-center gap-2 bg-paper/90 py-3 pr-4 backdrop-blur-xl md:static md:mx-0 md:bg-transparent md:pr-0 md:backdrop-blur-none">
        <div role="group" aria-label="Filter by law school" className="rail min-w-0 flex-1 gap-2 pl-4 [mask-image:linear-gradient(to_right,#000_82%,transparent)] md:flex-wrap md:pl-0 md:[mask-image:none]">
          {schools.map((school) => {
            const active = school === filter;
            const count = school === "All" ? noidaToppers.length : noidaToppers.filter((t) => t.nlu === school).length;
            return (
              <motion.button
                key={school}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  haptic(5);
                  setFilter(school);
                }}
                whileTap={{ scale: 0.92 }}
                className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  active ? "text-white" : "bg-mist text-ink-2 hover:bg-fog"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="school-filter"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
                <span className="relative">
                  {school}
                  <span className={`tabular ml-1.5 ${active ? "text-white/55" : "text-ink-3"}`}>{count}</span>
                </span>
              </motion.button>
            );
          })}
        </div>

        <div role="group" aria-label="View" className="flex shrink-0 rounded-full bg-mist p-1">
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              aria-label={v === "grid" ? "Grid view" : "List view"}
              onClick={() => {
                haptic(5);
                setView(v);
              }}
              className={`relative grid size-8 place-items-center rounded-full transition-colors ${
                view === v ? "text-ink" : "text-ink-3"
              }`}
            >
              {view === v && (
                <motion.span
                  layoutId="view-toggle"
                  className="absolute inset-0 rounded-full bg-paper shadow-card"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative">
                {v === "grid" ? <SquaresFourIcon size={16} weight="bold" /> : <ListBulletsIcon size={16} weight="bold" />}
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {view === "grid" ? (
          <motion.ul
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-6 md:grid-cols-5 md:gap-4"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map(({ t, i }) => (
                <motion.li
                  key={t.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                >
                  <TopperCard topper={t} onOpen={() => openStory(i)} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <motion.ol
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="mt-3 divide-y divide-line overflow-hidden rounded-[22px] bg-mist md:mt-6"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map(({ t, i }) => (
                <motion.li
                  key={t.name}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      haptic();
                      openStory(i);
                    }}
                    className="flex w-full items-center gap-3.5 px-4 py-3 text-left transition-colors hover:bg-fog active:bg-fog md:px-6 md:py-4"
                  >
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-paper">
                      <Image src={t.photo} alt="" fill sizes="48px" className="object-cover object-top" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold">{t.name}</span>
                      <span className="block truncate text-sm text-ink-2">
                        {t.nlu} {t.city} · {t.score}
                      </span>
                    </span>
                    <span className="tabular shrink-0 text-right">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3">AIR</span>
                      <span className="block font-display text-[22px] font-extrabold leading-none tracking-tight">{t.air}</span>
                    </span>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ol>
        )}
      </AnimatePresence>

      <StoryLayer session={session} onClose={() => setSession(null)} />
    </>
  );
}
