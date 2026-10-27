import { collections } from "@/lib/cms/collections";

export const adminNav = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/enquiries", label: "Enquiries", icon: "inbox" },
  ...collections.map((c) => ({ href: `/admin/${c.key}`, label: c.label, icon: c.key })),
];
