"use client";

import { AnimatePresence, motion } from "motion/react";
import { centreStatus, greeting, useMinute } from "@/lib/clock";

// Time-aware bits. They render nothing on the server and fade in on the client,
// so the static HTML never shows the wrong time of day.

export function OpenStatus({ long = false, className = "" }: { long?: boolean; className?: string }) {
  const minute = useMinute();
  const status = minute === null ? null : centreStatus(minute);

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="relative flex size-2">
        {status?.open && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />}
        <span
          className={`relative size-2 rounded-full transition-colors ${
            status === null ? "bg-line-strong" : status.open ? "bg-emerald-500" : "bg-ink-3"
          }`}
        />
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={status ? (long ? status.long : status.short) : "…"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {status ? (long ? status.long : status.short) : "Office hours"}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Greeting() {
  const minute = useMinute();
  return (
    <motion.span
      key={minute === null ? "ssr" : "client"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {minute === null ? "Welcome" : greeting(minute)}
    </motion.span>
  );
}
