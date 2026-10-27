"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { photoStories, StoryLayer, type StorySession } from "@/components/stories";
import { centrePhotos } from "@/lib/data";
import { haptic } from "@/lib/haptics";

const photos = centrePhotos.filter((p) => p.width > p.height);
const stories = photoStories(photos);

// Full-bleed swipeable header with page dots, like a listing in a native app.
export function PhotoCarousel() {
  const ref = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [session, setSession] = useState<StorySession | null>(null);

  function onScroll() {
    const el = ref.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== active) {
      setActive(i);
      haptic(3);
    }
  }

  function goTo(i: number) {
    ref.current?.scrollTo({ left: i * ref.current.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <ul
        ref={ref}
        onScroll={onScroll}
        className="rail aspect-[4/3] overflow-y-hidden rounded-[28px] bg-mist md:aspect-[16/9] md:rounded-[36px]"
      >
        {photos.map((photo, i) => (
          <li key={photo.src} className="relative h-full w-full shrink-0">
            <button
              type="button"
              aria-label={`${photo.alt}. Open full screen`}
              onClick={() => setSession({ stories, start: i })}
              className="absolute inset-0"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                loading={i === 0 ? "eager" : undefined}
                fetchPriority={i === 0 ? "high" : undefined}
                sizes="(min-width: 1152px) 1100px, 100vw"
                className="object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-3.5">
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-2 backdrop-blur-md">
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              aria-label={`Photo ${i + 1}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
              className="grid h-2 place-items-center"
            >
              <motion.span
                className="block h-1.5 rounded-full bg-white"
                animate={{ width: i === active ? 18 : 6, opacity: i === active ? 1 : 0.5 }}
                transition={{ type: "spring", stiffness: 500, damping: 34 }}
              />
            </button>
          ))}
        </div>
      </div>

      <span className="tabular absolute top-3.5 right-3.5 rounded-full bg-black/35 px-2.5 py-1 text-[12px] font-bold text-white backdrop-blur-md">
        {active + 1}/{photos.length}
      </span>

      <StoryLayer session={session} onClose={() => setSession(null)} />
    </div>
  );
}
