"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EmptyState } from "@/components/empty-state";
import { ContentCard, type CardData } from "./content-card";
import { chipsFrom, FilterChips } from "./filter-chips";

export type ExplorerItem = CardData & { group: string; section?: string };

// Filterable card grid. `section` (e.g. a month) splits the grid into headed groups.
export function CardExplorer({
  items,
  order = [],
  filterLabel,
  tone,
}: {
  items: ExplorerItem[];
  order?: readonly string[];
  filterLabel: string;
  tone?: "mist" | "ink" | "sun";
}) {
  const [filter, setFilter] = useState("all");
  const chips = chipsFrom(
    items.map((i) => i.group),
    order,
  );
  const shown = items.filter((i) => filter === "all" || i.group === filter);

  const sections: { title: string | null; items: ExplorerItem[] }[] = [];
  for (const item of shown) {
    const title = item.section ?? null;
    const last = sections.at(-1);
    if (last && last.title === title) last.items.push(item);
    else sections.push({ title, items: [item] });
  }

  return (
    <>
      {chips.length > 2 && <FilterChips label={filterLabel} chips={chips} value={filter} onChange={setFilter} />}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-3 space-y-8 md:mt-6"
        >
          {shown.length === 0 && <EmptyState title="Nothing here yet">Try another filter.</EmptyState>}
          {sections.map((section, s) => (
            <section key={`${section.title}-${s}`}>
              {section.title && (
                <h2 className="mb-3 text-[13px] font-bold uppercase tracking-[0.12em] text-ink-3">{section.title}</h2>
              )}
              <ul className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
                {section.items.map((item, i) => (
                  <li key={item.href}>
                    <ContentCard card={item} priority={s === 0 && i < 2} tone={tone} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
