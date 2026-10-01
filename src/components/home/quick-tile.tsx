import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { playAlbum } from "../../lib/playback";
import type { Album } from "../../lib/subsonic";
import { CoverArt } from "../library/cover-art";

export function QuickTile({ album }: { album: Album }) {
  return (
    <Link
      to="/albums/$albumId"
      params={{ albumId: album.id }}
      className="group flex h-16 items-center gap-4 overflow-hidden rounded-md bg-white/6 pr-3 transition-colors duration-150 hover:bg-white/12"
    >
      <CoverArt id={album.coverArt} size={128} className="size-16 shrink-0" />
      <span className="min-w-0 flex-1 truncate text-sm font-semibold">{album.name}</span>
      <button
        type="button"
        aria-label={`Play ${album.name}`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void playAlbum(album);
        }}
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-black opacity-0 shadow-lg transition-[opacity,scale] duration-150 ease-out group-hover:opacity-100 hover:scale-105 focus-visible:opacity-100 active:scale-95"
      >
        <Play className="size-4 translate-x-px fill-current" />
      </button>
    </Link>
  );
}
