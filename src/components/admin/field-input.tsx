"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDownIcon,
  ArrowsClockwiseIcon,
  ArrowUpIcon,
  CaretDownIcon,
  CircleNotchIcon,
  ImageSquareIcon,
  PlusIcon,
  UploadSimpleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useToast } from "@/components/toast";
import { slugify, type Field } from "@/lib/cms/fields";
import { haptic } from "@/lib/haptics";
import { RichText } from "./rich-text";
import { uploadImage } from "./upload";

const input =
  "w-full rounded-2xl bg-paper px-4 text-[15px] outline-none ring-1 ring-line transition placeholder:text-ink-3 focus:ring-2 focus:ring-ink aria-[invalid=true]:ring-brand";

type Props = {
  field: Field;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  /** The value of a slug field's source, for one-tap generation. */
  slugSource?: string;
};

export function FieldInput({ field, value, onChange, error, slugSource }: Props) {
  const id = `f-${field.name.replace(/\./g, "-")}`;
  const invalid = Boolean(error);
  const str = value === undefined || value === null ? "" : String(value);
  const count = "maxLength" in field && field.maxLength ? `${str.length}/${field.maxLength}` : null;

  let control: ReactNode;
  switch (field.type) {
    case "text":
      control = (
        <input id={id} value={str} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} aria-invalid={invalid} className={`${input} h-12`} />
      );
      break;
    case "slug":
      control = (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[15px] text-ink-3">/</span>
            <input
              id={id}
              value={str}
              onChange={(e) => onChange(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              aria-invalid={invalid}
              spellCheck={false}
              className={`${input} h-12 pl-7 font-mono text-[14px]`}
            />
          </div>
          <button
            type="button"
            title="Generate from title"
            aria-label="Generate from title"
            disabled={!slugSource}
            onClick={() => {
              haptic(5);
              onChange(slugify(slugSource ?? ""));
            }}
            className="grid size-12 shrink-0 place-items-center rounded-2xl bg-paper text-ink-2 ring-1 ring-line transition hover:text-ink active:scale-95 disabled:opacity-40"
          >
            <ArrowsClockwiseIcon size={18} weight="bold" />
          </button>
        </div>
      );
      break;
    case "textarea":
      control = (
        <textarea
          id={id}
          value={str}
          onChange={(e) => onChange(e.target.value)}
          rows={field.rows ?? 3}
          placeholder={field.placeholder}
          aria-invalid={invalid}
          className={`${input} resize-y py-3 leading-relaxed`}
        />
      );
      break;
    case "number":
      control = (
        <input
          id={id}
          type="number"
          inputMode="numeric"
          value={str}
          min={field.min}
          max={field.max}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder={field.placeholder}
          aria-invalid={invalid}
          className={`${input} tabular h-12`}
        />
      );
      break;
    case "date":
      control = <input id={id} type="date" value={str} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid} className={`${input} h-12`} />;
      break;
    case "select":
      control = (
        <div className="relative">
          <select id={id} value={str} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid} className={`${input} h-12 appearance-none pr-10`}>
            <option value="">Choose…</option>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <CaretDownIcon size={16} weight="bold" className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-3" />
        </div>
      );
      break;
    case "multiselect": {
      const selected = Array.isArray(value) ? (value as string[]) : [];
      control = (
        <div className="flex flex-wrap gap-2">
          {field.options.map((o) => {
            const on = selected.includes(o.value);
            return (
              <button
                key={o.value}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  haptic(5);
                  onChange(on ? selected.filter((v) => v !== o.value) : [...selected, o.value]);
                }}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${on ? "bg-ink text-white" : "bg-paper text-ink-2 ring-1 ring-line hover:ring-ink"}`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      );
      break;
    }
    case "boolean":
      control = (
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={Boolean(value)}
          onClick={() => {
            haptic(5);
            onChange(!value);
          }}
          className="flex items-center gap-3 text-[15px] font-semibold"
        >
          <span className={`relative h-7 w-12 rounded-full transition-colors ${value ? "bg-brand" : "bg-line-strong"}`}>
            <motion.span
              className="absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow"
              animate={{ x: value ? 20 : 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 34 }}
            />
          </span>
          {value ? "Yes" : "No"}
        </button>
      );
      break;
    case "list":
      control = <ListInput value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} itemLabel={field.itemLabel ?? "Item"} />;
      break;
    case "pairs":
      control = (
        <PairsInput
          value={Array.isArray(value) ? (value as Record<string, string>[]) : []}
          onChange={onChange}
          keys={field.keys}
          itemLabel={field.itemLabel}
        />
      );
      break;
    case "image":
      control = <ImageInput value={str} onChange={onChange} folder={field.folder} invalid={invalid} />;
      break;
    case "richtext":
      control = <RichText value={str} onChange={onChange} folder="content" invalid={invalid} />;
      break;
  }

  // Booleans label themselves; everything else gets a label row.
  return (
    <div className={field.wide || field.type === "richtext" ? "md:col-span-2" : undefined}>
      {field.type !== "boolean" && (
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <label htmlFor={id} className="text-sm font-bold">
            {field.label}
            {field.required && <span className="ml-1 text-brand" title="Needed to publish">•</span>}
          </label>
          {count && <span className={`tabular text-[12px] font-semibold ${str.length > Number(count.split("/")[1]) ? "text-brand" : "text-ink-3"}`}>{count}</span>}
        </div>
      )}
      {field.type === "boolean" ? (
        <div>
          <p className="mb-2 text-sm font-bold">{field.label}</p>
          {control}
        </div>
      ) : (
        control
      )}
      {(error || field.help) && <p className={`mt-1.5 text-[13px] ${error ? "font-semibold text-brand" : "text-ink-3"}`}>{error ?? field.help}</p>}
    </div>
  );
}

function move<T>(list: T[], from: number, to: number) {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function RowControls({ index, length, onMove, onRemove }: { index: number; length: number; onMove: (to: number) => void; onRemove: () => void }) {
  const cls = "grid size-8 place-items-center rounded-full text-ink-3 transition hover:bg-mist hover:text-ink disabled:opacity-25";
  return (
    <div className="flex shrink-0 items-center">
      <button type="button" aria-label="Move up" disabled={index === 0} onClick={() => onMove(index - 1)} className={cls}>
        <ArrowUpIcon size={15} weight="bold" />
      </button>
      <button type="button" aria-label="Move down" disabled={index === length - 1} onClick={() => onMove(index + 1)} className={cls}>
        <ArrowDownIcon size={15} weight="bold" />
      </button>
      <button type="button" aria-label="Remove" onClick={onRemove} className={`${cls} hover:bg-brand-tint hover:text-brand`}>
        <XIcon size={15} weight="bold" />
      </button>
    </div>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => {
        haptic(5);
        onClick();
      }}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line-strong text-sm font-bold text-ink-2 transition-colors hover:border-ink hover:text-ink"
    >
      <PlusIcon size={16} weight="bold" /> {children}
    </button>
  );
}

function ListInput({ value, onChange, itemLabel }: { value: string[]; onChange: (v: unknown) => void; itemLabel: string }) {
  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {value.map((item, i) => (
          <motion.div key={i} layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1">
            <input
              value={item}
              aria-label={`${itemLabel} ${i + 1}`}
              onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))}
              onPaste={(e) => {
                // Pasting several lines fills several items at once.
                const lines = e.clipboardData.getData("text").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
                if (lines.length < 2) return;
                e.preventDefault();
                onChange([...value.slice(0, i), ...lines, ...value.slice(i + 1)]);
              }}
              className={`${input} h-11 flex-1`}
            />
            <RowControls index={i} length={value.length} onMove={(to) => onChange(move(value, i, to))} onRemove={() => onChange(value.filter((_, j) => j !== i))} />
          </motion.div>
        ))}
      </AnimatePresence>
      <AddButton onClick={() => onChange([...value, ""])}>Add {itemLabel.toLowerCase()}</AddButton>
    </div>
  );
}

function PairsInput({
  value,
  onChange,
  keys,
  itemLabel,
}: {
  value: Record<string, string>[];
  onChange: (v: unknown) => void;
  keys: Extract<Field, { type: "pairs" }>["keys"];
  itemLabel: string;
}) {
  const update = (i: number, key: string, v: string) => onChange(value.map((row, j) => (j === i ? { ...row, [key]: v } : row)));
  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {value.map((row, i) => (
          <motion.div
            key={i}
            layout
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-[20px] bg-mist p-3"
          >
            <div className="mb-2 flex items-center justify-between pl-1">
              <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-ink-3">
                {itemLabel} {i + 1}
              </span>
              <RowControls index={i} length={value.length} onMove={(to) => onChange(move(value, i, to))} onRemove={() => onChange(value.filter((_, j) => j !== i))} />
            </div>
            <div className={`grid gap-2 ${keys.some((k) => k.multiline) ? "" : "sm:grid-cols-2"}`}>
              {keys.map((k) =>
                k.multiline ? (
                  <textarea
                    key={k.name}
                    value={row[k.name] ?? ""}
                    aria-label={k.label}
                    placeholder={k.placeholder ?? k.label}
                    rows={3}
                    onChange={(e) => update(i, k.name, e.target.value)}
                    className={`${input} resize-y py-3 leading-relaxed`}
                  />
                ) : (
                  <input
                    key={k.name}
                    value={row[k.name] ?? ""}
                    aria-label={k.label}
                    placeholder={k.placeholder ?? k.label}
                    onChange={(e) => update(i, k.name, e.target.value)}
                    className={`${input} h-11`}
                  />
                ),
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <AddButton onClick={() => onChange([...value, Object.fromEntries(keys.map((k) => [k.name, ""]))])}>Add {itemLabel.toLowerCase()}</AddButton>
    </div>
  );
}

function ImageInput({ value, onChange, folder, invalid }: { value: string; onChange: (v: unknown) => void; folder: string; invalid: boolean }) {
  const toast = useToast();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function upload(file: File) {
    setBusy(true);
    try {
      onChange(await uploadImage(file, folder));
      haptic(10);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) void upload(file);
        }}
        className={`relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-[20px] transition ${
          dragging ? "bg-sun-tint ring-2 ring-sun" : invalid ? "bg-paper ring-1 ring-brand" : "bg-paper ring-1 ring-line"
        }`}
      >
        {value ? (
          <>
            <Image src={value} alt="" fill sizes="(min-width: 768px) 420px, 100vw" className="object-cover" unoptimized={!value.includes("res.cloudinary.com")} />
            <div className="absolute right-2 bottom-2 flex gap-1.5">
              <button
                type="button"
                onClick={() => ref.current?.click()}
                className="flex h-9 items-center gap-1.5 rounded-full bg-black/60 px-3.5 text-[13px] font-bold text-white backdrop-blur"
              >
                <UploadSimpleIcon size={15} weight="bold" /> Replace
              </button>
              <button type="button" aria-label="Remove image" onClick={() => onChange("")} className="grid size-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur">
                <XIcon size={15} weight="bold" />
              </button>
            </div>
          </>
        ) : (
          <button type="button" onClick={() => ref.current?.click()} className="flex flex-col items-center gap-2 p-6 text-center text-ink-2">
            <span className="grid size-12 place-items-center rounded-2xl bg-mist">
              <ImageSquareIcon size={24} weight="fill" />
            </span>
            <span className="text-sm font-bold">Tap to upload</span>
            <span className="text-[12px] text-ink-3">or drop an image here · max 8 MB</span>
          </button>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-paper/80 backdrop-blur-sm">
            <CircleNotchIcon size={28} weight="bold" className="animate-spin text-brand" />
          </div>
        )}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
        placeholder="…or paste an image URL"
        aria-label="Image URL"
        className={`${input} h-10 text-[13px]`}
      />
      <input
        ref={ref}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void upload(file);
        }}
      />
    </div>
  );
}
