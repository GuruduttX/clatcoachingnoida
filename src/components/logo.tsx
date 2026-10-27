import Image from "next/image";

export function Logo({ className = "h-9" }: { className?: string }) {
  return (
    <Image
      src="/images/brand/logo.webp"
      alt="Law Prep Tutorial"
      width={863}
      height={407}
      loading="eager"
      className={`w-auto rounded-[6px] ${className}`}
    />
  );
}
