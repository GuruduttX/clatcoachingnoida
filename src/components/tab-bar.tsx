"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import {
  BookOpenTextIcon,
  ChatCircleTextIcon,
  HouseIcon,
  SquaresFourIcon,
  TrophyIcon,
  type Icon,
} from "@phosphor-icons/react";
import { useEnquiry } from "@/components/enquiry";
import { haptic } from "@/lib/haptics";
import { setNavDirection } from "@/lib/nav-direction";
import { tabIndex, tabs } from "@/lib/site";

const icons: Record<(typeof tabs)[number]["href"], Icon> = {
  "/": HouseIcon,
  "/courses": BookOpenTextIcon,
  "/results": TrophyIcon,
  "/explore": SquaresFourIcon,
};

export function TabBar() {
  const pathname = usePathname();
  const { open } = useEnquiry();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  // Slide away while reading down the page, come back on any scroll up,
  // like the tab bars in Instagram or Safari.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const atBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 40;
    if (atBottom || y < prev - 6 || y < 120) setHidden(false);
    else if (y > prev + 6) setHidden(true);
  });

  const [left, right] = [tabs.slice(0, 2), tabs.slice(2)];

  return (
    <motion.nav
      aria-label="Main"
      initial={false}
      animate={{ y: hidden ? "140%" : "0%" }}
      transition={{ type: "spring", stiffness: 420, damping: 40 }}
      className="fixed inset-x-3 z-40 md:hidden"
      style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <ul className="grid h-16 grid-cols-5 items-center rounded-[26px] border border-line/70 bg-paper/85 px-1 shadow-float backdrop-blur-xl backdrop-saturate-150">
        {left.map((tab) => (
          <TabItem key={tab.href} tab={tab} current={tabIndex(pathname)} />
        ))}
        <li className="flex justify-center">
          <motion.button
            type="button"
            onClick={() => open()}
            whileTap={{ scale: 0.86, rotate: -8 }}
            transition={{ type: "spring", stiffness: 600, damping: 22 }}
            aria-label="Enquire"
            className="grid size-12 place-items-center rounded-[18px] bg-brand text-white shadow-brand"
          >
            <ChatCircleTextIcon size={24} weight="fill" />
          </motion.button>
        </li>
        {right.map((tab) => (
          <TabItem key={tab.href} tab={tab} current={tabIndex(pathname)} />
        ))}
      </ul>
    </motion.nav>
  );
}

function TabItem({ tab, current }: { tab: (typeof tabs)[number]; current: number }) {
  const TabIcon = icons[tab.href];
  const index = tabs.indexOf(tab);
  const active = index === current;
  return (
    <li className="h-full">
      <Link
        href={tab.href}
        aria-current={active ? "page" : undefined}
        onClick={() => {
          if (active) return;
          haptic(6);
          setNavDirection(index > current ? 1 : -1);
        }}
        className="relative flex h-full flex-col items-center justify-center gap-0.5"
      >
        <motion.span
          whileTap={{ scale: 0.82 }}
          transition={{ type: "spring", stiffness: 600, damping: 28 }}
          className="relative grid h-8 w-12 place-items-center"
        >
          {active && (
            <motion.span
              layoutId="tab-pill"
              className="absolute inset-0 rounded-full bg-brand-tint"
              transition={{ type: "spring", stiffness: 520, damping: 40 }}
            />
          )}
          <motion.span
            key={String(active)}
            initial={active ? { scale: 0.5, y: 4 } : false}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 16 }}
            className="relative"
          >
            <TabIcon size={22} weight={active ? "fill" : "regular"} className={active ? "text-brand" : "text-ink-2"} />
          </motion.span>
        </motion.span>
        <span className={`text-[10.5px] font-bold transition-colors ${active ? "text-ink" : "text-ink-3"}`}>
          {tab.label}
        </span>
      </Link>
    </li>
  );
}
