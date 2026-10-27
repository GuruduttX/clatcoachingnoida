import { getPath } from "@/lib/cms/fields";

// Typed readers for loosely-typed CMS documents.
type AnyDoc = Record<string, unknown>;

export function str(doc: AnyDoc, path: string): string {
  const v = getPath(doc, path);
  return typeof v === "string" ? v : typeof v === "number" ? String(v) : "";
}

export function num(doc: AnyDoc, path: string): number | null {
  const v = getPath(doc, path);
  const n = typeof v === "number" ? v : typeof v === "string" && v.trim() ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
}

export function list(doc: AnyDoc, path: string): string[] {
  const v = getPath(doc, path);
  return Array.isArray(v) ? v.map((x) => String(x ?? "").trim()).filter(Boolean) : [];
}

export function rows<K extends string>(doc: AnyDoc, path: string, keys: readonly K[]): Record<K, string>[] {
  const v = getPath(doc, path);
  if (!Array.isArray(v)) return [];
  return v
    .map((row) => Object.fromEntries(keys.map((k) => [k, String((row as AnyDoc | null)?.[k] ?? "").trim()])) as Record<K, string>)
    .filter((row) => keys.every((k) => row[k]));
}

export function faqs(doc: AnyDoc) {
  return rows(doc, "faqs", ["question", "answer"] as const);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2026-10-04" → "4 Oct 2026". Parsed by hand so render output never depends on the clock or timezone. */
export function formatDate(value: string, style: "short" | "long" = "short") {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? "");
  if (!m) return value ?? "";
  const month = Number(m[2]) - 1;
  if (month < 0 || month > 11) return value;
  return `${Number(m[3])} ${(style === "long" ? MONTHS_LONG : MONTHS)[month]} ${m[1]}`;
}

/** "2026-10-04" → "October 2026" (for grouping). */
export function monthLabel(value: string) {
  const m = /^(\d{4})-(\d{2})/.exec(value ?? "");
  if (!m) return "Undated";
  const month = Number(m[2]) - 1;
  return month >= 0 && month <= 11 ? `${MONTHS_LONG[month]} ${m[1]}` : "Undated";
}

export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  if (items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function articleJsonLd({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
  url,
}: {
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description: description || undefined,
    image: image || undefined,
    datePublished: datePublished || undefined,
    dateModified: dateModified || datePublished || undefined,
    mainEntityOfPage: url,
    author: { "@type": "Person", name: author || "Anand Sharma" },
    publisher: { "@type": "Organization", name: "LawPrep Tutorial Noida" },
  };
}
