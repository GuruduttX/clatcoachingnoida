"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { CaretLeftIcon, PhoneIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import { Logo } from "@/components/logo";
import { OpenStatus } from "@/components/live";
import { useEnquiry } from "@/components/enquiry";
import { haptic } from "@/lib/haptics";
import { setNavDirection } from "@/lib/nav-direction";
import { desktopNav, isActivePath, isRootScreen, parentPath, screenTitle, site, whatsappLink } from "@/lib/site";
import { button } from "@/lib/ui";

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { scrollY } = useScroll();
  const { open } = useEnquiry();
  const [scrolled, setScrolled] = useState(false);
  const [pastTitle, setPastTitle] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 4);
    setPastTitle(y > 80);
  });

  // On inner pages the large page title scrolls away and a compact one takes
  // its place in the bar, the way native iOS and Android screens behave.
  const title = screenTitle(pathname);
  const compactTitle = title && pastTitle ? title : null;
  const nested = !isRootScreen(pathname);

  function goBack() {
    haptic(5);
    setNavDirection(-1);
    // Arriving from another site or a shared link leaves no history to pop.
    if (window.history.length > 1 && document.referrer.startsWith(window.location.origin)) router.back();
    else router.push(parentPath(pathname));
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled ? "border-b border-line/80 bg-paper/80 backdrop-blur-xl backdrop-saturate-150" : "border-b border-transparent bg-paper"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 lg:gap-8 md:h-[68px] md:px-6">
        <div className="relative flex h-full min-w-0 flex-1 items-center md:flex-none">
          {nested && (
            <button
              type="button"
              onClick={goBack}
              aria-label="Back"
              className="-ml-2 mr-1 grid size-10 shrink-0 place-items-center rounded-full text-ink transition active:scale-90 active:bg-mist md:hidden"
            >
              <CaretLeftIcon size={22} weight="bold" />
            </button>
          )}
          <AnimatePresence mode="popLayout" initial={false}>
            {compactTitle ? (
              <motion.span
                key={compactTitle}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
                className="font-display text-[19px] font-bold tracking-[-0.02em] md:hidden"
              >
                {compactTitle}
              </motion.span>
            ) : (
              <motion.span
                key="logo"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
                className="flex items-center gap-3"
              >
                <Link href="/" aria-label="Law Prep Tutorial Noida, home" className="transition active:scale-95">
                  <Logo />
                </Link>
                <span className="leading-tight md:max-lg:hidden">
                  <span className="block text-[13px] font-bold">Noida centre</span>
                  <OpenStatus className="text-[11px] font-semibold text-ink-3" />
                </span>
              </motion.span>
            )}
          </AnimatePresence>
          {compactTitle && (
            <Link href="/" aria-label="Law Prep Tutorial Noida, home" className="hidden md:block">
              <Logo />
            </Link>
          )}
        </div>

        <nav aria-label="Main" className="hidden md:block" onMouseLeave={() => setHovered(null)}>
          <ul className="flex items-center gap-1">
            {desktopNav.map((tab, i) => {
              const active = isActivePath(pathname, tab.href);
              return (
                <li key={tab.href} className={i >= 4 ? "hidden lg:block" : undefined}>
                  <Link
                    href={tab.href}
                    aria-current={active ? "page" : undefined}
                    onMouseEnter={() => setHovered(tab.href)}
                    className={`relative block px-3 py-2 text-[15px] font-semibold lg:px-4 transition-colors ${
                      active ? "text-ink" : "text-ink-3 hover:text-ink"
                    }`}
                  >
                    {hovered === tab.href && (
                      <motion.span
                        layoutId="nav-hover"
                        className="absolute inset-0 rounded-full bg-mist"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-brand"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                    <span className="relative">{tab.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2 md:ml-auto">
          <a
            href={site.phoneHref}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-ink-2 transition-colors hover:bg-mist hover:text-ink xl:flex"
          >
            <PhoneIcon size={16} weight="bold" />
            {site.phone}
          </a>
          <a
            href={whatsappLink("Hi, I have a question about CLAT coaching at the Noida centre.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="grid size-10 place-items-center rounded-full bg-mist text-ink transition active:scale-90 md:hidden"
          >
            <WhatsappLogoIcon size={20} weight="fill" />
          </a>
          <a
            href={site.phoneHref}
            aria-label={`Call ${site.phone}`}
            className="grid size-10 place-items-center rounded-full bg-mist text-ink transition active:scale-90 md:hidden"
          >
            <PhoneIcon size={19} weight="fill" />
          </a>
          <div className="hidden md:block">
            <button type="button" onClick={() => open()} className={`${button("primary", "sm")} h-10 px-5`}>
              <span className="lg:hidden">Book a call</span>
              <span className="hidden lg:inline">Book a counselling call</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// Shown in the prerendered shell of routes whose URL isn't known until request
// time; the real bar replaces it as soon as the request streams in.
export function TopBarFallback() {
  return (
    <header className="sticky top-0 z-40 border-b border-transparent bg-paper" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="mx-auto flex h-14 max-w-6xl items-center px-4 md:h-[68px] md:px-6">
        <Link href="/" aria-label="Law Prep Tutorial Noida, home">
          <Logo />
        </Link>
      </div>
    </header>
  );
}
