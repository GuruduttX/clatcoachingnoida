"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { photoStories, StoryLayer, type StorySession } from "@/components/stories";
import { centrePhotos } from "@/lib/data";
import { haptic } from "@/lib/haptics";

const stories = photoStories(centrePhotos);

export function Gallery() {
  const [session, setSession] = useState<StorySession | null>(null);

  return (
    <>
      <ul className="rail -mx-4 scroll-pl-4 gap-3 px-4 md:mx-0 md:grid md:auto-rows-[150px] md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0">
        {centrePhotos.map((photo, i) => (
          <li
            key={photo.src}
            className={`w-[74%] shrink-0 sm:w-[46%] md:w-auto ${i === 0 ? "md:col-span-2 md:row-span-2" : ""} ${
              i === centrePhotos.length - 1 ? "md:col-span-2" : ""
            }`}
          >
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                haptic();
                setSession({ stories, start: i });
              }}
              aria-label={`${photo.alt}. Open photo`}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[22px] bg-mist md:aspect-auto md:h-full"
            >
              <Image
                src={photo.src}
                alt=""
                fill
                sizes="(min-width: 768px) 40vw, 75vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
              />
            </motion.button>
          </li>
        ))}
      </ul>
      <StoryLayer session={session} onClose={() => setSession(null)} />
    </>
  );
}
