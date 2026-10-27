import type { ReactNode } from "react";

// Large title for inner pages. On mobile, the top bar picks up a compact
// version of this title once it scrolls out of view.
export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="mx-auto max-w-6xl px-4 pt-3 pb-6 md:px-6 md:pt-14 md:pb-10">
      <p className="text-[13px] font-bold text-brand">{eyebrow}</p>
      <h1 className="mt-1.5 max-w-3xl font-display text-[40px] font-bold leading-[1] tracking-[-0.035em] md:text-[68px]">
        {title}
      </h1>
      {children && (
        <div className="mt-3 max-w-xl text-[16px] leading-relaxed text-ink-2 md:mt-4 md:text-lg">{children}</div>
      )}
    </header>
  );
}

// App-style section header: title on the left, an optional action on the right.
export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4 md:mb-6">
      <div>
        <h2 className="font-display text-[26px] font-bold leading-[1.05] tracking-[-0.03em] md:text-[36px]">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-[15px] text-ink-2 md:mt-1.5 md:text-base">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
