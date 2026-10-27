import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { GalleryGrid } from "@/components/site/gallery-grid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from LawPrep Tutorial's Noida centre: classrooms, tests and the CLAT 2026 felicitation.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader eyebrow="Gallery" title="Life at the centre.">
        Classes, test days and results day. Tap any photo to view it full screen.
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 pb-14 md:px-6 md:pb-28">
        <Reveal>
          <GalleryGrid />
        </Reveal>
      </div>
    </>
  );
}
