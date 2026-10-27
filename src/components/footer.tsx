import Link from "next/link";
import { Logo } from "@/components/logo";
import { destinations, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-mist">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.3fr_repeat(3,1fr)] md:px-6 md:py-16">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-2">
            The Noida centre of LawPrep Tutorial. Coaching for CLAT, AILET and other law entrance exams.
          </p>
          <ul className="mt-5 space-y-2 text-sm font-medium text-ink-2">
            <li>
              <a href={site.phoneHref} className="transition-colors hover:text-ink">
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="break-all transition-colors hover:text-ink">
                {site.email}
              </a>
            </li>
            {site.address && <li className="max-w-xs">{site.address}</li>}
          </ul>
        </div>

        {/* Hidden on phones: the Explore tab already lists every screen there. */}
        {destinations.slice(0, 3).map((group) => (
          <div key={group.group} className="hidden md:block">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-3">{group.group}</h2>
            <ul className="mt-4 space-y-2.5 text-sm font-medium">
              {group.items.slice(0, 6).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-ink-2 transition-colors hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-ink-3 sm:flex-row sm:justify-between md:px-6">
          <p>© LawPrep Tutorial · Noida centre</p>
          <div className="flex gap-4">
            <Link href="/about" className="transition-colors hover:text-ink">
              About
            </Link>
            <a href={site.parentUrl} className="transition-colors hover:text-ink">
              LawPrep Tutorial Delhi NCR →
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
