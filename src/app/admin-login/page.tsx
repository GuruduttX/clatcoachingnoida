import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-dvh place-items-center bg-mist px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo className="h-11" />
          <h1 className="mt-6 font-display text-[32px] font-bold leading-none tracking-[-0.03em]">Noida CMS</h1>
          <p className="mt-2 text-[15px] text-ink-2">Sign in to manage the website.</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
