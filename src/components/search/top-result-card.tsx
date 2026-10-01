import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { playAlbum } from "../../lib/playback";
import { TopResult } from "../../lib/top-result";
import { usePlayer, type Source } from "../../stores/player";
import { CoverArt } from "../library/cover-art";

export function TopResultCard({ result, source }: { result: TopResult; source: Source }) {
  const play = usePlayer((state) => state.play);

  const card =
    "group relative flex h-56 flex-col justify-end gap-4 rounded-lg bg-surface p-5 ring-1 ring-white/6 transition-colors duration-150 hover:bg-elevated focus-visible:bg-elevated";
  const playButton = (onPlay: () => void) => (
    <button
      type="button"
      aria-label="Play"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onPlay();
      }}
      className="absolute right-5 bottom-5 flex size-12 translate-y-2 items-center justify-center rounded-full bg-white text-black opacity-0 shadow-lg transition-[opacity,translate,scale] duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
    >
      <Play className="size-5 translate-x-px fill-current" />
    </button>
  );

  if (result.kind === "artist") {
    const { artist } = result;
    return (
      <Link to="/artists/$artistId" params={{ artistId: artist.id }} data-result className={card}>
        <CoverArt id={artist.coverArt} size={200} className="size-24 rounded-full shadow-lg" />
        <div>
          <p className="truncate text-3xl font-bold tracking-tight">{artist.name}</p>
          <p className="mt-1 text-sm text-neutral-400">Artist</p>
        </div>
      </Link>
    );
  }

  if (result.kind === "album") {
    const { album } = result;
    return (
      <Link to="/albums/$albumId" params={{ albumId: album.id }} data-result className={card}>
        <CoverArt id={album.coverArt} size={200} className="size-24 rounded-md shadow-lg" />
        <div className="min-w-0 pr-16">
          <p className="truncate text-3xl font-bold tracking-tight">{album.name}</p>
          <p className="mt-1 truncate text-sm text-neutral-400">Album · {album.artist}</p>
        </div>
        {playButton(() => void playAlbum(album))}
      </Link>
    );
  }

  const { song } = result;
  return (
    <div
      role="button"
      tabIndex={0}
      data-result
      onClick={() => play([song], 0, source)}
      onKeyDown={(event) => event.key === "Enter" && play([song], 0, source)}
      className={card}
    >
      <CoverArt id={song.coverArt} size={200} className="size-24 rounded-md shadow-lg" />
      <div className="min-w-0 pr-16">
        <p className="truncate text-3xl font-bold tracking-tight">{song.title}</p>
        <p className="mt-1 truncate text-sm text-neutral-400">Song · {song.artist}</p>
      </div>
      {playButton(() => play([song], 0, source))}
    </div>
  );
}
