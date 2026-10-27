// Shared by server pages and client cards, so it must not live in a "use client" file.

export type ReviewItem = {
  id: string;
  name: string;
  text: string;
  image?: string;
  imageAlt?: string;
  centre: string;
  year?: number;
  program?: string;
  parent: boolean;
  rating: number;
  googleUrl?: string;
};

/** Converts a published review document into the shape the cards use. */
export function toReviewItem(d: Record<string, unknown>): ReviewItem {
  const s = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
  const rating = Math.min(5, Math.max(1, Number(d.rating) || 5));
  return {
    id: String(d._id),
    name: s(d.studentName) ?? "Student",
    text: s(d.reviewText) ?? "",
    image: s(d.studentImage),
    imageAlt: s(d.studentImageAlt),
    centre: s(d.centre) ?? "Noida",
    year: Number(d.year) || undefined,
    program: s(d.program),
    parent: Boolean(d.isParentReview),
    rating,
    googleUrl: s(d.googleReviewUrl),
  };
}
