"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowSquareOutIcon, MagnifyingGlassIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { Segmented } from "@/components/segmented";
import { Sheet } from "@/components/sheet";
import { useToast } from "@/components/toast";
import { getCollection } from "@/lib/cms/collections";
import { getPath } from "@/lib/cms/fields";
import { haptic } from "@/lib/haptics";
import { button } from "@/lib/ui";
import { AdminIcon } from "./admin-icon";
import { adminApi, timeAgo } from "./api";
import { AdminHeader } from "./shell";

type Row = Record<string, unknown> & { _id: string; status?: string; updatedAt?: string };

const statuses = ["All", "Live", "Drafts"] as const;

export function StatusPill({ status }: { status?: string }) {
  const live = status === "published";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
        live ? "bg-emerald-50 text-emerald-700" : "bg-fog text-ink-2"
      }`}
    >
      <span className={`size-1.5 rounded-full ${live ? "bg-emerald-500" : "bg-ink-3"}`} />
      {live ? "Live" : "Draft"}
    </span>
  );
}

export function CollectionList({ collectionKey }: { collectionKey: string }) {
  const config = getCollection(collectionKey)!;
  const toast = useToast();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(0);
  const [group, setGroup] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    adminApi<{ docs: Row[] }>(`/api/admin/cms/${collectionKey}`).then(
      (d) => setRows(d.docs),
      (e: Error) => setError(e.message),
    );
  }, [collectionKey]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (rows ?? []).filter((row) => {
      if (status === 1 && row.status !== "published") return false;
      if (status === 2 && row.status === "published") return false;
      if (group && config.filterField && getPath(row, config.filterField.name) !== group) return false;
      if (!q) return true;
      return [config.titleField, "slug", "excerpt", "reviewText", "answer"].some((f) =>
        String(getPath(row, f) ?? "").toLowerCase().includes(q),
      );
    });
  }, [rows, query, status, group, config]);

  const groups = config.filterField?.options.filter((o) => rows?.some((r) => getPath(r, config.filterField!.name) === o.value));

  async function remove() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await adminApi(`/api/admin/cms/${collectionKey}/${toDelete._id}`, { method: "DELETE" });
      setRows((r) => r?.filter((x) => x._id !== toDelete._id) ?? null);
      haptic(12);
      toast("Deleted");
      setToDelete(null);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Couldn't delete");
    } finally {
      setDeleting(false);
    }
  }

  const live = rows?.filter((r) => r.status === "published").length ?? 0;

  return (
    <>
      <AdminHeader
        title={config.label}
        subtitle={rows ? `${rows.length} total · ${live} live · ${rows.length - live} drafts` : config.description}
        actions={
          <Link href={`/admin/${collectionKey}/new`} className={button("primary", "md")}>
            <PlusIcon size={18} weight="bold" /> New {config.singular.toLowerCase()}
          </Link>
        }
      />

      <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-20 -mx-4 space-y-3 bg-mist/90 px-4 py-3 backdrop-blur-xl lg:top-0 md:-mx-8 md:px-8">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <MagnifyingGlassIcon size={18} weight="bold" className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-3" />
            <span className="sr-only">Search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${config.label.toLowerCase()}`}
              className="h-11 w-full rounded-full bg-paper pr-4 pl-11 text-[15px] outline-none ring-1 ring-line transition focus:ring-2 focus:ring-ink"
            />
          </label>
          <div className="md:w-72">
            <Segmented label="Status" options={[...statuses]} value={status} onChange={setStatus} />
          </div>
        </div>
        {groups && groups.length > 1 && (
          <div className="rail -mx-4 gap-2 px-4 md:mx-0 md:flex-wrap md:px-0">
            {[{ value: null, label: "All" }, ...groups].map((g) => {
              const active = group === g.value;
              return (
                <button
                  key={g.label}
                  type="button"
                  onClick={() => {
                    haptic(5);
                    setGroup(g.value);
                  }}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-bold transition-colors ${
                    active ? "bg-ink text-white" : "bg-paper text-ink-2 hover:bg-fog"
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {error && <p className="mt-4 rounded-2xl bg-brand-tint px-4 py-3 text-sm font-semibold text-brand-deep">{error}</p>}

      {!rows && !error && (
        <ul className="mt-3 space-y-2" aria-hidden>
          {Array.from({ length: 6 }, (_, i) => (
            <li key={i} className="h-[76px] animate-pulse rounded-[22px] bg-paper" />
          ))}
        </ul>
      )}

      {rows && shown.length === 0 && (
        <div className="mt-6 flex flex-col items-center rounded-[26px] bg-paper px-6 py-14 text-center">
          <span className="grid size-14 place-items-center rounded-[20px] bg-sun">
            <AdminIcon name={collectionKey} size={26} weight="fill" />
          </span>
          <p className="mt-4 font-display text-[22px] font-bold tracking-[-0.02em]">
            {rows.length === 0 ? `No ${config.label.toLowerCase()} yet` : "Nothing matches"}
          </p>
          <p className="mt-1 max-w-sm text-[15px] text-ink-2">{rows.length === 0 ? config.description : "Try a different search or filter."}</p>
          {rows.length === 0 && (
            <Link href={`/admin/${collectionKey}/new`} className={`${button("primary", "md")} mt-5`}>
              <PlusIcon size={18} weight="bold" /> Add the first one
            </Link>
          )}
        </div>
      )}

      <ul className="mt-3 space-y-2">
        <AnimatePresence initial={false}>
          {shown.map((row) => {
            const image = config.imageField ? (getPath(row, config.imageField) as string | undefined) : undefined;
            const publicPath = row.status === "published" ? config.publicPath?.(row) : null;
            return (
              <motion.li
                key={row._id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
                className="flex items-center gap-1 rounded-[22px] bg-paper pr-2 transition-shadow hover:shadow-card"
              >
                <Link href={`/admin/${collectionKey}/${row._id}`} className="flex min-w-0 flex-1 items-center gap-3.5 p-3 md:p-4">
                  <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-mist">
                    {image ? (
                      <Image src={image} alt="" fill sizes="48px" className="object-cover" />
                    ) : (
                      <AdminIcon name={collectionKey} className="text-ink-3" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-bold">{String(getPath(row, config.titleField) || "Untitled")}</span>
                    <span className="mt-0.5 flex items-center gap-2 text-[13px] text-ink-3">
                      <StatusPill status={row.status} />
                      <span className="truncate">{[config.subtitle?.(row), timeAgo(row.updatedAt)].filter(Boolean).join(" · ")}</span>
                    </span>
                  </span>
                </Link>
                {publicPath && (
                  <a
                    href={publicPath}
                    target="_blank"
                    aria-label="View on site"
                    className="hidden size-9 shrink-0 place-items-center rounded-full text-ink-3 hover:bg-mist hover:text-ink sm:grid"
                  >
                    <ArrowSquareOutIcon size={18} />
                  </a>
                )}
                <button
                  type="button"
                  aria-label="Delete"
                  onClick={() => setToDelete(row)}
                  className="grid size-9 shrink-0 place-items-center rounded-full text-ink-3 hover:bg-brand-tint hover:text-brand"
                >
                  <TrashIcon size={18} />
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      <ConfirmDelete
        open={Boolean(toDelete)}
        name={toDelete ? String(getPath(toDelete, config.titleField) || "this entry") : ""}
        busy={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={remove}
      />
    </>
  );
}

export function ConfirmDelete({
  open,
  name,
  busy,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  name: string;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Sheet open={open} onClose={onCancel} title="Delete this?" description={`“${name}” will be removed for good. This can't be undone.`}>
      <div className="grid grid-cols-2 gap-2 pt-2">
        <button type="button" onClick={onCancel} className={button("quiet", "lg")}>
          Keep it
        </button>
        <button type="button" disabled={busy} onClick={onConfirm} className={`${button("primary", "lg")} disabled:opacity-70`}>
          <TrashIcon size={18} weight="fill" /> {busy ? "Deleting…" : "Delete"}
        </button>
      </div>
    </Sheet>
  );
}
