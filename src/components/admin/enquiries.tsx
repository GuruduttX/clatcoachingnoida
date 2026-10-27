"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CircleNotchIcon,
  DownloadSimpleIcon,
  LockSimpleIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  ShieldCheckIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react";
import { Segmented } from "@/components/segmented";
import { Sheet } from "@/components/sheet";
import { useToast } from "@/components/toast";
import { ENQUIRY_SOURCE_LABELS, ENQUIRY_STATUSES, type EnquiryStatus } from "@/lib/cms/enquiries";
import { haptic } from "@/lib/haptics";
import { button } from "@/lib/ui";
import { adminApi, timeAgo } from "./api";
import { AdminHeader } from "./shell";

type Enquiry = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  stage?: string;
  programInterest?: string;
  message?: string;
  source?: string;
  pageUrl?: string;
  status: EnquiryStatus;
  notes?: string;
  createdAt: string;
};

const statusStyle: Record<EnquiryStatus, string> = {
  new: "bg-brand text-white",
  contacted: "bg-sun text-ink",
  converted: "bg-emerald-500 text-white",
  closed: "bg-fog text-ink-2",
};

const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function EnquiriesScreen() {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    adminApi<{ unlocked: boolean }>("/api/auth/enquiry-access").then(
      (d) => setUnlocked(d.unlocked),
      () => setUnlocked(false),
    );
  }, []);

  if (unlocked === null) return <div className="h-64 animate-pulse rounded-[26px] bg-paper" />;
  if (!unlocked) return <AccessGate onUnlock={() => setUnlocked(true)} />;
  return <Inbox onLock={() => setUnlocked(false)} />;
}

function AccessGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function submit(value: string) {
    setBusy(true);
    try {
      await adminApi("/api/auth/enquiry-access", { method: "POST", body: JSON.stringify({ code: value }) });
      haptic(12);
      onUnlock();
    } catch {
      haptic(40);
      setError(true);
      setCode("");
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="mx-auto max-w-sm pt-6 text-center md:pt-14">
      <span className="mx-auto grid size-16 place-items-center rounded-[22px] bg-ink text-sun">
        <ShieldCheckIcon size={30} weight="fill" />
      </span>
      <h1 className="mt-5 font-display text-[30px] font-bold leading-none tracking-[-0.03em]">Enquiries are locked</h1>
      <p className="mt-2 text-[15px] text-ink-2">Student phone numbers need the access code as well as your sign-in.</p>

      <motion.label
        animate={error ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className="relative mt-8 flex justify-center gap-3"
        onClick={() => inputRef.current?.focus()}
      >
        <span className="sr-only">Access code</span>
        {Array.from({ length: 4 }, (_, i) => (
          <span
            key={i}
            className={`grid size-14 place-items-center rounded-2xl text-2xl font-extrabold transition-colors ${
              error ? "bg-brand-tint text-brand" : i < code.length ? "bg-ink text-white" : "bg-paper ring-1 ring-line"
            }`}
          >
            {i < code.length ? "•" : ""}
          </span>
        ))}
        <input
          ref={inputRef}
          autoFocus
          value={code}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={8}
          disabled={busy}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "");
            setError(false);
            setCode(v);
            if (v.length === 4) void submit(v);
          }}
          className="absolute inset-0 opacity-0"
        />
      </motion.label>
      <p className={`mt-4 h-5 text-sm font-semibold ${error ? "text-brand" : "text-ink-3"}`}>
        {busy ? "Checking…" : error ? "That code didn't work" : "Enter the 4-digit code"}
      </p>
    </div>
  );
}

