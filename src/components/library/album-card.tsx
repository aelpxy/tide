import { Link, useNavigate } from "@tanstack/react-router";
import { MicVocal, Play } from "lucide-react";
import { useCollectionEntries } from "../../hooks/use-menu-entries";
import { albumSource, getAlbumSongs, playAlbum } from "../../lib/playback";
import type { Album } from "../../lib/subsonic";
import { cardImage } from "../../lib/ui";
import { ContextMenu } from "../menus/context-menu";
import { CoverArt } from "./cover-art";

export function AlbumCard({ album }: { album: Album }) {
  const navigate = useNavigate();
  const artistId = album.artistId;
  const entries = useCollectionEntries(() => getAlbumSongs(album.id), {
    extra: artistId
      ? [
          {
            label: "Go to artist",
            icon: MicVocal,
            onSelect: () => navigate({ to: "/artists/$artistId", params: { artistId } }),
          },
        ]
      : [],
    favorite: { type: "album", id: album.id, starred: album.starred },
    source: albumSource(album),
  });

  return (
    <ContextMenu entries={entries}>
      <div className="group min-w-0">
        <div className="relative overflow-hidden rounded-md">
          <Link to="/albums/$albumId" params={{ albumId: album.id }} data-result>
            <CoverArt id={album.coverArt} className={`aspect-square w-full ${cardImage}`} />
            <span className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />
          </Link>
          <button
            type="button"
            aria-label={`Play ${album.name}`}
            onClick={() => void playAlbum(album)}
            className="absolute right-3 bottom-3 flex size-11 translate-y-2 items-center justify-center rounded-full bg-white text-black opacity-0 shadow-lg transition-[opacity,translate,scale] duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
          >
            <Play className="size-4 translate-x-px fill-current" />
          </button>
        </div>
        <Link
          to="/albums/$albumId"
          params={{ albumId: album.id }}
          className="mt-3 block truncate text-sm font-medium hover:underline"
        >
          {album.name}
        </Link>
        {album.artistId ? (
          <Link
            to="/artists/$artistId"
            params={{ artistId: album.artistId }}
            className="block truncate text-[13px] text-neutral-400 transition-colors hover:text-white"
          >
            {album.artist}
          </Link>
        ) : (
          <p className="truncate text-[13px] text-neutral-400">{album.artist}</p>
        )}
      </div>
    </ContextMenu>
  );
}
