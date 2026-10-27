import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Editor, EditorSkeleton } from "@/components/admin/editor";
import { getCollection } from "@/lib/cms/collections";

export const metadata: Metadata = { title: "Edit" };

// The entry id is only known at request time, so it's read inside Suspense.
export default function EditEntryPage({ params }: PageProps<"/admin/[collection]/[id]">) {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <EditEntry params={params} />
    </Suspense>
  );
}

async function EditEntry({ params }: { params: PageProps<"/admin/[collection]/[id]">["params"] }) {
  const { collection, id } = await params;
  if (!getCollection(collection)) notFound();
  return <Editor key={id} collectionKey={collection} id={id} />;
}
