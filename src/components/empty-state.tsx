import type { ReactNode } from "react";

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-[26px] border border-dashed border-line-strong px-6 py-12 text-center md:py-16">
      <span aria-hidden className="grid size-14 place-items-center rounded-[20px] bg-sun font-display text-2xl font-extrabold">
        ✦
      </span>
      <p className="mt-4 font-display text-[22px] font-bold tracking-[-0.02em]">{title}</p>
      {children && <p className="mt-1.5 max-w-sm text-[15px] text-ink-2">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
