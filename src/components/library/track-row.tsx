import { Link } from "@tanstack/react-router";
import { Pause, Play } from "lucide-react";
import { type ReactNode } from "react";
import { useSongEntries } from "../../hooks/use-menu-entries";
import { formatDuration } from "../../lib/format";
import type { Song } from "../../lib/subsonic";
import { useIsFavorite } from "../../stores/favorites";
import { useCurrentSong, usePlayer, type Source } from "../../stores/player";
import { ContextMenu, type MenuEntry } from "../menus/context-menu";
import { PlayingBars } from "../player/playing-bars";
import { CoverArt } from "./cover-art";
import { HeartButton } from "./heart-button";

const cellLink = "truncate text-neutral-400 hover:text-white hover:underline";

export function TrackRow({
  songs,
  index,
  full,
  columns,
  extra,
  source,
  handle,
}: {
  songs: Song[];
  index: number;
  full: boolean;
  columns: string;
  extra?: MenuEntry[];
  source?: Source;
  handle?: ReactNode;
}) {
  const play = usePlayer((state) => state.play);
  const toggle = usePlayer((state) => state.toggle);
  const playing = usePlayer((state) => state.playing);
  const current = useCurrentSong();
  const entries = useSongEntries(songs, index, { extra, source });
  const song = songs[index];
  const active = current?.id === song.id;
  const favorite = useIsFavorite("song", song.id, song.starred);

  return (
    <ContextMenu entries={entries}>
      <div
        role="button"
        tabIndex={0}
        data-result
        onClick={() => play(songs, index, source)}
        onKeyDown={(event) => event.key === "Enter" && play(songs, index, source)}
        className={`group grid ${columns} ${full ? "h-14" : "h-12"} items-center gap-4 rounded-md px-3 text-sm transition-colors hover:bg-white/5 focus-visible:bg-white/8 focus-visible:outline-none data-popup-open:bg-white/8`}
      >
        <span className="flex justify-end font-mono text-xs text-neutral-500 tabular-nums">
          <span className="group-hover:hidden">
            {active ? <PlayingBars className="h-3.5 text-icon" /> : full ? index + 1 : (song.track ?? index + 1)}
          </span>
          {handle ? (
            <span className="hidden group-hover:flex">{handle}</span>
          ) : (
            <button
              type="button"
              aria-label={active && playing ? "Pause" : `Play ${song.title}`}
              onClick={(event) => {
                event.stopPropagation();
                if (active) toggle();
                else play(songs, index, source);
              }}
              className="hidden text-white transition-[scale] duration-150 ease-out group-hover:flex active:scale-90"
            >
              {active && playing ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
            </button>
          )}
        </span>

        <div className="flex min-w-0 items-center gap-3">
          {full && <CoverArt id={song.coverArt} size={80} className="size-10 shrink-0 rounded-sm" />}
          <div className="min-w-0">
            <p className={`truncate font-medium ${active ? "text-icon" : "text-white"}`}>{song.title}</p>
            {!full && <p className="truncate text-xs text-neutral-400">{song.artist}</p>}
          </div>
        </div>

        {full &&
          (song.artistId ? (
            <Link
              to="/artists/$artistId"
              params={{ artistId: song.artistId }}
              onClick={(event) => event.stopPropagation()}
              className={cellLink}
            >
              {song.artist}
            </Link>
          ) : (
            <span className="truncate text-neutral-400">{song.artist}</span>
          ))}
        {full &&
          (song.albumId ? (
            <Link
              to="/albums/$albumId"
              params={{ albumId: song.albumId }}
              onClick={(event) => event.stopPropagation()}
              className={cellLink}
            >
              {song.album}
            </Link>
          ) : (
            <span className="truncate text-neutral-400">{song.album}</span>
          ))}

        <HeartButton
          type="song"
          id={song.id}
          starred={song.starred}
          className={favorite ? "" : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"}
        />

        <span className="text-right font-mono text-xs text-neutral-400 tabular-nums">
          {formatDuration(song.duration)}
        </span>
      </div>
    </ContextMenu>
  );
}
