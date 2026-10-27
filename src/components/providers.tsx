"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { EnquiryProvider } from "@/components/enquiry";
import { ToastProvider } from "@/components/toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <EnquiryProvider>{children}</EnquiryProvider>
      </ToastProvider>
    </MotionConfig>
  );
}
