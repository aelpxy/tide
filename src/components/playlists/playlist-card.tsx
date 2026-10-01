import { Link } from "@tanstack/react-router";
import { useCollectionEntries } from "../../hooks/use-menu-entries";
import { getPlaylist, type Playlist } from "../../lib/subsonic";
import { cardImage } from "../../lib/ui";
import { CoverArt } from "../library/cover-art";
import { ContextMenu } from "../menus/context-menu";

export function PlaylistCard({ playlist }: { playlist: Playlist }) {
  const entries = useCollectionEntries(() => getPlaylist(playlist.id).then((p) => p.entry ?? []), {
    source: { type: "playlist", id: playlist.id, name: playlist.name },
  });

  return (
    <ContextMenu entries={entries}>
      <Link to="/playlists/$playlistId" params={{ playlistId: playlist.id }} className="group min-w-0">
        <div className="overflow-hidden rounded-md">
          <CoverArt id={playlist.coverArt} className={`aspect-square w-full ${cardImage}`} />
        </div>
        <p className="mt-3 truncate text-sm font-medium group-hover:underline">{playlist.name}</p>
        <p className="truncate text-[13px] text-neutral-400">
          {playlist.songCount} {playlist.songCount === 1 ? "track" : "tracks"}
        </p>
      </Link>
    </ContextMenu>
  );
}
