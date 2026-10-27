"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowSquareOutIcon, ListIcon, SignOutIcon } from "@phosphor-icons/react";
import { Logo } from "@/components/logo";
import { Sheet } from "@/components/sheet";
import { haptic } from "@/lib/haptics";
import { AdminIcon } from "./admin-icon";
import { adminNav } from "./nav";

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

async function signOut() {
  await fetch("/api/auth/logout", { method: "POST" });
  // A full reload so no admin data stays in memory after signing out.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = "/admin-login";
}

function NavList({ pathname, onNavigate, dark }: { pathname: string; onNavigate?: () => void; dark?: boolean }) {
  return (
    <ul className="space-y-0.5">
      {adminNav.map((item, i) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            {i === 2 && (
              <p className={`mt-5 mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.14em] ${dark ? "text-white/35" : "text-ink-3"}`}>
                Content
              </p>
            )}
            <Link
              href={item.href}
              onClick={() => {
                haptic(5);
                onNavigate?.();
              }}
              aria-current={active ? "page" : undefined}
              className={`relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-semibold transition-colors ${
                dark
                  ? active
                    ? "text-white"
                    : "text-white/55 hover:bg-white/[0.06] hover:text-white"
                  : active
                    ? "text-ink"
                    : "text-ink-2 hover:bg-mist"
              }`}
            >
              {active && (
                <motion.span
                  layoutId={dark ? "admin-nav-dark" : "admin-nav"}
                  className={`absolute inset-0 rounded-2xl ${dark ? "bg-white/10" : "bg-brand-tint"}`}
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <AdminIcon
                name={item.icon}
                weight={active ? "fill" : "regular"}
                className={`relative ${active ? (dark ? "text-sun" : "text-brand") : ""}`}
              />
              <span className="relative">{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const current = [...adminNav].reverse().find((i) => isActive(pathname, i.href));

  return (
    <div className="min-h-dvh bg-mist">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-ink p-4 text-white lg:flex">
        <Link href="/admin" className="flex items-center gap-3 px-2 pt-2 pb-6">
          <Logo className="h-8" />
          <span className="leading-tight">
            <span className="block text-[13px] font-bold">Noida CMS</span>
            <span className="block text-[11px] text-white/45">Admin</span>
          </span>
        </Link>
        <nav aria-label="Admin" className="-mx-1 flex-1 overflow-y-auto px-1">
          <NavList pathname={pathname} dark />
        </nav>
        <div className="mt-4 space-y-1 border-t border-white/10 pt-4">
          <a href="/" target="_blank" className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-white/55 hover:bg-white/[0.06] hover:text-white">
            <ArrowSquareOutIcon size={18} /> View site
          </a>
          <button type="button" onClick={signOut} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-white/55 hover:bg-white/[0.06] hover:text-white">
            <SignOutIcon size={18} /> Sign out
          </button>
        </div>
      </aside>

      <header
        className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-xl lg:hidden"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => {
              haptic();
              setMenuOpen(true);
            }}
            aria-label="Open menu"
            className="-ml-1 grid size-10 place-items-center rounded-full bg-mist active:scale-90"
          >
            <ListIcon size={20} weight="bold" />
          </button>
          <span className="flex-1 truncate font-display text-[19px] font-bold tracking-[-0.02em]">{current?.label ?? "Admin"}</span>
          <Link href="/admin" aria-label="Dashboard">
            <Logo className="h-7" />
          </Link>
        </div>
      </header>

      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} title="Noida CMS">
        <nav aria-label="Admin" className="pb-2">
          <NavList pathname={pathname} onNavigate={() => setMenuOpen(false)} />
        </nav>
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-4">
          <a href="/" target="_blank" className="flex items-center justify-center gap-2 rounded-full bg-mist py-3 text-sm font-semibold">
            <ArrowSquareOutIcon size={16} /> View site
          </a>
          <button type="button" onClick={signOut} className="flex items-center justify-center gap-2 rounded-full bg-mist py-3 text-sm font-semibold">
            <SignOutIcon size={16} /> Sign out
          </button>
        </div>
      </Sheet>

      <main className="lg:pl-64">
        <div className="mx-auto max-w-5xl px-4 pt-5 pb-28 md:px-8 md:pt-10">{children}</div>
      </main>
    </div>
  );
}

/** Title row used at the top of every admin screen. */
export function AdminHeader({ title, subtitle, actions }: { title: string; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-[30px] font-bold leading-none tracking-[-0.03em] md:text-[40px]">{title}</h1>
        {subtitle && <p className="mt-2 text-[15px] text-ink-2">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
