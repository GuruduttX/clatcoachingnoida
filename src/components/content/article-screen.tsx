import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  ChatCircleTextIcon,
  ClockIcon,
  LightningIcon,
  LinkSimpleIcon,
  SealCheckIcon,
} from "@phosphor-icons/react/ssr";
import { Accordion, type QA } from "@/components/accordion";
import { ArticleBody } from "@/components/article-body";
import { EnquireButton } from "@/components/enquire-button";
import { button } from "@/lib/ui";
import { faqJsonLd, formatDate, jsonLd } from "./doc";
import { SmartImage } from "./smart-image";

// Building blocks for every CMS detail screen. The scannable parts (quick
// answer, facts, takeaways) come first; the long body is last.

export function ArticleShell({ children, jsonLdData }: { children: ReactNode; jsonLdData?: unknown[] }) {
  return (
    <article className="mx-auto max-w-3xl px-4 pt-2 pb-16 md:px-6 md:pt-10 md:pb-28">
      {jsonLdData?.filter(Boolean).map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={jsonLd(data)} />
      ))}
      {children}
    </article>
  );
}

export function ArticleHeader({
  back,
  eyebrow,
  title,
  chips = [],
  image,
  alt,
  aside,
}: {
  back: { href: string; label: string };
  eyebrow?: string;
  title: string;
  chips?: string[];
  image?: string;
  alt?: string;
  /** Rendered over the bottom-left of the hero image (e.g. a topper badge). */
  aside?: ReactNode;
}) {
  return (
    <header>
      <Link
        href={back.href}
        className="hidden items-center gap-1.5 text-sm font-bold text-ink-3 transition-colors hover:text-ink md:inline-flex"
      >
        <ArrowLeftIcon size={15} weight="bold" /> {back.label}
      </Link>
      {eyebrow && <p className="mt-1 text-[13px] font-bold text-brand md:mt-5">{eyebrow}</p>}
      <h1 className="mt-1.5 font-display text-[32px] font-bold leading-[1.02] tracking-[-0.035em] text-balance md:text-[52px]">
        {title}
      </h1>
      {chips.filter(Boolean).length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {chips.filter(Boolean).map((chip) => (
            <li key={chip} className="rounded-full bg-mist px-3 py-1.5 text-[13px] font-semibold text-ink-2">
              {chip}
            </li>
          ))}
        </ul>
      )}
      {image && (
        <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-[26px] bg-mist md:mt-8 md:rounded-[32px]">
          <SmartImage src={image} alt={alt || title} priority sizes="(min-width: 768px) 720px, 100vw" className="object-cover" />
          {aside && (
            <>
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/70 to-transparent" />
              <div className="absolute inset-x-4 bottom-4">{aside}</div>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export function Byline({ author, date, readTime }: { author?: string; date?: string; readTime?: number | null }) {
  if (!author && !date && !readTime) return null;
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-semibold text-ink-3">
      {author && (
        <span className="flex items-center gap-2 text-ink">
          <span className="grid size-7 place-items-center rounded-full bg-sun text-[12px] font-extrabold">
            {author.charAt(0)}
          </span>
          {author}
        </span>
      )}
      {date && <span>{formatDate(date)}</span>}
      {readTime ? (
        <span className="flex items-center gap-1">
          <ClockIcon size={14} weight="bold" /> {readTime} min read
        </span>
      ) : null}
    </div>
  );
}

export function QuickAnswer({ text, label = "Quick answer" }: { text: string; label?: string }) {
  if (!text) return null;
  return (
    <section className="mt-6 rounded-[24px] bg-sun p-5 md:mt-8 md:p-7">
      <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.12em] text-ink/65">
        <LightningIcon size={14} weight="fill" /> {label}
      </p>
      <p className="mt-2 text-[17px] font-semibold leading-relaxed text-ink md:text-lg">{text}</p>
    </section>
  );
}

export function FactTiles({ title, rows }: { title?: string; rows: { label: string; value: string }[] }) {
  if (rows.length === 0) return null;
  return (
    <section className="mt-6 md:mt-8">
      {title && <h2 className="mb-3 font-display text-[22px] font-bold tracking-[-0.02em] md:text-[28px]">{title}</h2>}
      <dl className="grid grid-cols-2 gap-2 md:gap-3">
        {rows.map((row) => (
          <div key={row.label} className="rounded-[20px] bg-mist px-4 py-3.5 md:px-5 md:py-4">
            <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-3">{row.label}</dt>
            <dd className="mt-1 text-[15px] font-bold leading-snug text-ink md:text-base">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Takeaways({ items, title = "Key takeaways" }: { items: string[]; title?: string }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-6 rounded-[26px] bg-ink p-5 text-white md:mt-8 md:p-7">
      <h2 className="font-display text-[22px] font-bold tracking-[-0.02em]">{title}</h2>
      <ol className="mt-4 space-y-3">
        {items.map((item, i) => (
          <li key={item} className="flex gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-[13px] font-extrabold tabular">
              {i + 1}
            </span>
            <span className="pt-0.5 text-[15px] leading-relaxed text-white/85">{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Body({ html, title }: { html: string; title?: string }) {
  if (!html || html === "<p></p>") return null;
  return (
    <section className="mt-10 md:mt-14">
      {title && <h2 className="mb-2 font-display text-[22px] font-bold tracking-[-0.02em] md:text-[28px]">{title}</h2>}
      <ArticleBody html={html} />
    </section>
  );
}

export function Sources({ items }: { items: { label: string; url: string }[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-10">
      <h2 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.12em] text-ink-3">
        <SealCheckIcon size={16} weight="fill" className="text-brand" /> Sources
      </h2>
      <ul className="mt-3 divide-y divide-line overflow-hidden rounded-[20px] border border-line">
        {items.map((s) => (
          <li key={s.url}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 text-[15px] font-semibold transition-colors hover:bg-mist"
            >
              <LinkSimpleIcon size={16} weight="bold" className="shrink-0 text-ink-3" />
              <span className="min-w-0 flex-1 truncate">{s.label}</span>
              <ArrowUpRightIcon size={14} weight="bold" className="shrink-0 text-ink-3" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FaqBlock({ items, title = "Questions students ask" }: { items: QA[]; title?: string }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-10 md:mt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd(items))} />
      <h2 className="mb-4 font-display text-[22px] font-bold tracking-[-0.02em] md:text-[28px]">{title}</h2>
      <Accordion items={items} />
    </section>
  );
}

export function Tags({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-8 flex flex-wrap gap-2">
      {items.map((tag) => (
        <li key={tag} className="rounded-full border border-line px-3 py-1 text-[13px] font-semibold text-ink-3">
          #{tag}
        </li>
      ))}
    </ul>
  );
}

export function CounsellorCard({ interest, title = "Want a plan like this for you?" }: { interest?: string; title?: string }) {
  return (
    <aside className="mt-12 flex flex-col gap-4 rounded-[26px] bg-brand p-5 text-white md:flex-row md:items-center md:justify-between md:p-7">
      <div>
        <p className="font-display text-[22px] font-bold leading-tight tracking-[-0.02em] md:text-[26px]">{title}</p>
        <p className="mt-1 text-[15px] text-white/80">Free counselling call with the Noida team.</p>
      </div>
      <EnquireButton interest={interest} source="article" className={`${button("white", "lg")} shrink-0`}>
        <ChatCircleTextIcon size={20} weight="fill" className="text-brand" /> Talk to a counsellor
      </EnquireButton>
    </aside>
  );
}

export function RelatedLinks({ title, items }: { title: string; items: { href: string; label: string; note?: string }[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-10">
      <h2 className="mb-3 font-display text-[22px] font-bold tracking-[-0.02em]">{title}</h2>
      <ul className="divide-y divide-line overflow-hidden rounded-[22px] bg-mist">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-fog active:bg-fog md:px-6">
              <span className="min-w-0 flex-1">
                <span className="block font-bold leading-snug">{item.label}</span>
                {item.note && <span className="block truncate text-sm text-ink-2">{item.note}</span>}
              </span>
              <ArrowUpRightIcon size={16} weight="bold" className="shrink-0 text-ink-3" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
