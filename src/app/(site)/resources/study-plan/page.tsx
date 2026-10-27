import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { list, num, str } from "@/components/content/doc";
import { PlanIcon } from "@/components/content/plan-icon";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { listPublished } from "@/lib/server/content";

export const metadata: Metadata = {
  title: "CLAT study plans",
  description: "Month-by-month CLAT and AILET study plans for every runway: two years, one year, a repeat attempt or the final weeks.",
  alternates: { canonical: "/resources/study-plan" },
};

const tones = ["bg-ink text-white", "bg-sun text-ink", "bg-brand text-white", "bg-mist text-ink"];

export default async function StudyPlansPage() {
  const plans = await listPublished("study-plans");

  return (
    <>
      <PageHeader eyebrow="Study plans" title="Pick your runway.">
        How much time is left decides the plan. Choose yours.
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 pb-14 md:px-6 md:pb-28">
        {plans.length === 0 ? (
          <EmptyState title="Plans are being written">Study plans will appear here once they&apos;re published.</EmptyState>
        ) : (
          <Reveal>
            <ul className="grid gap-3 sm:grid-cols-2 md:gap-4">
              {plans.map((plan, i) => {
                const tone = tones[i % tones.length];
                const dark = tone.includes("text-white");
                const months = num(plan, "durationMonths");
                return (
                  <li key={plan._id}>
                    <Link
                      href={`/resources/study-plan/${plan.slug}`}
                      className={`group flex h-full flex-col rounded-[28px] p-5 transition-transform duration-300 active:scale-[0.98] md:p-7 ${tone}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className={`grid size-12 place-items-center rounded-2xl ${dark ? "bg-white/10" : "bg-paper"}`}>
                          <PlanIcon name={str(plan, "icon")} />
                        </span>
                        {str(plan, "intensity") && (
                          <span className={`rounded-full px-3 py-1 text-[12px] font-bold ${dark ? "bg-white/10" : "bg-paper"}`}>
                            {str(plan, "intensity")}
                          </span>
                        )}
                      </div>
                      <p className="mt-8 flex items-baseline gap-2">
                        <span className="tabular font-display text-[56px] font-extrabold leading-[0.85] tracking-[-0.04em]">
                          {months ?? str(plan, "timeline")}
                        </span>
                        {months !== null && <span className={`text-base font-bold ${dark ? "text-white/55" : "text-ink/55"}`}>months</span>}
                      </p>
                      <h2 className="mt-4 font-display text-[24px] font-bold leading-tight tracking-[-0.02em]">{str(plan, "title")}</h2>
                      {str(plan, "bestFor") && (
                        <p className={`mt-1 text-[15px] ${dark ? "text-white/70" : "text-ink/70"}`}>For {str(plan, "bestFor")}</p>
                      )}
                      <dl className="mt-5 grid grid-cols-2 gap-2">
                        {[
                          ["Weekly", str(plan, "weeklyLoad")],
                          ["Mocks", str(plan, "mockCadence")],
                        ]
                          .filter(([, v]) => v)
                          .map(([label, value]) => (
                            <div key={label} className={`rounded-2xl px-3.5 py-3 ${dark ? "bg-white/[0.08]" : "bg-paper/70"}`}>
                              <dt className={`text-[11px] font-bold uppercase tracking-[0.12em] ${dark ? "text-white/50" : "text-ink/50"}`}>{label}</dt>
                              <dd className="mt-1 text-sm font-semibold leading-snug">{value}</dd>
                            </div>
                          ))}
                      </dl>
                      <span className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-bold">
                        {list(plan, "targetExams").join(" · ") || "Open plan"}
                        <ArrowRightIcon size={15} weight="bold" className="ml-auto transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        )}
      </div>
    </>
  );
}
