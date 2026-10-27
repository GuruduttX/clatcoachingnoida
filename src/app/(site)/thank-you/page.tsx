import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionHeader } from "@/components/page-header";
import { Stepper } from "@/components/site/stepper";
import { ThankYouHero, ThankYouLinks } from "@/components/site/thank-you";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-2 pb-14 md:px-6 md:pt-10 md:pb-28">
      {/* The name comes from the query string, which is only known in the browser. */}
      <Suspense fallback={<div className="h-[372px] rounded-[28px] bg-sun md:h-[440px] md:rounded-[36px]" />}>
        <ThankYouHero />
      </Suspense>

      <section className="pt-10">
        <SectionHeader title="What happens next" />
        <Stepper
          steps={[
            { title: "We call you back", text: `Usually within a few hours, during office hours (${site.hours}).` },
            { title: "Free counselling", text: "A short chat about your class, your target and the right batch." },
            { title: "Visit or join online", text: "See the Noida centre, or start with a live online class." },
          ]}
        />
      </section>

      <div className="mt-8">
        <ThankYouLinks />
      </div>
    </div>
  );
}
