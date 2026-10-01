const range = (count: number) => Array.from({ length: count }, (_, index) => index);

function CardSkeleton({ round = false }: { round?: boolean }) {
  return (
    <div className={round ? "flex flex-col items-center" : ""}>
      <div className={`aspect-square w-full skeleton ${round ? "rounded-full" : "rounded-md"}`} />
      <div className={`mt-3 h-3.5 skeleton rounded ${round ? "w-2/3" : "w-3/4"}`} />
      {!round && <div className="mt-2 h-3 w-1/2 skeleton rounded" />}
    </div>
  );
}

export function GridSkeleton({ count = 12, round = false }: { count?: number; round?: boolean }) {
  return (
    <div
      className={`grid gap-x-6 gap-y-8 ${
        round ? "grid-cols-[repeat(auto-fill,minmax(160px,1fr))]" : "grid-cols-[repeat(auto-fill,minmax(176px,1fr))]"
      }`}
    >
      {range(count).map((index) => (
        <CardSkeleton key={index} round={round} />
      ))}
    </div>
  );
}

export function RowSkeleton() {
  return (
    <section>
      <div className="mb-4 h-5 w-44 skeleton rounded" />
      <div className="flex gap-6 overflow-hidden">
        {range(8).map((index) => (
          <div key={index} className="w-44 shrink-0">
            <CardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}

export function HeaderSkeleton({ round = false }: { round?: boolean }) {
  return (
    <div className="flex items-end gap-8 px-8 pt-8 pb-10">
      <div className={`size-56 shrink-0 skeleton ${round ? "rounded-full" : "rounded-md"}`} />
      <div className="flex flex-1 flex-col gap-3 pb-1">
        <div className="h-3 w-16 skeleton rounded" />
        <div className="h-10 w-2/3 max-w-md skeleton rounded-md" />
        <div className="h-4 w-40 skeleton rounded" />
        <div className="h-3.5 w-56 skeleton rounded" />
        {!round && (
          <div className="mt-4 flex gap-3">
            <div className="h-10 w-28 skeleton rounded-full" />
            <div className="h-10 w-32 skeleton rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}

export function TrackListSkeleton({ count = 10, full = false }: { count?: number; full?: boolean }) {
  return (
    <div>
      <div className="h-9 border-b border-white/6" />
      <div className="mt-2 flex flex-col">
        {range(count).map((index) => (
          <div key={index} className={`flex items-center gap-4 px-3 ${full ? "h-14" : "h-12"}`}>
            <div className="w-10 shrink-0" />
            {full && <div className="size-10 shrink-0 skeleton rounded-sm" />}
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-3.5 skeleton rounded" style={{ width: `${30 + ((index * 17) % 35)}%` }} />
              {!full && <div className="h-3 w-24 skeleton rounded" />}
            </div>
            {full && <div className="h-3.5 w-1/6 skeleton rounded" />}
            {full && <div className="h-3.5 w-1/6 skeleton rounded" />}
            <div className="h-3 w-10 shrink-0 skeleton rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageTitle({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return (
    <div className="mb-8">
      {eyebrow && <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">{eyebrow}</p>}
      <h1 className="mt-1 text-4xl font-bold tracking-tight">{title}</h1>
    </div>
  );
}
