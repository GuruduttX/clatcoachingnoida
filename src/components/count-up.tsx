"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";

export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const value = useMotionValue(0);
  const text = useTransform(value, (v) => `${Math.round(v).toLocaleString("en-IN")}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      value.set(to);
      return;
    }
    const controls = animate(value, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, reduce, to, value]);

  return (
    <span ref={ref} className="tabular">
      {/* Real number for crawlers and screen readers; the animated one is decorative */}
      <span className="sr-only">
        {to.toLocaleString("en-IN")}
        {suffix}
      </span>
      <motion.span aria-hidden>{text}</motion.span>
    </span>
  );
}