function Inbox({ onLock }: { onLock: () => void }) {
  const toast = useToast();
  const [items, setItems] = useState<Enquiry[] | null>(null);
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Enquiry | null>(null);
  const tabs = ["new", "contacted", "converted", "closed", "all"] as const;

  useEffect(() => {
    adminApi<{ enquiries: Enquiry[] }>("/api/admin/enquiries").then(
      (d) => setItems(d.enquiries),
      (e: Error) => toast(e.message),
    );
  }, [toast]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items?.length ?? 0 };
    for (const s of ENQUIRY_STATUSES) c[s] = items?.filter((e) => e.status === s).length ?? 0;
    return c;
  }, [items]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (items ?? []).filter(
      (e) =>
        (tabs[tab] === "all" || e.status === tabs[tab]) &&
        (!q || [e.name, e.phone, e.email, e.programInterest, e.city].some((v) => v?.toLowerCase().includes(q))),
    );
    // tabs is a constant tuple
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, tab, query]);

  async function lock() {
    await fetch("/api/auth/enquiry-access", { method: "DELETE" });
    onLock();
  }

  function exportCsv() {
    const rows = [
      ["Received", "Name", "Phone", "Email", "Currently in", "Interested in", "City", "Source", "Status", "Notes", "Message"],
      ...shown.map((e) => [
        new Date(e.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        e.name,
        e.phone,
        e.email ?? "",
        e.stage ?? "",
        e.programInterest ?? "",
        e.city ?? "",
        ENQUIRY_SOURCE_LABELS[e.source ?? "other"] ?? "",
        e.status,
        e.notes ?? "",
        e.message ?? "",
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `noida-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function updated(next: Enquiry) {
    setItems((list) => list?.map((e) => (e._id === next._id ? next : e)) ?? null);
    setOpen(null);
  }

  return (
    <>
      <AdminHeader
        title="Enquiries"
        subtitle={items ? `${counts.new} new · ${counts.all} total` : "Loading…"}
        actions={
          <>
            <button type="button" onClick={exportCsv} disabled={!shown.length} className={`${button("white", "md")} disabled:opacity-50`}>
              <DownloadSimpleIcon size={18} weight="bold" /> CSV
            </button>
            <button type="button" onClick={lock} className={button("white", "md")}>
              <LockSimpleIcon size={18} weight="bold" /> Lock
            </button>
          </>
        }
      />

      <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-20 -mx-4 space-y-3 bg-mist/90 px-4 py-3 backdrop-blur-xl lg:top-0 md:-mx-8 md:px-8">
        <div className="rail -mx-4 gap-2 px-4 md:mx-0 md:px-0">
          {tabs.map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                haptic(5);
                setTab(i);
              }}
              className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${tab === i ? "text-white" : "bg-paper text-ink-2"}`}
            >
              {tab === i && (
                <motion.span layoutId="enq-tab" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 500, damping: 38 }} />
              )}
              <span className="relative">
                {label(t)} <span className={`tabular ${tab === i ? "text-white/55" : "text-ink-3"}`}>{counts[t]}</span>
              </span>
            </button>
          ))}
        </div>
        <label className="relative block">
          <MagnifyingGlassIcon size={18} weight="bold" className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-3" />
          <span className="sr-only">Search enquiries</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, course"
            className="h-11 w-full rounded-full bg-paper pr-4 pl-11 text-[15px] outline-none ring-1 ring-line focus:ring-2 focus:ring-ink"
          />
        </label>
      </div>

      {!items && (
        <ul className="mt-3 space-y-2" aria-hidden>
          {Array.from({ length: 5 }, (_, i) => (
            <li key={i} className="h-28 animate-pulse rounded-[22px] bg-paper" />
          ))}
        </ul>
      )}

      {items && shown.length === 0 && (
        <p className="mt-6 rounded-[22px] bg-paper px-6 py-12 text-center text-[15px] text-ink-2">
          {items.length === 0 ? "No enquiries yet. They'll appear here as soon as someone fills a form." : "Nothing in this view."}
        </p>
      )}

      <ul className="mt-3 grid gap-2 md:grid-cols-2">
        <AnimatePresence initial={false}>
          {shown.map((e) => (
            <motion.li
              key={e._id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col rounded-[22px] bg-paper p-4"
            >
              <button type="button" onClick={() => setOpen(e)} className="text-left">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[16px] font-bold">{e.name}</p>
                    <p className="tabular text-sm font-semibold text-ink-2">{e.phone}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyle[e.status]}`}>{label(e.status)}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {[e.stage, e.programInterest, ENQUIRY_SOURCE_LABELS[e.source ?? "other"]].filter(Boolean).map((chip) => (
                    <span key={chip} className="rounded-full bg-mist px-2.5 py-1 text-[12px] font-semibold text-ink-2">
                      {chip}
                    </span>
                  ))}
                </div>
                {(e.notes || e.message) && <p className="mt-2 line-clamp-2 text-sm text-ink-2">{e.notes || e.message}</p>}
              </button>
              <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
                <span className="flex-1 text-[12px] font-semibold text-ink-3">{timeAgo(e.createdAt)}</span>
                <a href={`tel:+91${e.phone}`} aria-label={`Call ${e.name}`} className="grid size-9 place-items-center rounded-full bg-brand text-white active:scale-90">
                  <PhoneIcon size={17} weight="fill" />
                </a>
                <a
                  href={`https://wa.me/91${e.phone}?text=${encodeURIComponent(`Hi ${e.name}, this is LawPrep Tutorial Noida about your CLAT enquiry.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`WhatsApp ${e.name}`}
                  className="grid size-9 place-items-center rounded-full bg-[#25d366] text-white active:scale-90"
                >
                  <WhatsappLogoIcon size={18} weight="fill" />
                </a>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <Sheet open={Boolean(open)} onClose={() => setOpen(null)} title={open?.name ?? ""} description={open ? `${open.phone} · ${timeAgo(open.createdAt)}` : undefined}>
        {open && <EnquiryDetail key={open._id} enquiry={open} onSaved={updated} />}
      </Sheet>
    </>
  );
}

function EnquiryDetail({ enquiry, onSaved }: { enquiry: Enquiry; onSaved: (e: Enquiry) => void }) {
  const toast = useToast();
  const [status, setStatus] = useState(ENQUIRY_STATUSES.indexOf(enquiry.status));
  const [notes, setNotes] = useState(enquiry.notes ?? "");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      const { enquiry: next } = await adminApi<{ enquiry: Enquiry }>(`/api/admin/enquiries/${enquiry._id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: ENQUIRY_STATUSES[status], notes }),
      });
      haptic(12);
      toast("Saved");
      onSaved(next);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Couldn't save");
      setBusy(false);
    }
  }

  const facts = [
    ["Currently in", enquiry.stage],
    ["Interested in", enquiry.programInterest],
    ["Email", enquiry.email],
    ["City", enquiry.city],
    ["Came from", ENQUIRY_SOURCE_LABELS[enquiry.source ?? "other"]],
    ["Received", new Date(enquiry.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <div className="space-y-5 pb-2">
      <dl className="grid grid-cols-2 gap-2">
        {facts.map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-mist px-3.5 py-3">
            <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-3">{k}</dt>
            <dd className="mt-1 break-words text-sm font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
      {enquiry.message && <p className="rounded-2xl bg-sun-tint px-4 py-3 text-[15px] leading-relaxed">{enquiry.message}</p>}
      {enquiry.pageUrl && (
        <p className="truncate text-[13px] text-ink-3">
          Page:{" "}
          <a href={enquiry.pageUrl} target="_blank" className="font-semibold underline">
            {enquiry.pageUrl.replace(/^https?:\/\/[^/]+/, "") || "/"}
          </a>
        </p>
      )}
      <div>
        <p className="mb-2 text-sm font-bold">Status</p>
        <Segmented label="Status" options={ENQUIRY_STATUSES.map(label)} value={status} onChange={setStatus} />
      </div>
      <label className="block">
        <span className="text-sm font-bold">Notes</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="e.g. Called on Monday, visiting Saturday with parents"
          className="mt-2 w-full resize-y rounded-2xl bg-mist px-4 py-3 text-[15px] outline-none focus:bg-paper focus:ring-2 focus:ring-ink"
        />
      </label>
      <button type="button" onClick={save} disabled={busy} className={`${button("primary", "lg")} w-full disabled:opacity-70`}>
        {busy && <CircleNotchIcon size={18} weight="bold" className="animate-spin" />}
        Save
      </button>
    </div>
  );
}
