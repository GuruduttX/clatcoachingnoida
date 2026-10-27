import type { Metadata } from "next";
import { ClockIcon, MonitorPlayIcon, UsersThreeIcon } from "@phosphor-icons/react/ssr";
import { Accordion } from "@/components/accordion";
import { EmptyState } from "@/components/empty-state";
import { EnquireButton } from "@/components/enquire-button";
import { PageHeader, SectionHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { parseIsoDate } from "@/components/site/dates";
import { Section } from "@/components/site/section";
import { Stepper } from "@/components/site/stepper";
import { listUpcomingBatches, type Doc } from "@/lib/server/content";
import { button } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Batches",
  description: "Upcoming CLAT and AILET batch start dates at LawPrep Tutorial's Noida centre, with weekday, weekend and online options.",
};

type Batch = {
  id: string;
  title: string;
  course: string;
  audience?: string;
  startDate?: string;
  schedule?: string;
  timing?: string;
  mode?: string;
  seats?: string;
  hours?: string;
};

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);

function toBatch(d: Doc): Batch {
  return {
    id: d._id,
    title: str(d.title) ?? "Batch",
    course: str(d.course) ?? "",
    audience: str(d.audience),
    startDate: str(d.startDate),
    schedule: str(d.schedule),
    timing: str(d.timing),
    mode: str(d.mode),
    seats: str(d.seats),
    hours: str(d.hours),
  };
}

const seatTone: Record<string, string> = {
  Open: "bg-emerald-50 text-emerald-700",
  "Filling fast": "bg-sun-tint text-ink",
  Waitlist: "bg-brand-tint text-brand-deep",
  Closed: "bg-fog text-ink-3",
};

// From the common batch attributes on lawpreptutorialdelhi.com.
const included = [
  { label: "Format", value: "Classroom + AI-powered LMS" },
  { label: "Weekday batches", value: "5 days a week, 2–3 hrs a day" },
  { label: "Weekend batches", value: "Sat & Sun, 4–5 hrs" },
  { label: "Includes", value: "Printed books, mocks, 1:1 mentorship" },
];

const faqs = [
  {
    question: "How quickly do batches fill up?",
    answer: "Classroom batches have a seat cap and often fill a week or two before they start. Hold a seat as soon as you've picked a date.",
  },
  {
    question: "Can I join after the start date?",
    answer: "Late joining is usually possible in the first week, with recordings for anything you missed. After that, the next fresh batch is the better option.",
  },
  {
    question: "Is the online batch different?",
    answer: "No. Online-live batches follow the same syllabus, tests and faculty. Only the medium is different.",
  },
];

function groupByMonth(batches: Batch[]) {
  const groups = new Map<string, Batch[]>();
  for (const b of batches) {
    const d = parseIsoDate(b.startDate);
    const key = d ? `${d.monthName} ${d.year}` : "Date to be announced";
    groups.set(key, [...(groups.get(key) ?? []), b]);
  }
  return [...groups.entries()];
}

export default async function BatchesPage() {
  const batches = (await listUpcomingBatches()).map(toBatch);
  const groups = groupByMonth(batches);

  return (
    <>
      <PageHeader eyebrow="Batches" title="Upcoming start dates.">
        Pick a date, hold your seat, and ask about the scholarship before you enrol.
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {groups.length === 0 ? (
          <Reveal>
            <EmptyState
              title="New dates are being finalised"
              action={
                <EnquireButton source="batches" className={button("primary", "lg")}>
                  Tell me when they open
                </EnquireButton>
              }
            >
              Leave your number and the Noida team will call you as soon as the next batch is announced.
            </EmptyState>
          </Reveal>
        ) : (
          <div className="space-y-8 md:space-y-12">
            {groups.map(([month, items]) => (
              <Reveal key={month}>
                <h2 className="mb-3 text-[13px] font-bold uppercase tracking-[0.14em] text-ink-3">{month}</h2>
                <ul className="grid gap-3 md:grid-cols-2 md:gap-4">
                  {items.map((b) => (
                    <BatchCard key={b.id} batch={b} />
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <Section>
        <Reveal>
          <SectionHeader title="Every batch includes" />
          <dl className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4">
            {included.map((f) => (
              <div key={f.label} className="rounded-[20px] bg-mist px-4 py-4">
                <dt className="text-[12px] font-semibold text-ink-3">{f.label}</dt>
                <dd className="mt-1 font-bold leading-snug">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>

      <Section className="md:grid md:grid-cols-2 md:gap-16">
        <Reveal>
          <SectionHeader title="Hold your seat" subtitle="Three steps, usually done in a day" />
          <Stepper
            steps={[
              { title: "Pick a batch", text: "Choose a date that fits, or take free counselling and let us suggest one." },
              { title: "Hold a seat", text: "Message or call with your batch, and we'll hold the seat while you decide." },
              { title: "Enrol", text: "Complete registration, and ask about the scholarship test before you pay." },
            ]}
          />
        </Reveal>
        <Reveal delay={0.06} className="mt-10 md:mt-0">
          <SectionHeader title="Questions" />
          <Accordion items={faqs} />
        </Reveal>
      </Section>
      <div className="pb-14 md:pb-28" />
    </>
  );
}

function BatchCard({ batch }: { batch: Batch }) {
  const d = parseIsoDate(batch.startDate);
  const closed = batch.seats === "Closed";
  return (
    <li className="flex gap-4 rounded-[24px] border border-line p-4 md:p-5">
      <div className={`flex w-16 shrink-0 flex-col items-center justify-center rounded-[18px] py-2.5 ${d ? "bg-ink text-white" : "bg-mist"}`}>
        {d ? (
          <>
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-sun">{d.monthShort}</span>
            <span className="tabular font-display text-[30px] font-extrabold leading-none">{d.day}</span>
            <span className="text-[11px] font-semibold text-white/60">{d.weekday}</span>
          </>
        ) : (
          <span className="px-1 text-center text-[11px] font-bold leading-tight text-ink-3">Date TBA</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-[19px] font-bold leading-tight tracking-[-0.01em]">{batch.title}</p>
          {batch.seats && (
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${seatTone[batch.seats] ?? "bg-mist"}`}>{batch.seats}</span>
          )}
        </div>
        {batch.audience && <p className="mt-0.5 text-sm text-ink-2">For {batch.audience}</p>}
        <ul className="mt-3 flex flex-wrap gap-1.5 text-[12px] font-semibold text-ink-2">
          {batch.schedule && (
            <li className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-1">
              <UsersThreeIcon size={13} weight="bold" /> {batch.schedule}
            </li>
          )}
          {batch.timing && (
            <li className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-1">
              <ClockIcon size={13} weight="bold" /> {batch.timing}
            </li>
          )}
          {batch.mode && (
            <li className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-1">
              <MonitorPlayIcon size={13} weight="bold" /> {batch.mode}
            </li>
          )}
          {batch.hours && <li className="rounded-full bg-mist px-2.5 py-1">{batch.hours}</li>}
        </ul>
        {!closed && (
          <EnquireButton interest={batch.course || batch.title} source="batches" className={`${button("primary", "sm")} mt-4`}>
            {batch.seats === "Waitlist" ? "Join waitlist" : "Hold a seat"}
          </EnquireButton>
        )}
      </div>
    </li>
  );
}
