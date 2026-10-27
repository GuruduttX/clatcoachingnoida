import type { Metadata } from "next";
import { str } from "@/components/content/doc";
import { NluExplorer, type NluCard } from "@/components/content/nlu-explorer";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { listPublished } from "@/lib/server/content";

export const metadata: Metadata = {
  title: "NLU profiles",
  description: "Every National Law University in one place: rank, city, seats, fees and what it's like, for CLAT and AILET aspirants.",
  alternates: { canonical: "/resources/nlu-profiles" },
};

// Numeric NIRF ranks first, in order; unranked NLUs after, alphabetically.
function byRank(a: NluCard, b: NluCard) {
  const ra = Number.parseInt(a.rank, 10);
  const rb = Number.parseInt(b.rank, 10);
  const na = Number.isFinite(ra);
  const nb = Number.isFinite(rb);
  if (na && nb) return ra - rb;
  if (na !== nb) return na ? -1 : 1;
  return a.name.localeCompare(b.name);
}

export default async function NluProfilesPage() {
  const docs = await listPublished("nlu-profiles", { select: "universityName shortName universityRank location slug" });
  const nlus: NluCard[] = docs
    .map((d) => ({
      slug: String(d.slug),
      name: str(d, "universityName"),
      short: str(d, "shortName"),
      city: str(d, "location.city"),
      rank: str(d, "universityRank"),
    }))
    .sort(byRank);

  return (
    <>
      <PageHeader eyebrow="NLU profiles" title="Know where you're aiming.">
        {nlus.length > 0 ? `${nlus.length} National Law Universities, ranked and compared.` : "Every National Law University, ranked and compared."}
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 pb-14 md:px-6 md:pb-28">
        {nlus.length > 0 ? (
          <NluExplorer nlus={nlus} />
        ) : (
          <EmptyState title="Profiles coming soon">NLU profiles will appear here once they&apos;re published.</EmptyState>
        )}
      </div>
    </>
  );
}
