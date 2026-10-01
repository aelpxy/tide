import { useEffect, useRef } from "react";
import { usePlayer } from "../../stores/player";
import { SourceLink } from "../library/source-link";
import { PanelHeader } from "./panel-header";
import { QueueRow } from "./queue-row";
import { UpcomingRows } from "./upcoming-rows";

export function QueuePanel({ onClose }: { onClose: () => void }) {
  const queue = usePlayer((state) => state.queue);
  const index = usePlayer((state) => state.index);
  const queued = usePlayer((state) => state.queued);
  const source = usePlayer((state) => state.source);
  const clearUpcoming = usePlayer((state) => state.clearUpcoming);
  const list = useRef<HTMLDivElement>(null);
  const current = useRef<HTMLElement>(null);

  // scroll only the queue list; scrollIntoView would also scroll the app's overflow-hidden ancestors
  useEffect(() => {
    if (list.current && current.current) list.current.scrollTop = current.current.offsetTop - 8;
  }, []);

  const history = usePlayer((state) => state.history);
  const upcoming = queue.slice(index + 1);

  // stable keys so removing one row doesn't re-animate the rows after it
  const seen = new Map<string, number>();
  const upcomingKeys = upcoming.map((song) => {
    const count = seen.get(song.id) ?? 0;
    seen.set(song.id, count + 1);
    return `${song.id}-${count}`;
  });

  return (
    <>
      <PanelHeader title="Play queue" onClose={onClose} />

      <div ref={list} className="relative min-h-0 flex-1 overflow-y-auto px-2 pb-4">
        {history.length > 0 && (
          <section className="mt-2">
            <h3 className="px-3 pb-1 text-sm font-semibold">History</h3>
            {history.map((song, i) => (
              <QueueRow key={`${song.id}-${i}`} song={song} position={i} kind="history" />
            ))}
          </section>
        )}

        <section ref={current} className="mt-5">
          <div className="flex items-baseline justify-between gap-3 px-3 pb-1">
            <h3 className="min-w-0 truncate text-sm font-semibold">
              Playing from{source ? ": " : ""}
              {source && <SourceLink source={source} />}
            </h3>
            {upcoming.length > 0 && (
              <button
                type="button"
                onClick={clearUpcoming}
                className="shrink-0 text-[13px] text-neutral-400 transition-colors hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
          <QueueRow song={queue[index]} position={index} kind="current" />
        </section>

        {queued > 0 && (
          <section className="mt-5">
            <h3 className="px-3 pb-1 text-sm font-semibold">Next in queue</h3>
            <UpcomingRows songs={upcoming.slice(0, queued)} keys={upcomingKeys.slice(0, queued)} start={index + 1} />
          </section>
        )}

        <section className="mt-5">
          <h3 className="min-w-0 truncate px-3 pb-1 text-sm font-semibold">
            Next up{source ? " from: " : ""}
            {source && <SourceLink source={source} />}
          </h3>
          {upcoming.length === queued && (
            <p className="px-3 py-2 text-[13px] text-neutral-500">Nothing else up next.</p>
          )}
          <UpcomingRows songs={upcoming.slice(queued)} keys={upcomingKeys.slice(queued)} start={index + 1 + queued} />
        </section>
      </div>
    </>
  );
}
