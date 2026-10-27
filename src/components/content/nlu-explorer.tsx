"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRightIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { EmptyState } from "@/components/empty-state";

export type NluCard = { slug: string; name: string; short: string; city: string; rank: string };

export function NluExplorer({ nlus }: { nlus: NluCard[] }) {
  const [query, setQuery] = useState("");
  const q = useDeferredValue(query.trim().toLowerCase());
  const shown = q ? nlus.filter((n) => `${n.name} ${n.short} ${n.city}`.toLowerCase().includes(q)) : nlus;

  return (
    <>
      <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-30 -mx-4 bg-paper/90 px-4 py-3 backdrop-blur-xl md:static md:mx-0 md:bg-transparent md:px-0 md:backdrop-blur-none">
        <label className="relative block md:max-w-md">
          <span className="sr-only">Search NLUs</span>
          <MagnifyingGlassIcon size={18} weight="bold" className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Search by name or city"
            className="h-12 w-full rounded-full border border-transparent bg-mist pr-11 pl-11 text-base outline-none transition placeholder:text-ink-3 focus:border-ink focus:bg-paper [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink-2"
            >
              <XIcon size={14} weight="bold" />
            </button>
          )}
        </label>
      </div>

      {shown.length === 0 ? (
        <div className="mt-3">
          <EmptyState title="No match">Try a city, or a short name like NLSIU.</EmptyState>
        </div>
      ) : (
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-6 md:gap-4 lg:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((nlu) => (
              <motion.li
                key={nlu.slug}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              >
                <Link
                  href={`/resources/nlu-profiles/${nlu.slug}`}
                  className="group flex h-full min-h-[168px] flex-col rounded-[22px] bg-mist p-4 transition-colors hover:bg-fog active:scale-[0.97] md:p-5"
                >
                  <span className="flex items-start justify-between gap-2">
                    {nlu.rank ? (
                      <span className="tabular rounded-full bg-ink px-2.5 py-1 text-[11px] font-extrabold text-white">NIRF {nlu.rank}</span>
                    ) : (
                      <span />
                    )}
                    <ArrowUpRightIcon size={16} weight="bold" className="text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                  <span className="mt-auto pt-6 font-display text-[26px] font-extrabold leading-none tracking-[-0.03em] md:text-[30px]">
                    {nlu.short || nlu.name}
                  </span>
                  <span className="mt-1.5 line-clamp-2 text-[13px] font-semibold leading-snug text-ink-2">
                    {nlu.short ? nlu.name : nlu.city}
                  </span>
                  {nlu.short && nlu.city && <span className="mt-1 text-[12px] font-semibold text-ink-3">{nlu.city}</span>}
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </>
  );
}
