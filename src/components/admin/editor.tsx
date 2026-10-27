"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowSquareOutIcon, CaretLeftIcon, CircleNotchIcon, EyeSlashIcon, RocketLaunchIcon, TrashIcon } from "@phosphor-icons/react";
import { useToast } from "@/components/toast";
import { getCollection } from "@/lib/cms/collections";
import { allFields, getPath, setPath, slugify, validateDoc } from "@/lib/cms/fields";
import { haptic } from "@/lib/haptics";
import { button } from "@/lib/ui";
import { ApiError, adminApi, timeAgo } from "./api";
import { ConfirmDelete, StatusPill } from "./collection-list";
import { FieldInput } from "./field-input";

type Doc = Record<string, unknown> & { _id?: string; status?: string; updatedAt?: string };

export function Editor({ collectionKey, id }: { collectionKey: string; id?: string }) {
  const config = getCollection(collectionKey)!;
  const router = useRouter();
  const toast = useToast();
  const [doc, setDoc] = useState<Doc | null>(id ? null : { status: "draft" });
  const [saved, setSaved] = useState<string>(id ? "" : JSON.stringify({ status: "draft" }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<"draft" | "published" | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  // New entries derive the slug from the title until someone edits it by hand.
  const slugTouched = useRef(Boolean(id));

  const fields = useMemo(() => allFields(config), [config]);
  const slugField = fields.find((f) => f.type === "slug");

  useEffect(() => {
    if (!id) return;
    adminApi<{ doc: Doc }>(`/api/admin/cms/${collectionKey}/${id}`).then(
      ({ doc }) => {
        setDoc(doc);
        setSaved(JSON.stringify(doc));
      },
      (e: Error) => setLoadError(e.message),
    );
  }, [collectionKey, id]);

  const dirty = doc !== null && JSON.stringify(doc) !== saved;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update(name: string, value: unknown) {
    setDoc((d) => {
      let next = setPath(d ?? {}, name, value);
      if (slugField && "from" in slugField && name === slugField.from && !slugTouched.current) {
        next = setPath(next, slugField.name, slugify(String(value ?? "")));
      }
      return next;
    });
    if (slugField && name === slugField.name) slugTouched.current = true;
    if (errors[name])
      setErrors((e) => {
        const next = { ...e };
        delete next[name];
        return next;
      });
  }

  const save = useCallback(
    async (status: "draft" | "published") => {
      if (!doc || saving) return;
      const next = { ...doc, status };
      const problems = validateDoc(config, next);
      if (Object.keys(problems).length) {
        setErrors(problems);
        haptic(30);
        toast(status === "published" ? "Fill the highlighted fields to publish" : "Fill the highlighted fields");
        document.getElementById(`f-${Object.keys(problems)[0].replace(/\./g, "-")}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      setSaving(status);
      try {
        const res = await adminApi<{ doc: Doc }>(id ? `/api/admin/cms/${collectionKey}/${id}` : `/api/admin/cms/${collectionKey}`, {
          method: id ? "PUT" : "POST",
          body: JSON.stringify(next),
        });
        setDoc(res.doc);
        setSaved(JSON.stringify(res.doc));
        setErrors({});
        haptic(12);
        toast(status === "published" ? (doc.status === "published" ? "Changes are live" : "Published") : "Draft saved");
        if (!id) router.replace(`/admin/${collectionKey}/${res.doc._id}`);
      } catch (e) {
        if (e instanceof ApiError && Object.keys(e.errors).length) setErrors(e.errors);
        toast(e instanceof Error ? e.message : "Couldn't save");
      } finally {
        setSaving(null);
      }
    },
    [doc, saving, config, id, collectionKey, router, toast],
  );

  // Cmd/Ctrl+S keeps the current status.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        void save(doc?.status === "published" ? "published" : "draft");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save, doc?.status]);

  async function remove() {
    if (!id) return;
    setDeleting(true);
    try {
      await adminApi(`/api/admin/cms/${collectionKey}/${id}`, { method: "DELETE" });
      setSaved(JSON.stringify(doc));
      toast("Deleted");
      router.replace(`/admin/${collectionKey}`);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Couldn't delete");
      setDeleting(false);
    }
  }

  if (loadError) {
    return (
      <div className="rounded-[26px] bg-paper p-8 text-center">
        <p className="font-display text-[22px] font-bold">Couldn&apos;t open this entry</p>
        <p className="mt-1 text-ink-2">{loadError}</p>
        <Link href={`/admin/${collectionKey}`} className={`${button("quiet")} mt-5`}>
          Back to {config.label}
        </Link>
      </div>
    );
  }

  if (!doc) return <EditorSkeleton />;

  const live = doc.status === "published";
  const publicPath = live && id ? config.publicPath?.(doc) : null;
  const title = String(getPath(doc, config.titleField) || "") || `New ${config.singular.toLowerCase()}`;

  return (
    <div>
      <Link
        href={`/admin/${collectionKey}`}
        className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-ink-2 transition-colors hover:text-ink"
      >
        <CaretLeftIcon size={15} weight="bold" /> {config.label}
      </Link>
      <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <StatusPill status={doc.status} />
            {dirty && <span className="text-[12px] font-bold text-sun-deep">Unsaved changes</span>}
            {!dirty && doc.updatedAt && <span className="text-[12px] font-semibold text-ink-3">Saved {timeAgo(doc.updatedAt)}</span>}
          </div>
          <h1 className="mt-2 line-clamp-2 font-display text-[28px] font-bold leading-[1.05] tracking-[-0.03em] md:text-[38px]">{title}</h1>
        </div>
        <div className="flex shrink-0 gap-2">
          {publicPath && (
            <a href={publicPath} target="_blank" className={button("white", "sm")}>
              <ArrowSquareOutIcon size={16} weight="bold" /> View
            </a>
          )}
          {id && (
            <button type="button" onClick={() => setConfirmDelete(true)} className={`${button("white", "sm")} hover:text-brand`}>
              <TrashIcon size={16} weight="bold" /> Delete
            </button>
          )}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void save(live ? "published" : "draft");
        }}
        className="space-y-4"
      >
        {config.sections.map((section, i) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[26px] bg-paper/60 p-4 ring-1 ring-line md:p-6"
          >
            <h2 className="font-display text-[20px] font-bold tracking-[-0.02em]">{section.title}</h2>
            {section.description && <p className="mt-0.5 text-sm text-ink-2">{section.description}</p>}
            <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
              {section.fields.map((field) => (
                <FieldInput
                  key={field.name}
                  field={field}
                  value={getPath(doc, field.name)}
                  error={errors[field.name]}
                  onChange={(v) => update(field.name, v)}
                  slugSource={field.type === "slug" ? String(getPath(doc, field.from) ?? "") : undefined}
                />
              ))}
            </div>
          </motion.section>
        ))}
        <p className="px-1 text-[13px] text-ink-3">
          <span className="text-brand">•</span> marks fields needed before publishing. Drafts can be saved with just the{" "}
          {slugField ? "title and URL slug" : "title"}.
        </p>
      </form>

      {/* Sticky action bar, thumb-reachable on phones */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/90 backdrop-blur-xl lg:left-64" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3 md:px-8">
          {live ? (
            <button type="button" onClick={() => save("draft")} disabled={Boolean(saving)} className={`${button("quiet", "md")} disabled:opacity-60`}>
              {saving === "draft" ? <CircleNotchIcon size={18} weight="bold" className="animate-spin" /> : <EyeSlashIcon size={18} weight="bold" />}
              <span className="hidden sm:inline">Unpublish</span>
            </button>
          ) : (
            <button type="button" onClick={() => save("draft")} disabled={Boolean(saving)} className={`${button("quiet", "md")} flex-1 disabled:opacity-60 sm:flex-none`}>
              {saving === "draft" && <CircleNotchIcon size={18} weight="bold" className="animate-spin" />}
              Save draft
            </button>
          )}
          <span className="hidden flex-1 text-[13px] font-semibold text-ink-3 md:block">
            {dirty ? "You have unsaved changes · ⌘S to save" : "All changes saved"}
          </span>
          <button
            type="button"
            onClick={() => save("published")}
            disabled={Boolean(saving) || (live && !dirty)}
            className={`${button("primary", "md")} flex-1 disabled:opacity-60 sm:flex-none`}
          >
            {saving === "published" ? <CircleNotchIcon size={18} weight="bold" className="animate-spin" /> : <RocketLaunchIcon size={18} weight="fill" />}
            {live ? "Update live" : "Publish"}
          </button>
        </div>
      </div>

      <ConfirmDelete open={confirmDelete} name={title} busy={deleting} onCancel={() => setConfirmDelete(false)} onConfirm={remove} />
    </div>
  );
}

export function EditorSkeleton() {
  return (
    <div aria-hidden className="space-y-4">
      <div className="h-5 w-24 animate-pulse rounded-full bg-paper" />
      <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-paper" />
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="h-56 animate-pulse rounded-[26px] bg-paper" />
      ))}
    </div>
  );
}
