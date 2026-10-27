"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PlusIcon } from "@phosphor-icons/react";
import { haptic } from "@/lib/haptics";

export type QA = { question: string; answer: string };

// Collapsed by default so long answers never turn a screen into a wall of text.
export function Accordion({ items, className = "" }: { items: QA[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const id = useId();
  if (items.length === 0) return null;

  return (
    <ul className={`divide-y divide-line overflow-hidden rounded-[22px] bg-mist ${className}`}>
      {items.map((item, i) => {
        const expanded = open === i;
        return (
          <li key={item.question}>
            <h3>
              <button
                type="button"
                id={`${id}-q${i}`}
                aria-expanded={expanded}
                aria-controls={`${id}-a${i}`}
                onClick={() => {
                  haptic(5);
                  setOpen(expanded ? null : i);
                }}
                className="flex w-full items-center gap-4 px-4 py-4 text-left text-[15px] font-bold transition-colors hover:bg-fog md:px-6 md:py-5 md:text-base"
              >
                <span className="flex-1">{item.question}</span>
                <motion.span
                  animate={{ rotate: expanded ? 45 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`grid size-8 shrink-0 place-items-center rounded-full transition-colors ${expanded ? "bg-ink text-white" : "bg-paper text-ink"}`}
                >
                  <PlusIcon size={14} weight="bold" />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  id={`${id}-a${i}`}
                  role="region"
                  aria-labelledby={`${id}-q${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 40 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-5 text-[15px] leading-relaxed whitespace-pre-line text-ink-2 md:px-6">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
