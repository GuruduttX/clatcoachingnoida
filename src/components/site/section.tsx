import type { ReactNode } from "react";

// Consistent vertical rhythm between the blocks of a screen.
export function Section({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-4 pt-10 md:px-6 md:pt-20 ${className}`}>
      {children}
    </section>
  );
}
