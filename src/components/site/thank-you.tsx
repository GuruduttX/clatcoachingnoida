"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { CheckIcon, PhoneIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import { site, whatsappLink } from "@/lib/site";
import { button } from "@/lib/ui";

const CONFETTI = ["#e40014", "#fcc419", "#141210", "#e8ad00", "#e40014", "#fcc419", "#141210", "#fcc419", "#e40014", "#e8ad00", "#141210", "#fcc419"];

export function ThankYouHero() {
  const name = useSearchParams().get("name")?.trim().slice(0, 40);

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-sun px-6 pt-10 pb-7 text-center md:rounded-[36px] md:py-14">
      {CONFETTI.map((color, i) => {
        const angle = (i / CONFETTI.length) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            aria-hidden
            className="absolute top-[88px] left-1/2 size-2.5 rounded-[3px] md:top-[120px]"
            style={{ backgroundColor: color }}
            initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0.4 }}
            animate={{ x: Math.cos(angle) * (110 + (i % 3) * 30), y: Math.sin(angle) * (70 + (i % 2) * 30), opacity: [0, 1, 0], rotate: 220, scale: 1 }}
            transition={{ duration: 1.3, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}
      <motion.span
        initial={{ scale: 0, rotate: -40 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 16, delay: 0.1 }}
        className="relative mx-auto grid size-20 place-items-center rounded-[26px] bg-ink text-sun shadow-float"
      >
        <CheckIcon size={40} weight="bold" />
      </motion.span>
      <h1 className="mt-6 font-display text-[36px] font-extrabold leading-[0.98] tracking-[-0.04em] md:text-[56px]">
        {name ? `Thanks, ${name}!` : "Thank you!"}
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-[16px] text-ink/75">We&apos;ve got your details. A counsellor will call you back soon.</p>
      <div className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-2.5">
        <a
          href={whatsappLink(`Hi, I just sent an enquiry for the Noida centre${name ? `. My name is ${name}` : ""}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className={button("ink")}
        >
          <WhatsappLogoIcon size={18} weight="fill" /> WhatsApp
        </a>
        <a href={site.phoneHref} className={button("white")}>
          <PhoneIcon size={18} weight="fill" /> Call now
        </a>
      </div>
    </div>
  );
}

export function ThankYouLinks() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <Link href="/results" className={button("quiet", "lg")}>
        See results
      </Link>
      <Link href="/courses" className={button("quiet", "lg")}>
        Courses
      </Link>
    </div>
  );
}
