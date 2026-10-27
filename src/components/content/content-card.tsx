import Link from "next/link";
import { ArrowUpRightIcon, ClockIcon } from "@phosphor-icons/react/ssr";
import { SmartImage } from "./smart-image";

export type CardData = {
  href: string;
  title: string;
  eyebrow?: string;
  meta?: string;
  image?: string;
  alt?: string;
  readTime?: number | null;
};

// Image-led card for articles. Without an image it becomes a coloured tile.
export function ContentCard({ card, priority, tone = "mist" }: { card: CardData; priority?: boolean; tone?: "mist" | "ink" | "sun" }) {
  const tones = {
    mist: "bg-mist text-ink",
    ink: "bg-ink text-white",
    sun: "bg-sun text-ink",
  };
  return (
    <Link
      href={card.href}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] bg-paper ring-1 ring-line transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-card active:scale-[0.98]"
    >
      <div className={`relative aspect-[16/10] overflow-hidden ${card.image ? "bg-mist" : tones[tone]}`}>
        {card.image ? (
          <SmartImage
            src={card.image}
            alt={card.alt || ""}
            priority={priority}
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 85vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <span className="absolute inset-0 flex items-end p-4">
            <span className="font-display text-[22px] font-extrabold leading-[1.02] tracking-[-0.03em] line-clamp-3">{card.title}</span>
          </span>
        )}
        {card.eyebrow && (
          <span className="absolute top-3 left-3 max-w-[80%] truncate rounded-full bg-paper/95 px-3 py-1 text-[12px] font-bold text-ink shadow-sm backdrop-blur">
            {card.eyebrow}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <h3 className="font-display text-[19px] font-bold leading-[1.15] tracking-[-0.02em] line-clamp-3">{card.title}</h3>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3 text-[13px] font-semibold text-ink-3">
          <span className="flex min-w-0 items-center gap-2">
            {card.meta && <span className="truncate">{card.meta}</span>}
            {card.readTime ? (
              <span className="flex shrink-0 items-center gap-1">
                <ClockIcon size={14} weight="bold" /> {card.readTime} min
              </span>
            ) : null}
          </span>
          <ArrowUpRightIcon size={16} weight="bold" className="shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}

/** Horizontal rail on phones, grid on desktop. */
export function CardRail({ cards, tone }: { cards: CardData[]; tone?: "mist" | "ink" | "sun" }) {
  return (
    <ul className="rail -mx-4 scroll-pl-4 gap-3 px-4 pb-1 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0">
      {cards.map((card, i) => (
        <li key={card.href} className="w-[78%] shrink-0 sm:w-[46%] md:w-auto">
          <ContentCard card={card} priority={i === 0} tone={tone} />
        </li>
      ))}
    </ul>
  );
}
