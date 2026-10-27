import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { str } from "@/components/content/doc";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { findTopper } from "@/lib/data";
import { listPublished } from "@/lib/server/content";

export const metadata: Metadata = {
  title: "Toppers' strategy",
  description: "How CLAT rank-holders from LawPrep Tutorial's Noida centre prepared: routines, mocks and what they'd do differently.",
  alternates: { canonical: "/resources/toppers-strategy" },
};

export default async function ToppersStrategyPage() {
  const docs = await listPublished("toppers-strategy", { select: "title slug studentSlug quickAnswer" });
  const strategies = docs
    .map((doc) => ({ doc, topper: findTopper(str(doc, "studentSlug")) }))
    .sort((a, b) => (a.topper?.air ?? Infinity) - (b.topper?.air ?? Infinity));

  return (
    <>
      <PageHeader eyebrow="Toppers' strategy" title="How they cracked it.">
        Rank-holders from this centre on what actually worked.
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 pb-14 md:px-6 md:pb-28">
        {strategies.length === 0 ? (
          <EmptyState title="Topper stories coming soon">Interviews with this year&apos;s rank-holders will appear here.</EmptyState>
        ) : (
          <Reveal>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {strategies.map(({ doc, topper }) => (
                <li key={doc._id}>
                  <Link
                    href={`/resources/toppers-strategy/${doc.slug}`}
                    className="group relative block aspect-[4/5] overflow-hidden rounded-[22px] bg-ink transition-transform active:scale-[0.97]"
                  >
                    {topper && (
                      <Image
                        src={topper.photo}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 260px, (min-width: 640px) 30vw, 45vw"
                        className="object-cover object-top transition duration-700 ease-out group-hover:scale-[1.06]"
                      />
                    )}
                    <span className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-black/90 via-black/45 to-transparent" />
                    {topper && (
                      <span className="tabular absolute top-2.5 left-2.5 rounded-full bg-sun px-2.5 py-1 text-[12px] font-extrabold text-ink">
                        AIR {topper.air}
                      </span>
                    )}
                    <span className="absolute inset-x-3 bottom-3 text-white">
                      {topper && (
                        <span className="block text-[12px] font-semibold text-white/70">
                          {topper.name} · {topper.nlu}
                        </span>
                      )}
                      <span className="mt-0.5 block font-display text-[17px] font-bold leading-[1.1] tracking-[-0.01em] line-clamp-3">
                        {str(doc, "title")}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </>
  );
}
