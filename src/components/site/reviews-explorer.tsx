"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ReviewCard, type ReviewItem } from "@/components/site/review-card";
import { haptic } from "@/lib/haptics";

export function ReviewsExplorer({ reviews }: { reviews: ReviewItem[] }) {
  // Noida first, then the other centres by how many reviews they have.
  const centres = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of reviews) counts.set(r.centre, (counts.get(r.centre) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => (a[0] === "Noida" ? -1 : b[0] === "Noida" ? 1 : b[1] - a[1]));
  }, [reviews]);

  const [filter, setFilter] = useState(centres.some(([c]) => c === "Noida") ? "Noida" : "All");
  const shown = filter === "All" ? reviews : reviews.filter((r) => r.centre === filter);
  const options: [string, number][] = [...centres, ["All", reviews.length]];

  return (
    <>
      <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-30 -mx-4 bg-paper/90 py-3 backdrop-blur-xl md:static md:mx-0 md:bg-transparent md:backdrop-blur-none">
        <div role="group" aria-label="Filter by centre" className="rail gap-2 px-4 md:flex-wrap md:px-0">
          {options.map(([name, count]) => {
            const active = name === filter;
            return (
              <motion.button
                key={name}
                type="button"
                aria-pressed={active}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  haptic(5);
                  setFilter(name);
                }}
                className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  active ? "text-white" : "bg-mist text-ink-2 hover:bg-fog"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="review-filter"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
                <span className="relative">
                  {name}
                  <span className={`tabular ml-1.5 ${active ? "text-white/55" : "text-ink-3"}`}>{count}</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <motion.div
        key={filter}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-3 gap-3 md:mt-6 md:columns-2 md:gap-4 lg:columns-3"
      >
        {shown.map((r) => (
          <ReviewCard key={r.id} review={r} className="mb-3 break-inside-avoid md:mb-4" />
        ))}
      </motion.div>
    </>
  );
}
