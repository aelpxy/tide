import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import { goTo } from "../../hooks/use-menu-entries";
import { toggleNowPlaying, useNowPlaying } from "../../stores/now-playing";
import { useCurrentSong } from "../../stores/player";
import { ContextMenu } from "../menus/context-menu";
import { CoverArt } from "../library/cover-art";
import { HeartButton } from "../library/heart-button";

export function NowPlayingInfo() {
  const song = useCurrentSong();
  const navigate = useNavigate();
  const open = useNowPlaying((state) => state.open);
  if (!song) return <div />;

  const Chevron = open ? ChevronDown : ChevronUp;

  return (
    <ContextMenu entries={goTo(song, navigate).slice(1)}>
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label={open ? "Close now playing" : "Open now playing"}
          onClick={toggleNowPlaying}
          className="group/art relative size-14 shrink-0 overflow-hidden rounded-md transition-[scale] duration-150 ease-out active:scale-95"
        >
          <CoverArt id={song.coverArt} size={112} className="size-full" />
          <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-150 group-hover/art:opacity-100">
            <Chevron className="size-5 text-white" />
          </span>
        </button>
        <div className="min-w-0">
          {song.albumId ? (
            <Link
              to="/albums/$albumId"
              params={{ albumId: song.albumId }}
              className="block truncate text-sm font-medium hover:underline"
            >
              {song.title}
            </Link>
          ) : (
            <p className="truncate text-sm font-medium">{song.title}</p>
          )}
          {song.albumId ? (
            <Link
              to="/albums/$albumId"
              params={{ albumId: song.albumId }}
              className="block truncate text-xs text-neutral-400 hover:text-white hover:underline"
            >
              {song.album}
            </Link>
          ) : (
            <p className="truncate text-xs text-neutral-400">{song.album}</p>
          )}
          {song.artistId ? (
            <Link
              to="/artists/$artistId"
              params={{ artistId: song.artistId }}
              className="block truncate text-xs text-neutral-400 hover:text-white hover:underline"
            >
              {song.artist}
            </Link>
          ) : (
            <p className="truncate text-xs text-neutral-400">{song.artist}</p>
          )}
        </div>
        <HeartButton type="song" id={song.id} starred={song.starred} className="ml-2 shrink-0" iconClassName="size-5" />
      </div>
    </ContextMenu>
  );
}
