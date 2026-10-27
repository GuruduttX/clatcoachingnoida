import Image from "next/image";

// next/image only optimises hosts allowed in next.config (Cloudinary and local
// files). Anything else an editor pastes falls back to a plain <img>.
function optimisable(src: string) {
  return src.startsWith("/") || /^https:\/\/res\.cloudinary\.com\//.test(src);
}

export function SmartImage({
  src,
  alt,
  sizes,
  priority,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (optimisable(src)) {
    return <Image src={src} alt={alt} fill sizes={sizes} loading={priority ? "eager" : undefined} fetchPriority={priority ? "high" : undefined} className={className} />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} className={`absolute inset-0 size-full ${className}`} />;
}
