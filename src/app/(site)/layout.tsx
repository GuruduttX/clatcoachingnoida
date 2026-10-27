import { Suspense } from "react";
import { TopBar, TopBarFallback } from "@/components/top-bar";
import { TabBar } from "@/components/tab-bar";
import { Footer } from "@/components/footer";

// Public app chrome. The admin area has its own shell and skips all of this.
// Both bars read the URL, so they sit in Suspense: on routes with a slug that's
// only known at request time, the rest of the page can still be prerendered.
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Suspense fallback={<TopBarFallback />}>
        <TopBar />
      </Suspense>
      <main className="flex-1">{children}</main>
      <div className="pb-tabbar md:pb-0">
        <Footer />
      </div>
      <Suspense>
        <TabBar />
      </Suspense>
    </>
  );
}
