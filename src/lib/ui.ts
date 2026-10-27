const base =
  "inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold transition-[transform,background-color,border-color,color,box-shadow] duration-150 ease-out active:scale-[0.96]";

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-7 text-base",
};

const variants = {
  primary: "bg-brand text-white shadow-brand hover:bg-brand-deep",
  ink: "bg-ink text-white hover:bg-black",
  outline: "border border-line-strong bg-paper text-ink hover:border-ink",
  quiet: "bg-mist text-ink hover:bg-fog",
  white: "bg-paper text-ink hover:bg-mist",
};

export function button(
  variant: keyof typeof variants = "primary",
  size: keyof typeof sizes = "md",
) {
  return `${base} ${sizes[size]} ${variants[variant]}`;
}
