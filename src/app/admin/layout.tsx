import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/shell";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Noida CMS" },
  robots: { index: false, follow: false },
};

// The shell highlights the current section from the URL, so it streams.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-mist" />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
