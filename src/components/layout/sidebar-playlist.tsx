import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useCollectionEntries } from "../../hooks/use-menu-entries";
import { spring } from "../../lib/motion";
import { getPlaylist, type Playlist } from "../../lib/subsonic";
import { ContextMenu } from "../menus/context-menu";
import { CoverArt } from "../library/cover-art";

export function SidebarPlaylist({ playlist, active }: { playlist: Playlist; active: boolean }) {
  const entries = useCollectionEntries(() => getPlaylist(playlist.id).then((p) => p.entry ?? []), {
    source: { type: "playlist", id: playlist.id, name: playlist.name },
  });

  return (
    <ContextMenu entries={entries}>
      <Link
        to="/playlists/$playlistId"
        params={{ playlistId: playlist.id }}
        className={`relative flex h-10 items-center gap-3 rounded-md px-2 text-sm transition-colors data-popup-open:bg-white/6 ${
          active ? "text-white" : "text-neutral-400 hover:text-white"
        }`}
      >
        {active && (
          <motion.span
            layoutId="sidebar-active"
            className="absolute inset-0 rounded-md bg-white/8"
            transition={spring}
          />
        )}
        <CoverArt id={playlist.coverArt} size={64} className="relative size-7 shrink-0 rounded" />
        <span className="relative truncate">{playlist.name}</span>
      </Link>
    </ContextMenu>
  );
}
