"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { photoStories, StoryLayer, topperStories, useSeenStories, type StorySession } from "@/components/stories";
import { centrePhotos, noidaToppers } from "@/lib/data";
import { haptic } from "@/lib/haptics";

const centre = photoStories(centrePhotos);
const toppers = topperStories(noidaToppers);

export function StoryRail() {
  const seen = useSeenStories();
  const [session, setSession] = useState<StorySession | null>(null);

  return (
    <>
      <ul aria-label="Stories" className="rail -mx-4 scroll-pl-4 gap-3 px-4 pt-1 pb-2 md:mx-0 md:px-0">
        <li>
          <StoryBubble
            image={centrePhotos[1].src}
            label="Our centre"
            seen={centre.every((s) => seen.has(s.id))}
            onOpen={() => setSession({ stories: centre, start: 0 })}
          />
        </li>
        {noidaToppers.map((t, i) => (
          <li key={t.name}>
            <StoryBubble
              image={t.photo}
              label={t.name.split(" ")[0]}
              badge={`AIR ${t.air}`}
              seen={seen.has(toppers[i].id)}
              onOpen={() => setSession({ stories: toppers, start: i })}
            />
          </li>
        ))}
      </ul>
      <StoryLayer session={session} onClose={() => setSession(null)} />
    </>
  );
}

function StoryBubble({
  image,
  label,
  badge,
  seen,
  onOpen,
}: {
  image: string;
  label: string;
  badge?: string;
  seen: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 500, damping: 26 }}
      onClick={() => {
        haptic();
        onOpen();
      }}
      className="flex w-[74px] flex-col items-center"
    >
      <span
        className={`relative rounded-full p-[2.5px] transition-colors duration-500 ${seen ? "bg-line-strong" : "story-ring"}`}
      >
        <span className="block rounded-full bg-paper p-[2.5px]">
          <span className="relative block size-[62px] overflow-hidden rounded-full bg-mist">
            <Image src={image} alt="" fill sizes="64px" className="object-cover object-top" />
          </span>
        </span>
        {badge && (
          <span className="tabular absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[7px] bg-brand px-1.5 py-[2px] text-[10px] font-extrabold tracking-wide text-white ring-[2.5px] ring-paper">
            {badge}
          </span>
        )}
      </span>
      <span className="mt-3 max-w-full truncate text-xs font-semibold text-ink-2">{label}</span>
    </motion.button>
  );
}
