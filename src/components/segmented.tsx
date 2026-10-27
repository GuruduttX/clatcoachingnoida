"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { haptic } from "@/lib/haptics";

export function Segmented({
  options,
  value,
  onChange,
  label,
}: {
  options: string[];
  value: number;
  onChange: (index: number) => void;
  label: string;
}) {
  const id = useId();
  return (
    <div
      role="tablist"
      aria-label={label}
      className="grid rounded-full bg-mist p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option, i) => {
        const active = i === value;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => {
              if (active) return;
              haptic(5);
              onChange(i);
            }}
            className={`relative h-10 rounded-full text-sm font-semibold transition-colors duration-200 ${
              active ? "text-ink" : "text-ink-3 hover:text-ink-2"
            }`}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-full bg-paper shadow-card"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
