import { ListX, X } from "lucide-react";
import { useSongEntries } from "../../hooks/use-menu-entries";
import type { Song } from "../../lib/subsonic";
import { usePlayer } from "../../stores/player";
import { ContextMenu } from "../menus/context-menu";
import { CoverArt } from "../library/cover-art";
import { PlayingBars } from "../player/playing-bars";

export function QueueRow({
  song,
  position,
  kind,
}: {
  song: Song;
  position: number;
  kind: "history" | "current" | "upcoming";
}) {
  const { jumpTo, playFromHistory, removeFromQueue, toggle } = usePlayer.getState();
  const play =
    kind === "current" ? toggle : kind === "history" ? () => playFromHistory(position) : () => jumpTo(position);
  // built from this row's song, not the live queue: rows animating out are no longer in it
  const entries = useSongEntries([song], 0, {
    onPlay: play,
    extra:
      kind === "upcoming"
        ? [{ label: "Remove from queue", icon: ListX, onSelect: () => removeFromQueue(position) }]
        : [],
  });

  return (
    <ContextMenu entries={entries}>
      <div
        role="button"
        tabIndex={0}
        onClick={play}
        onKeyDown={(event) => event.key === "Enter" && play()}
        className={`group flex h-16 items-center gap-3 rounded-md px-3 transition-colors hover:bg-white/6 focus-visible:bg-white/8 focus-visible:outline-none data-popup-open:bg-white/8 ${
          kind === "history" ? "opacity-50 hover:opacity-100" : ""
        }`}
      >
        <div className="relative size-12 shrink-0 overflow-hidden rounded-sm">
          <CoverArt id={song.coverArt} size={96} className="size-full" />
          {kind === "current" && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/40">
              <PlayingBars className="h-4 text-icon" />
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className={`truncate text-sm font-medium ${kind === "current" ? "text-icon" : ""}`}>{song.title}</p>
          <p className="truncate text-[13px] text-neutral-400">{song.artist}</p>
        </div>
        {kind === "upcoming" && (
          <button
            type="button"
            aria-label={`Remove ${song.title} from queue`}
            onClick={(event) => {
              event.stopPropagation();
              removeFromQueue(position);
            }}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-[color,background-color,scale] duration-150 ease-out hover:bg-white/10 hover:text-white active:scale-90"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </ContextMenu>
  );
}
