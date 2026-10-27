import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CollectionList } from "@/components/admin/collection-list";
import { collectionKeys, getCollection } from "@/lib/cms/collections";

export function generateStaticParams() {
  return collectionKeys.map((collection) => ({ collection }));
}

export async function generateMetadata({ params }: PageProps<"/admin/[collection]">): Promise<Metadata> {
  return { title: getCollection((await params).collection)?.label ?? "Not found" };
}

// Params are read inside Suspense so navigation can show the skeleton instantly.
export default function CollectionPage({ params }: PageProps<"/admin/[collection]">) {
  return (
    <Suspense fallback={<div aria-hidden className="h-96 animate-pulse rounded-[26px] bg-paper" />}>
      <Collection params={params} />
    </Suspense>
  );
}

async function Collection({ params }: { params: PageProps<"/admin/[collection]">["params"] }) {
  const { collection } = await params;
  if (!getCollection(collection)) notFound();
  return <CollectionList key={collection} collectionKey={collection} />;
}
