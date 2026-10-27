// Phone and email are the Delhi NCR branch's, taken from lawpreptutorialdelhi.com.
// The address and centre line are the Noida centre's own, from the same site.
export const site = {
  name: "LawPrep Tutorial Noida",
  url: "https://clatcoachingnoida.com",
  parentUrl: "https://lawpreptutorialdelhi.com",
  phone: "+91 87505 81505",
  phoneHref: "tel:+918750581505",
  centrePhone: "+91 92894 85508",
  centrePhoneHref: "tel:+919289485508",
  whatsappNumber: "918750581505",
  email: "lawpreptutorialdelhi@gmail.com",
  hours: "10:00 AM – 7:00 PM",
  opensAt: 10,
  closesAt: 19,
  address: "C-56/31, Ground Floor, Sector 62, Noida, UP 201309" as string | null,
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Law+Prep+Tutorial+C-56%2F31+Sector+62+Noida" as string | null,
  metro: "Noida Sector 62 / Electronic City (Blue Line)",
};

export const tabs = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/results", label: "Results" },
  { href: "/explore", label: "Explore" },
] as const;

// Top-level links on desktop. Everything else lives on the Explore screen.
export const desktopNav = [
  { href: "/courses", label: "Courses" },
  { href: "/results", label: "Results" },
  { href: "/faculty", label: "Faculty" },
  { href: "/resources", label: "Resources" },
  { href: "/visit", label: "Visit" },
  { href: "/explore", label: "Explore" },
] as const;

export type Destination = { href: string; label: string; note: string; icon: string };

// Every screen, grouped the way the Explore tab shows them.
export const destinations: { group: string; items: Destination[] }[] = [
  {
    group: "Join",
    items: [
      { href: "/courses", label: "Courses", note: "Foundation, Target, Finisher", icon: "book" },
      { href: "/batches", label: "Batches", note: "Upcoming start dates", icon: "calendar" },
      { href: "/scholarship", label: "Scholarship", note: "Up to 100% off fees", icon: "seal" },
      { href: "/admissions", label: "Admissions", note: "How to join, step by step", icon: "steps" },
    ],
  },
  {
    group: "Proof",
    items: [
      { href: "/results", label: "Results", note: "CLAT 2026 ranks", icon: "trophy" },
      { href: "/reviews", label: "Reviews", note: "Students and parents", icon: "star" },
      { href: "/faculty", label: "Faculty", note: "Who teaches you", icon: "chalkboard" },
      { href: "/gallery", label: "Gallery", note: "Life at the centre", icon: "images" },
    ],
  },
  {
    group: "Prepare",
    items: [
      { href: "/resources", label: "Resources", note: "Everything free, in one place", icon: "stack" },
      { href: "/blog", label: "Blog", note: "Advice and exam updates", icon: "article" },
      { href: "/resources/current-affairs", label: "Current affairs", note: "Daily GK for CLAT", icon: "newspaper" },
      { href: "/resources/study-plan", label: "Study plans", note: "Month-by-month", icon: "path" },
      { href: "/tools/study-planner", label: "Study planner", note: "Your hours, your end date", icon: "timer" },
      { href: "/resources/toppers-strategy", label: "Topper strategies", note: "How they did it", icon: "lightbulb" },
      { href: "/resources/nlu-profiles", label: "NLU profiles", note: "Seats, fees, cut-offs", icon: "bank" },
      { href: "/how-to-apply", label: "How to apply", note: "CLAT form, step by step", icon: "clipboard" },
      { href: "/faq", label: "FAQs", note: "Quick answers", icon: "question" },
    ],
  },
  {
    group: "About",
    items: [
      { href: "/about", label: "About us", note: "LawPrep Tutorial Noida", icon: "info" },
      { href: "/visit", label: "Visit & contact", note: "Sector 62, Noida", icon: "pin" },
    ],
  },
];

const allDestinations = destinations.flatMap((g) => g.items);

export function whatsappLink(text: string) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function tabIndex(pathname: string) {
  const exact = tabs.findIndex((t) => isActivePath(pathname, t.href));
  // Screens without their own tab live under Explore.
  return exact === -1 ? tabs.length - 1 : exact;
}

/** Title for the compact top bar: the closest matching screen. */
export function screenTitle(pathname: string) {
  const match = [...allDestinations, ...tabs]
    .filter((d) => d.href !== "/" && isActivePath(pathname, d.href))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.label ?? null;
}

/** Tab roots show the logo; deeper screens get a back button. */
export function isRootScreen(pathname: string) {
  return tabs.some((t) => t.href === pathname);
}

export function parentPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  // /tools has no index screen of its own.
  if (parts.length <= 1 || parts[0] === "tools") {
    // Single-level screens without a tab of their own were reached from Explore.
    return "/explore";
  }
  return `/${parts.slice(0, -1).join("/")}`;
}
