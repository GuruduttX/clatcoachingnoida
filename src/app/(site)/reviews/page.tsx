import type { Metadata } from "next";
import { StarIcon } from "@phosphor-icons/react/ssr";
import { EmptyState } from "@/components/empty-state";
import { EnquireButton } from "@/components/enquire-button";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { toReviewItem } from "@/components/site/review-item";
import { ReviewsExplorer } from "@/components/site/reviews-explorer";
import { listPublished } from "@/lib/server/content";
import { button } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Reviews",
  description: "What students and parents say about CLAT coaching at LawPrep Tutorial's Noida centre and the other Delhi NCR centres.",
};

export default async function ReviewsPage() {
  const reviews = (await listPublished("reviews", { limit: 300 })).map(toReviewItem).filter((r) => r.text);
  const average = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  return (
    <>
      <PageHeader eyebrow="Reviews" title="In their own words.">
        Students and parents from the Noida centre and across Delhi NCR.
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 pb-14 md:px-6 md:pb-28">
        {reviews.length === 0 ? (
          <EmptyState title="Reviews are on their way">We&apos;re collecting feedback from this year&apos;s students.</EmptyState>
        ) : (
          <>
            <Reveal className="grid grid-cols-2 gap-2.5 md:max-w-xl md:gap-4">
              <div className="rounded-[22px] bg-ink p-4 text-white md:p-5">
                <p className="flex items-center gap-2 font-display text-[36px] font-extrabold leading-none tracking-[-0.03em]">
                  {average.toFixed(1)} <StarIcon size={26} weight="fill" className="text-sun" />
                </p>
                <p className="mt-1.5 text-[13px] font-semibold text-white/65">Average rating</p>
              </div>
              <div className="rounded-[22px] bg-sun p-4 md:p-5">
                <p className="tabular font-display text-[36px] font-extrabold leading-none tracking-[-0.03em]">{reviews.length}</p>
                <p className="mt-1.5 text-[13px] font-semibold text-ink/70">Published reviews</p>
              </div>
            </Reveal>
            <div className="mt-4 md:mt-8">
              <ReviewsExplorer reviews={reviews} />
            </div>
          </>
        )}

        <Reveal className="mt-10 flex flex-col items-start gap-3 rounded-[26px] border border-line p-5 md:flex-row md:items-center md:justify-between md:p-8">
          <p className="font-display text-[22px] font-bold leading-tight tracking-[-0.02em] md:text-[28px]">Want to hear it in person?</p>
          <EnquireButton source="other" className={button("primary", "lg")}>
            Talk to a counsellor
          </EnquireButton>
        </Reveal>
      </div>
    </>
  );
}
