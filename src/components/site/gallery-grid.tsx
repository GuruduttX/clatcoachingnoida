"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Segmented } from "@/components/segmented";
import { StoryLayer, type Story, type StorySession } from "@/components/stories";
import { centrePhotos } from "@/lib/data";
import { eventPhotos, noidaCentrePhotos } from "@/lib/gallery";
import { haptic } from "@/lib/haptics";

type Shot = { src: string; alt: string };

const albums: { label: string; title: string; shots: Shot[] }[] = [
  {
    label: "Centre",
    title: "Noida centre",
    shots: [
      ...centrePhotos.map((p) => ({ src: p.src, alt: p.alt })),
      ...noidaCentrePhotos.map((src, i) => ({ src, alt: `Inside the Noida centre, photo ${i + 1}` })),
    ],
  },
  {
    label: "Events",
    title: "Felicitation 2026",
    shots: eventPhotos.map((src, i) => ({ src, alt: `CLAT 2026 felicitation, photo ${i + 1}` })),
  },
];

function toStories(album: (typeof albums)[number]): Story[] {
  return album.shots.map((s) => ({
    id: `gallery-${s.src}`,
    image: s.src,
    alt: s.alt,
    label: album.title,
    avatar: album.shots[0].src,
    fit: "contain",
  }));
}

// Every few tiles span two rows, so the grid reads like a photo app rather than a spreadsheet.
const isTall = (i: number) => i % 5 === 0;

export function GalleryGrid() {
  const [tab, setTab] = useState(0);
  const [session, setSession] = useState<StorySession | null>(null);
  const album = albums[tab];

  return (
    <>
      <div className="md:max-w-sm">
        <Segmented label="Album" options={albums.map((a) => `${a.label} · ${a.shots.length}`)} value={tab} onChange={setTab} />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={tab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="mt-4 grid auto-rows-[140px] grid-flow-dense grid-cols-2 gap-2 sm:grid-cols-3 md:mt-6 md:auto-rows-[200px] md:grid-cols-4 md:gap-3"
        >
          {album.shots.map((shot, i) => (
            <li key={shot.src} className={isTall(i) ? "row-span-2" : ""}>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  haptic();
                  setSession({ stories: toStories(album), start: i });
                }}
                aria-label={`${shot.alt}. Open photo`}
                className="group relative block h-full w-full overflow-hidden rounded-[18px] bg-mist md:rounded-[22px]"
              >
                <Image
                  src={shot.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
                />
              </motion.button>
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>

      <StoryLayer session={session} onClose={() => setSession(null)} />
    </>
  );
}
