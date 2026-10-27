"use client";

import { useState } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Sheet } from "@/components/sheet";
import { haptic } from "@/lib/haptics";
import { button } from "@/lib/ui";

export type ReadMoreSection = { heading?: string; paragraphs: string[] };

// Keeps long copy off the screen until someone asks for it.
export function ReadMoreSheet({
  label,
  title,
  description,
  sections,
  className,
}: {
  label: string;
  title: string;
  description?: string;
  sections: ReadMoreSection[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          haptic();
          setOpen(true);
        }}
        className={className ?? `${button("quiet")} w-full sm:w-auto`}
      >
        {label} <ArrowRightIcon size={16} weight="bold" />
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title={title} description={description}>
        <div className="space-y-6 pb-2">
          {sections.map((s, i) => (
            <section key={s.heading ?? i}>
              {s.heading && <h3 className="font-display text-lg font-bold tracking-[-0.01em]">{s.heading}</h3>}
              <div className="mt-2 space-y-3 text-[15px] leading-relaxed text-ink-2">
                {s.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Sheet>
    </>
  );
}
