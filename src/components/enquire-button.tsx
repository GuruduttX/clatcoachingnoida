"use client";

import type { ReactNode } from "react";
import { useEnquiry, type EnquirySource } from "@/components/enquiry";

export function EnquireButton({
  className,
  interest,
  source,
  children,
}: {
  className?: string;
  interest?: string;
  source?: EnquirySource;
  children: ReactNode;
}) {
  const { open } = useEnquiry();
  return (
    <button type="button" className={className} onClick={() => open(interest, source)}>
      {children}
    </button>
  );
}
