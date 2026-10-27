import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Editor, EditorSkeleton } from "@/components/admin/editor";
import { collectionKeys, getCollection } from "@/lib/cms/collections";

export function generateStaticParams() {
  return collectionKeys.map((collection) => ({ collection }));
}

export async function generateMetadata({ params }: PageProps<"/admin/[collection]/new">): Promise<Metadata> {
  const config = getCollection((await params).collection);
  return { title: config ? `New ${config.singular.toLowerCase()}` : "Not found" };
}

// Params are read inside Suspense so navigation can show the skeleton instantly.
export default function NewEntryPage({ params }: PageProps<"/admin/[collection]/new">) {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <NewEntry params={params} />
    </Suspense>
  );
}

async function NewEntry({ params }: { params: PageProps<"/admin/[collection]/new">["params"] }) {
  const { collection } = await params;
  if (!getCollection(collection)) notFound();
  return <Editor key={collection} collectionKey={collection} />;
}
