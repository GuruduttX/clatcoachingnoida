"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { haptic } from "@/lib/haptics";

export type Chip = { value: string; label: string; count?: number };

// Sticky, swipeable filter chips, like the results screen.
export function FilterChips({
  chips,
  value,
  onChange,
  label,
  trailing,
}: {
  chips: Chip[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  trailing?: React.ReactNode;
}) {
  const id = useId();
  return (
    <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-30 -mx-4 flex items-center gap-2 bg-paper/90 py-3 pr-4 backdrop-blur-xl md:static md:mx-0 md:bg-transparent md:pr-0 md:backdrop-blur-none">
      <div
        role="group"
        aria-label={label}
        className="rail min-w-0 flex-1 gap-2 pl-4 [mask-image:linear-gradient(to_right,#000_85%,transparent)] md:flex-wrap md:pl-0 md:[mask-image:none]"
      >
        {chips.map((chip) => {
          const active = chip.value === value;
          return (
            <motion.button
              key={chip.value}
              type="button"
              aria-pressed={active}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                if (active) return;
                haptic(5);
                onChange(chip.value);
              }}
              className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                active ? "text-white" : "bg-mist text-ink-2 hover:bg-fog"
              }`}
            >
              {active && (
                <motion.span
                  layoutId={`chips-${id}`}
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative">
                {chip.label}
                {chip.count !== undefined && (
                  <span className={`tabular ml-1.5 ${active ? "text-white/55" : "text-ink-3"}`}>{chip.count}</span>
                )}
              </span>
            </motion.button>
          );
        })}
      </div>
      {trailing}
    </div>
  );
}

/** Builds "All" plus one chip per value that actually occurs, in a preferred order. */
export function chipsFrom(values: string[], order: readonly string[] = []): Chip[] {
  const counts = new Map<string, number>();
  for (const v of values) if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
  const known = order.filter((o) => counts.has(o));
  const rest = [...counts.keys()].filter((k) => !order.includes(k)).sort();
  return [
    { value: "all", label: "All", count: values.length },
    ...[...known, ...rest].map((v) => ({ value: v, label: v, count: counts.get(v) })),
  ];
}
