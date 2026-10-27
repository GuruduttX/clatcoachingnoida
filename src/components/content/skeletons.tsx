// Placeholders shown while a detail screen streams in.
export function ArticleSkeleton() {
  return (
    <div aria-busy className="mx-auto max-w-3xl animate-pulse px-4 pt-3 pb-16 md:px-6 md:pt-12">
      <div className="h-4 w-28 rounded-full bg-mist" />
      <div className="mt-3 h-10 w-full rounded-2xl bg-mist" />
      <div className="mt-2 h-10 w-2/3 rounded-2xl bg-mist" />
      <div className="mt-6 aspect-[16/9] w-full rounded-[28px] bg-mist" />
      <div className="mt-6 h-28 w-full rounded-[24px] bg-mist" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-4 rounded-full bg-mist" style={{ width: `${92 - (i % 3) * 14}%` }} />
        ))}
      </div>
    </div>
  );
}
