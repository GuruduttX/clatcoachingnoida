"use client";

import Image from "next/image";
import { useEffect, useEffectEvent, useRef, useState, useSyncExternalStore, type PointerEvent } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  type AnimationPlaybackControls,
  type MotionValue,
  type PanInfo,
} from "motion/react";
import { CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react";
import { haptic } from "@/lib/haptics";
import type { Photo, Topper } from "@/lib/data";

export type Story = {
  id: string;
  image: string;
  alt: string;
  /** Small label next to the avatar in the header */
  label: string;
  sublabel?: string;
  avatar: string;
  air?: number;
  title?: string;
  meta?: string;
  fit?: "cover" | "contain";
};

export type StorySession = { stories: Story[]; start: number };

export function topperStories(toppers: Topper[]): Story[] {
  return toppers.map((t) => ({
    id: `topper-${t.name}`,
    image: t.photo,
    alt: `${t.name}, AIR ${t.air} in CLAT 2026`,
    label: t.name,
    sublabel: "CLAT 2026",
    avatar: t.photo,
    air: t.air,
    title: t.name,
    meta: `${t.nlu} ${t.city} · Score ${t.score}`,
  }));
}

export function photoStories(photos: Photo[]): Story[] {
  return photos.map((p) => ({
    id: `photo-${p.src}`,
    image: p.src,
    alt: p.alt,
    label: "Noida centre",
    avatar: photos[0].src,
    meta: p.alt,
    fit: p.height > p.width ? "cover" : "contain",
  }));
}

const SEEN_KEY = "lpt-seen-stories";

function readSeenRaw() {
  try {
    return localStorage.getItem(SEEN_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function readSeen(): Set<string> {
  try {
    return new Set(JSON.parse(readSeenRaw()));
  } catch {
    return new Set();
  }
}

// Stories the visitor has already watched, so their ring can turn grey.
export function useSeenStories() {
  const raw = useSyncExternalStore(
    (onChange) => {
      window.addEventListener("lpt-seen", onChange);
      window.addEventListener("storage", onChange);
      return () => {
        window.removeEventListener("lpt-seen", onChange);
        window.removeEventListener("storage", onChange);
      };
    },
    readSeenRaw,
    () => "[]",
  );
  try {
    return new Set<string>(JSON.parse(raw));
  } catch {
    return new Set<string>();
  }
}

function markSeen(id: string) {
  try {
    const seen = readSeen();
    seen.add(id);
    localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
    window.dispatchEvent(new Event("lpt-seen"));
  } catch {}
}

export function StoryLayer({
  session,
  onClose,
}: {
  session: StorySession | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {session && <StoryViewer key="viewer" {...session} onClose={onClose} />}
    </AnimatePresence>
  );
}

const SLIDE_SECONDS = 5;

function StoryViewer({ stories, start, onClose }: StorySession & { onClose: () => void }) {
  const [index, setIndex] = useState(start);
  const [held, setHeld] = useState(false);
  const progress = useMotionValue(0);
  const controls = useRef<AnimationPlaybackControls | null>(null);
  const pressedAt = useRef(0);
  const dragged = useRef(false);
  const story = stories[index];

  // Bumped to replay the first story when tapping "back" on it.
  const [replay, setReplay] = useState(0);

  function go(dir: 1 | -1) {
    haptic(5);
    const next = index + dir;
    if (next >= stories.length) onClose();
    else if (next < 0) setReplay((r) => r + 1);
    else setIndex(next);
  }

  const onFinished = useEffectEvent(() => go(1));
  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  });

  useEffect(() => {
    markSeen(stories[index].id);
    progress.set(0);
    const c = animate(progress, 1, {
      duration: SLIDE_SECONDS,
      ease: "linear",
      onComplete: onFinished,
    });
    controls.current = c;
    return () => c.stop();
  }, [index, replay, stories, progress]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  function hold() {
    pressedAt.current = Date.now();
    dragged.current = false;
    controls.current?.pause();
    setHeld(true);
  }

  function release(e: PointerEvent<HTMLDivElement>) {
    controls.current?.play();
    setHeld(false);
    if (dragged.current || Date.now() - pressedAt.current > 250) return;
    const rect = e.currentTarget.getBoundingClientRect();
    go(e.clientX - rect.left < rect.width / 3 ? -1 : 1);
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.y > 120 || info.velocity.y > 700) onClose();
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={story.alt}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black md:bg-black/90 md:backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        aria-label="Previous"
        onClick={() => go(-1)}
        className="absolute left-[calc(50%-290px)] hidden size-11 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25 active:scale-90 md:grid"
      >
        <CaretLeftIcon size={20} weight="bold" />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => go(1)}
        className="absolute right-[calc(50%-290px)] hidden size-11 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25 active:scale-90 md:grid"
      >
        <CaretRightIcon size={20} weight="bold" />
      </button>

      <motion.div
        className="no-select relative h-full w-full touch-none overflow-hidden bg-ink md:aspect-[9/16] md:h-[min(88dvh,820px)] md:w-auto md:rounded-[28px]"
        initial={{ scale: 0.92, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 36 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.8 }}
        onDragStart={() => (dragged.current = true)}
        onDragEnd={onDragEnd}
        onPointerDown={hold}
        onPointerUp={release}
        onPointerCancel={() => {
          controls.current?.play();
          setHeld(false);
        }}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={story.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {story.fit === "contain" && (
              <Image src={story.image} alt="" fill sizes="10vw" className="scale-125 object-cover opacity-50 blur-2xl" />
            )}
            <Image
              src={story.image}
              alt={story.alt}
              fill
              loading="eager"
              sizes="(min-width: 768px) 480px, 100vw"
              className={story.fit === "contain" ? "object-contain" : "object-cover object-top"}
            />
          </motion.div>
        </AnimatePresence>
        {stories[index + 1] && (
          <link rel="preload" as="image" href={stories[index + 1].image} />
        )}

        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{ opacity: held ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-x-0 top-0 h-36 bg-linear-to-b from-black/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-linear-to-t from-black/85 via-black/40 to-transparent" />

          <div
            className="absolute inset-x-0 top-0 px-3"
            style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
          >
            <div className="flex gap-1">
              {stories.map((s, i) => (
                <ProgressBar key={s.id} state={i < index ? "done" : i === index ? "active" : "todo"} progress={progress} />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2.5">
              <span className="relative size-8 overflow-hidden rounded-full ring-2 ring-white/80">
                <Image src={story.avatar} alt="" fill sizes="32px" className="object-cover object-top" />
              </span>
              <span className="text-sm font-semibold text-white">{story.label}</span>
              {story.sublabel && <span className="text-sm text-white/60">{story.sublabel}</span>}
            </div>
          </div>

          <div
            className="absolute inset-x-0 bottom-0 px-5"
            style={{ paddingBottom: "max(1.75rem, env(safe-area-inset-bottom))" }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {story.air !== undefined && (
                  <p className="inline-flex items-baseline gap-2 rounded-2xl bg-sun px-3.5 py-1.5 text-ink">
                    <span className="text-xs font-bold uppercase tracking-[0.14em]">AIR</span>
                    <span className="tabular font-display text-[34px] font-extrabold leading-none tracking-tight">
                      {story.air}
                    </span>
                  </p>
                )}
                {story.title && (
                  <p className="mt-3 font-display text-[34px] font-bold leading-none tracking-[-0.02em] text-white">
                    {story.title}
                  </p>
                )}
                {story.meta && <p className="mt-2 text-[15px] text-white/80">{story.meta}</p>}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <button
          type="button"
          aria-label="Close"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onClick={onClose}
          className="absolute right-2 grid size-11 place-items-center text-white active:scale-90"
          style={{ top: "max(1.6rem, calc(env(safe-area-inset-top) + 0.85rem))" }}
        >
          <XIcon size={24} weight="bold" />
        </button>
      </motion.div>
    </motion.div>
  );
}

function ProgressBar({ state, progress }: { state: "done" | "active" | "todo"; progress: MotionValue<number> }) {
  return (
    <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
      {state === "done" && <span className="absolute inset-0 bg-white" />}
      {state === "active" && (
        <motion.span className="absolute inset-0 origin-left bg-white" style={{ scaleX: progress }} />
      )}
    </span>
  );
}
