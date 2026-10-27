import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, MapPinIcon, PhoneIcon, WhatsappLogoIcon } from "@phosphor-icons/react/ssr";
import { DestIcon } from "@/components/dest-icon";
import { EnquireButton } from "@/components/enquire-button";
import { OpenStatus } from "@/components/live";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { destinations, site, whatsappLink } from "@/lib/site";
import { button } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Explore",
  description: "Everything at LawPrep Tutorial's Noida centre: courses, batches, scholarship, results, faculty and free CLAT resources.",
};

const tones: Record<string, string> = {
  Join: "bg-brand text-white shadow-brand",
  Proof: "bg-sun text-ink",
  Prepare: "bg-ink text-white",
  About: "bg-paper text-ink",
};

export default function ExplorePage() {
  return (
    <>
      <PageHeader eyebrow="Explore" title="Everything, one tap away." />

      <div className="mx-auto max-w-6xl px-4 pb-14 md:px-6 md:pb-28">
        <Reveal>
          <div className="rounded-[26px] bg-ink p-5 text-white md:flex md:items-center md:justify-between md:gap-8 md:p-7">
            <div>
              <OpenStatus long className="rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-bold" />
              <p className="mt-3 font-display text-[24px] font-bold leading-tight tracking-[-0.02em] md:text-[30px]">
                Questions? Talk to a counsellor.
              </p>
              {site.address && (
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-white/65">
                  <MapPinIcon size={15} weight="fill" /> {site.address}
                </p>
              )}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 md:mt-0 md:flex md:shrink-0">
              <a href={site.phoneHref} className={`${button("primary")} px-3`}>
                <PhoneIcon size={18} weight="fill" /> Call
              </a>
              <a
                href={whatsappLink("Hi, I have a question about CLAT coaching at the Noida centre.")}
                target="_blank"
                rel="noopener noreferrer"
                className={`${button("ink")} bg-white/10 px-3 hover:bg-white/15`}
              >
                <WhatsappLogoIcon size={18} weight="fill" /> Chat
              </a>
              <EnquireButton source="other" className={`${button("white")} px-3`}>
                Call me
              </EnquireButton>
            </div>
          </div>
        </Reveal>

        {destinations.map((group, gi) => (
          <Reveal key={group.group} delay={gi * 0.04} className="mt-9 md:mt-14">
            <h2 className="mb-3 text-[13px] font-bold uppercase tracking-[0.14em] text-ink-3 md:mb-5">{group.group}</h2>
            <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex h-full flex-col rounded-[22px] bg-mist p-4 transition-[background-color,transform] duration-150 hover:bg-fog active:scale-[0.97] md:p-5"
                  >
                    <span className={`grid size-11 place-items-center rounded-[16px] ${tones[group.group] ?? "bg-paper text-ink"}`}>
                      <DestIcon name={item.icon} size={22} />
                    </span>
                    <span className="mt-4 flex items-center gap-1 font-bold leading-tight">
                      {item.label}
                      <ArrowRightIcon size={14} weight="bold" className="text-ink-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                    <span className="mt-0.5 text-[13px] leading-snug text-ink-2">{item.note}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </>
  );
}
