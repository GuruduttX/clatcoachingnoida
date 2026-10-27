import type { Metadata } from "next";
import { ArrowUpRightIcon, MapTrifoldIcon, PhoneIcon, WhatsappLogoIcon } from "@phosphor-icons/react/ssr";
import { ContactList } from "@/components/contact-list";
import { EnquiryForm } from "@/components/enquiry";
import { OpenStatus } from "@/components/live";
import { PhotoCarousel } from "@/components/photo-carousel";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/page-header";
import { ncrCentres } from "@/lib/data";
import { site, whatsappLink } from "@/lib/site";
import { button } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Visit the centre",
  description: "Visit or contact LawPrep Tutorial's Noida centre for CLAT and AILET coaching.",
};

export default function VisitPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-2 pb-14 md:px-6 md:pt-10 md:pb-28">
      <PhotoCarousel />

      <div className="mt-6 md:mt-10 md:grid md:grid-cols-[1.25fr_1fr] md:gap-14">
        <div>
          <OpenStatus long className="rounded-full bg-mist px-3 py-1.5 text-[13px] font-bold" />
          <h1 className="mt-3 font-display text-[40px] font-bold leading-[0.98] tracking-[-0.04em] md:text-[64px]">
            Visit the Noida centre
          </h1>
          <p className="mt-3 max-w-md text-[16px] leading-relaxed text-ink-2">
            Meet the team and get a plan for your preparation before you decide on a batch.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2.5">
            <a href={site.phoneHref} className={button("primary", "lg")}>
              <PhoneIcon size={18} weight="fill" /> Call now
            </a>
            <a
              href={whatsappLink("Hi, I'd like to visit the LawPrep Noida centre.")}
              target="_blank"
              rel="noopener noreferrer"
              className={button("outline", "lg")}
            >
              <WhatsappLogoIcon size={18} weight="fill" /> WhatsApp
            </a>
          </div>

          {site.mapsUrl && (
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${button("ink", "lg")} mt-2.5 w-full`}
            >
              <MapTrifoldIcon size={18} weight="fill" /> Directions in Google Maps
            </a>
          )}

          <Reveal className="mt-6">
            <ContactList />
          </Reveal>
        </div>

        <Reveal delay={0.08} className="mt-12 md:mt-0">
          <div className="rounded-[26px] border border-line p-5 md:p-6">
            <h2 className="font-display text-[24px] font-bold leading-tight tracking-[-0.02em]">Book a visit</h2>
            <p className="mt-1 text-sm text-ink-2">Leave your number and we&apos;ll call to fix a time.</p>
            <EnquiryForm source="visit" submitLabel="Request a visit" />
          </div>

          <div className="mt-10">
            <SectionHeader title="Other NCR centres" />
          </div>
          <ul className="divide-y divide-line overflow-hidden rounded-[22px] border border-line">
            {ncrCentres.map((c) => (
              <li key={c.name}>
                <a
                  href={site.parentUrl}
                  className="flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-mist active:bg-mist md:px-5"
                >
                  <span>
                    <span className="block font-bold">{c.name}</span>
                    <span className="block text-sm text-ink-2">{c.area}</span>
                  </span>
                  <ArrowUpRightIcon size={16} weight="bold" className="text-ink-3" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}
