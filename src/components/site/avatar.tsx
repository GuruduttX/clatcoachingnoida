import Image from "next/image";

// Faculty without a confirmed photo use an SVG placeholder on the Delhi site; show initials instead.
export function hasPhoto(src?: string) {
  return Boolean(src) && !src!.includes("placeholder");
}

export function initials(name: string) {
  return name
    .replace(/\b(Sir|Ma'am)\b/g, "")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function PersonPhoto({
  src,
  name,
  sizes,
  className = "",
  eager,
}: {
  src?: string;
  name: string;
  sizes: string;
  className?: string;
  /** Above-the-fold photo: load immediately at high priority. */
  eager?: boolean;
}) {
  if (!hasPhoto(src)) {
    return (
      <span aria-hidden className={`grid h-full w-full place-items-center bg-sun font-display text-[2.2em] font-extrabold text-ink ${className}`}>
        {initials(name)}
      </span>
    );
  }
  return <Image src={src!} alt="" fill sizes={sizes} loading={eager ? "eager" : undefined} fetchPriority={eager ? "high" : undefined} className={`object-cover object-top ${className}`} />;
}
