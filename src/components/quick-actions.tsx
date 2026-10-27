"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { MapPinIcon, PhoneIcon, SealPercentIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import { useEnquiry } from "@/components/enquiry";
import { haptic } from "@/lib/haptics";
import { site, whatsappLink } from "@/lib/site";

const tile =
  "flex flex-col items-center gap-2 text-[12px] font-semibold text-ink-2 [&>span:first-child]:transition-transform";

export function QuickActions() {
  const { open } = useEnquiry();

  return (
    <nav aria-label="Quick actions" className="grid grid-cols-4 gap-2">
      <Tile href={site.phoneHref} label="Call" tone="brand" icon={<PhoneIcon size={24} weight="fill" />} />
      <Tile
        href={whatsappLink("Hi, I have a question about CLAT coaching at the Noida centre.")}
        external
        label="WhatsApp"
        icon={<WhatsappLogoIcon size={24} weight="fill" />}
      />
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={() => open("Scholarship test")}
        className={tile}
      >
        <Icon tone="sun">
          <SealPercentIcon size={24} weight="fill" />
        </Icon>
        Scholarship
      </motion.button>
      <Tile href="/visit" internal label="Visit" icon={<MapPinIcon size={24} weight="fill" />} />
    </nav>
  );
}

type Tone = "brand" | "sun" | "plain";

function Icon({ tone = "plain", children }: { tone?: Tone; children: ReactNode }) {
  const tones: Record<Tone, string> = {
    brand: "bg-brand text-white shadow-brand",
    sun: "bg-sun text-ink",
    plain: "bg-mist text-ink",
  };
  return (
    <span className={`grid aspect-square w-full max-w-[64px] place-items-center rounded-[20px] ${tones[tone]}`}>
      {children}
    </span>
  );
}

function Tile({
  href,
  label,
  icon,
  tone,
  external,
  internal,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  tone?: Tone;
  external?: boolean;
  internal?: boolean;
}) {
  const content = (
    <>
      <Icon tone={tone}>{icon}</Icon>
      {label}
    </>
  );
  return (
    <motion.div whileTap={{ scale: 0.9 }} onTap={() => haptic()}>
      {internal ? (
        <Link href={href} className={tile}>
          {content}
        </Link>
      ) : (
        <a
          href={href}
          className={tile}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {content}
        </a>
      )}
    </motion.div>
  );
}
