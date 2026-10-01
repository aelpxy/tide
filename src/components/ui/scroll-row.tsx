import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ScrollRow({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  const measure = () => {
    const element = track.current;
    if (!element) return;
    setEdges({
      start: element.scrollLeft <= 1,
      end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 1,
    });
  };

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (track.current) observer.observe(track.current);
    return () => observer.disconnect();
  }, []);

  const scroll = (direction: 1 | -1) =>
    track.current?.scrollBy({ left: direction * track.current.clientWidth * 0.8, behavior: "smooth" });

  const arrow =
    "flex size-8 items-center justify-center rounded-full bg-white/8 text-neutral-300 transition-[color,background-color,opacity,scale] duration-150 ease-out hover:bg-white/14 hover:text-white active:scale-90 disabled:pointer-events-none disabled:opacity-30";

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="truncate text-xl font-bold tracking-tight">{title}</h2>
        <div className="flex shrink-0 items-center gap-3">
          {action}
          {!(edges.start && edges.end) && (
            <div className="flex gap-1.5">
              <button
                type="button"
                aria-label="Scroll left"
                disabled={edges.start}
                onClick={() => scroll(-1)}
                className={arrow}
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Scroll right"
                disabled={edges.end}
                onClick={() => scroll(1)}
                className={arrow}
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div ref={track} onScroll={measure} className="-mx-8 -my-1 scrollbar-none flex gap-6 overflow-x-auto px-8 py-1">
        {children}
      </div>
    </section>
  );
}
