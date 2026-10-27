"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRightIcon, PlusIcon } from "@phosphor-icons/react";
import { collections } from "@/lib/cms/collections";
import { button } from "@/lib/ui";
import { AdminIcon } from "./admin-icon";
import { adminApi } from "./api";
import { AdminHeader } from "./shell";

type Stats = {
  counts: { key: string; total: number; published: number }[];
  enquiries: { new: number; week: number };
};

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    adminApi<Stats>("/api/admin/stats").then(setStats, () => setFailed(true));
  }, []);

  const count = (key: string) => stats?.counts.find((c) => c.key === key);

  return (
    <>
      <AdminHeader
        title="Dashboard"
        subtitle="Everything on the Noida website, in one place."
        actions={
          <Link href="/admin/blogs/new" className={button("primary", "md")}>
            <PlusIcon size={18} weight="bold" /> New blog post
          </Link>
        }
      />

      {failed && (
        <p className="mb-6 rounded-2xl bg-brand-tint px-4 py-3 text-sm font-semibold text-brand-deep">
          Couldn&apos;t load the numbers. Check the database connection.
        </p>
      )}

      <Link
        href="/admin/enquiries"
        className="group relative block overflow-hidden rounded-[28px] bg-ink p-5 text-white md:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="grid size-11 place-items-center rounded-2xl bg-white/10">
            <AdminIcon name="inbox" weight="fill" className="text-sun" />
          </span>
          <ArrowRightIcon size={20} weight="bold" className="text-white/40 transition-transform group-hover:translate-x-1" />
        </div>
        <p className="mt-8 font-display text-[56px] font-extrabold leading-none tracking-[-0.04em] tabular md:text-[72px]">
          {stats ? stats.enquiries.new : "–"}
        </p>
        <p className="mt-2 text-[15px] text-white/70">
          new enquiries waiting · {stats ? stats.enquiries.week : "–"} in the last 7 days
        </p>
      </Link>

      <h2 className="mt-10 mb-4 font-display text-[22px] font-bold tracking-[-0.02em]">Content</h2>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {collections.map((c, i) => {
          const n = count(c.key);
          return (
            <motion.li
              key={c.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/admin/${c.key}`}
                className="flex h-full flex-col rounded-[22px] bg-paper p-4 transition-shadow hover:shadow-card md:p-5"
              >
                <span className="grid size-10 place-items-center rounded-2xl bg-mist text-ink">
                  <AdminIcon name={c.key} weight="fill" />
                </span>
                <span className="mt-5 font-display text-[32px] font-extrabold leading-none tracking-[-0.03em] tabular">
                  {n ? n.total : "–"}
                </span>
                <span className="mt-1 text-sm font-bold">{c.label}</span>
                <span className="mt-0.5 text-[12px] font-semibold text-ink-3">
                  {n ? `${n.published} live · ${n.total - n.published} draft` : " "}
                </span>
              </Link>
            </motion.li>
          );
        })}
      </ul>

      <h2 className="mt-10 mb-4 font-display text-[22px] font-bold tracking-[-0.02em]">Quick add</h2>
      <div className="rail -mx-4 gap-2 px-4 md:mx-0 md:flex-wrap md:px-0">
        {collections.map((c) => (
          <Link key={c.key} href={`/admin/${c.key}/new`} className={`${button("white", "md")} shrink-0`}>
            <PlusIcon size={16} weight="bold" /> {c.singular}
          </Link>
        ))}
      </div>
    </>
  );
}
