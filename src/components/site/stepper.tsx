import type { ReactNode } from "react";

export type Step = { title: string; text: string; extra?: ReactNode };

// Vertical numbered steps joined by a rail, like an order-tracking screen.
export function Stepper({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative">
      {steps.map((step, i) => (
        <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
          {i < steps.length - 1 && <span aria-hidden className="absolute top-11 bottom-1 left-[21px] w-0.5 rounded-full bg-line" />}
          <span
            className={`tabular relative grid size-11 shrink-0 place-items-center rounded-2xl font-display text-lg font-extrabold ${
              i === 0 ? "bg-brand text-white shadow-brand" : "bg-mist text-ink"
            }`}
          >
            {i + 1}
          </span>
          <div className="min-w-0 pt-1.5">
            <p className="font-display text-[19px] font-bold leading-tight tracking-[-0.02em] md:text-[22px]">{step.title}</p>
            <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{step.text}</p>
            {step.extra}
          </div>
        </li>
      ))}
    </ol>
  );
}
