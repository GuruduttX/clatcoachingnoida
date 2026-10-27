export type Fact = { label: string; value: string; note?: string };

export function FactTiles({ facts, className = "" }: { facts: Fact[]; className?: string }) {
  return (
    <dl className={`grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4 ${className}`}>
      {facts.map((f) => (
        <div key={f.label} className="rounded-[20px] bg-mist px-4 py-4 md:px-5 md:py-5">
          <dt className="text-[12px] font-semibold text-ink-3">{f.label}</dt>
          <dd className="mt-1 font-display text-[19px] font-bold leading-tight tracking-[-0.02em] md:text-[22px]">{f.value}</dd>
          {f.note && <dd className="mt-1 text-[13px] leading-snug text-ink-2">{f.note}</dd>}
        </div>
      ))}
    </dl>
  );
}
