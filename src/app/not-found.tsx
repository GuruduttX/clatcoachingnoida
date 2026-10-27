import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { button } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

// Root-level, so it renders without the site chrome: keep it self-contained.
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
      <Link href="/" aria-label="Home">
        <Logo />
      </Link>
      <p className="tabular mt-10 font-display text-[110px] font-extrabold leading-none tracking-[-0.06em] md:text-[160px]">
        4<span className="text-brand">0</span>4
      </p>
      <h1 className="mt-2 font-display text-[28px] font-bold tracking-[-0.03em] md:text-[36px]">This page took a wrong turn.</h1>
      <p className="mt-2 max-w-sm text-[16px] text-ink-2">It may have moved, or the link might be mistyped.</p>
      <div className="mt-8 grid w-full max-w-sm grid-cols-2 gap-2.5">
        <Link href="/" className={button("primary", "lg")}>
          Go home
        </Link>
        <Link href="/explore" className={button("quiet", "lg")}>
          Explore
        </Link>
      </div>
    </main>
  );
}
