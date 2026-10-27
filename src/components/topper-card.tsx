"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Topper } from "@/lib/data";
import { haptic } from "@/lib/haptics";

export function TopperCard({ topper, onOpen }: { topper: Topper; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      onClick={() => {
        haptic();
        onOpen();
      }}
      aria-label={`${topper.name}, AIR ${topper.air}, ${topper.nlu} ${topper.city}. Open story`}
      className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[22px] bg-mist text-left"
    >
      <Image
        src={topper.photo}
        alt=""
        fill
        sizes="(min-width: 1024px) 220px, (min-width: 768px) 30vw, 45vw"
        className="object-cover object-top transition duration-700 ease-out group-hover:scale-[1.06]"
      />
      <span className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-black/85 via-black/35 to-transparent" />
      <span className="tabular absolute top-2.5 left-2.5 rounded-full bg-sun px-2.5 py-1 text-[12px] font-extrabold text-ink shadow-sm">
        AIR {topper.air}
      </span>
      <span className="absolute inset-x-3 bottom-3 text-white">
        <span className="block truncate text-[15px] font-bold leading-tight">{topper.name}</span>
        <span className="mt-0.5 block truncate text-[12px] text-white/75">
          {topper.nlu} {topper.city}
        </span>
      </span>
    </motion.button>
  );
}
