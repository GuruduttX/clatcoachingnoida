"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRightIcon, QuotesIcon, StarIcon } from "@phosphor-icons/react";
import { Sheet } from "@/components/sheet";
import { haptic } from "@/lib/haptics";
import type { ReviewItem } from "./review-item";

export type { ReviewItem } from "./review-item";

const CLAMP_AT = 180;

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} size={13} weight="fill" className={i < rating ? "text-sun-deep" : "text-line-strong"} />
      ))}
    </span>
  );
}

function Who({ review }: { review: ReviewItem }) {
  return (
    <div className="flex items-center gap-3">
      <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-sun font-display font-extrabold">
        {review.image ? (
          <Image src={review.image} alt={review.imageAlt ?? ""} fill sizes="44px" className="object-cover object-top" />
        ) : (
          review.name[0]
        )}
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="flex items-center gap-1.5">
          <span className="truncate font-bold">{review.name}</span>
          {review.parent && <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold text-white">Parent</span>}
        </span>
        <span className="mt-0.5 block truncate text-[12px] text-ink-3">
          {[review.program, review.centre !== "Noida" ? review.centre : null].filter(Boolean).join(" · ") || review.centre}
        </span>
      </span>
    </div>
  );
}

export function ReviewCard({ review, className = "" }: { review: ReviewItem; className?: string }) {
  const [open, setOpen] = useState(false);
  const long = review.text.length > CLAMP_AT;

  return (
    <article className={`flex flex-col rounded-[24px] bg-mist p-5 ${className}`}>
      <div className="flex items-center justify-between">
        <Stars rating={review.rating} />
        <QuotesIcon size={22} weight="fill" className="text-brand/25" />
      </div>
      <p className={`mt-3 flex-1 text-[15px] leading-relaxed text-ink-2 ${long ? "line-clamp-5" : ""}`}>{review.text}</p>
      {long && (
        <button
          type="button"
          onClick={() => {
            haptic();
            setOpen(true);
          }}
          className="mt-1.5 self-start text-sm font-bold text-brand"
        >
          Read more
        </button>
      )}
      <div className="mt-4 border-t border-line pt-4">
        <Who review={review} />
      </div>

      <Sheet open={open} onClose={() => setOpen(false)} title={review.name} description={[review.program, review.centre].filter(Boolean).join(" · ")}>
        <Stars rating={review.rating} />
        <p className="mt-3 text-[16px] leading-relaxed whitespace-pre-line text-ink-2">{review.text}</p>
        {review.googleUrl && (
          <a href={review.googleUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-brand">
            See it on Google <ArrowUpRightIcon size={14} weight="bold" />
          </a>
        )}
      </Sheet>
    </article>
  );
}
