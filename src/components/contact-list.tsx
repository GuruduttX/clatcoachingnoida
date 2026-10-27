"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import {
  ClockIcon,
  CopyIcon,
  EnvelopeSimpleIcon,
  MapPinIcon,
  PhoneIcon,
  TrainIcon,
  type Icon,
} from "@phosphor-icons/react";
import { OpenStatus } from "@/components/live";
import { useToast } from "@/components/toast";
import { haptic } from "@/lib/haptics";
import { site } from "@/lib/site";

export function ContactList() {
  const toast = useToast();

  async function copy(text: string, what: string) {
    try {
      await navigator.clipboard.writeText(text);
      haptic(10);
      toast(`${what} copied`);
    } catch {
      toast(`Couldn't copy the ${what.toLowerCase()}`);
    }
  }

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-[22px] bg-mist">
      <Row icon={MapPinIcon} label="Address" href={site.mapsUrl}>
        {site.address ?? "Noida, Uttar Pradesh · call for directions"}
      </Row>
      {site.metro && (
        <Row icon={TrainIcon} label="Nearest metro">
          {site.metro}
        </Row>
      )}
      <Row icon={ClockIcon} label="Office hours">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {site.hours}
          <OpenStatus className="text-[13px] font-bold text-ink-2" />
        </span>
      </Row>
      <Row
        icon={PhoneIcon}
        label="Admissions"
        href={site.phoneHref}
        action={<CopyButton label="Copy phone number" onCopy={() => copy(site.phone, "Phone number")} />}
      >
        {site.phone}
      </Row>
      <Row
        icon={PhoneIcon}
        label="Noida centre line"
        href={site.centrePhoneHref}
        action={<CopyButton label="Copy centre number" onCopy={() => copy(site.centrePhone, "Centre number")} />}
      >
        {site.centrePhone}
      </Row>
      <Row
        icon={EnvelopeSimpleIcon}
        label="Email"
        href={`mailto:${site.email}`}
        action={<CopyButton label="Copy email" onCopy={() => copy(site.email, "Email")} />}
      >
        {site.email}
      </Row>
    </ul>
  );
}

function Row({
  icon: RowIcon,
  label,
  href,
  action,
  children,
}: {
  icon: Icon;
  label: string;
  href?: string | null;
  action?: ReactNode;
  children: ReactNode;
}) {
  const body = (
    <>
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-paper text-brand">
        <RowIcon size={20} weight="fill" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[12px] font-semibold text-ink-3">{label}</span>
        <span className="block break-words font-semibold">{children}</span>
      </span>
    </>
  );
  return (
    <li className="flex items-center gap-2 pr-3">
      {href ? (
        <a href={href} className="flex min-w-0 flex-1 items-center gap-3.5 px-4 py-3.5 transition-colors active:bg-fog md:px-5 md:py-4">
          {body}
        </a>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-3.5 px-4 py-3.5 md:px-5 md:py-4">{body}</div>
      )}
      {action}
    </li>
  );
}

function CopyButton({ label, onCopy }: { label: string; onCopy: () => void }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      whileTap={{ scale: 0.85 }}
      onClick={onCopy}
      className="grid size-9 shrink-0 place-items-center rounded-full text-ink-3 transition-colors hover:bg-fog hover:text-ink"
    >
      <CopyIcon size={18} weight="bold" />
    </motion.button>
  );
}
