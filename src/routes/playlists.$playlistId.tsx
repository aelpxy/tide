import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { ListMusic, ListX, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { CollectionHeader } from "../components/library/collection-header";
import { EmptyState } from "../components/ui/empty-state";
import { HeaderSkeleton, TrackListSkeleton } from "../components/ui/skeletons";
import { TrackList } from "../components/library/track-list";
import { ConfirmDialog } from "../components/ui/confirm-dialog";
import { NameDialog } from "../components/ui/name-dialog";
import { formatTotal } from "../lib/format";
import { deletePlaylist, getPlaylist, setPlaylistSongs, updatePlaylist, useServer, type Song } from "../lib/subsonic";
import { button } from "../lib/ui";
import { refreshPlaylists } from "../stores/playlists";
import { toast } from "../stores/toast";

export const Route = createFileRoute("/playlists/$playlistId")({
  loader: ({ params }) => getPlaylist(params.playlistId),
  component: PlaylistPage,
  pendingComponent: () => (
    <main className="pb-10">
      <HeaderSkeleton />
      <div className="px-8">
        <TrackListSkeleton full />
      </div>
    </main>
  ),
});

function PlaylistPage() {
  const playlist = Route.useLoaderData();
  const router = useRouter();
  const navigate = useNavigate();
  const username = useServer((state) => state.server?.username);
  const [renaming, setRenaming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const songs = playlist.entry ?? [];
  const source = { type: "playlist", id: playlist.id, name: playlist.name } as const;
  const editable = !playlist.owner || playlist.owner === username;

  const reload = async () => {
    await refreshPlaylists();
    await router.invalidate();
  };

  const rename = async (name: string) => {
    await updatePlaylist(playlist.id, { name });
    await reload();
  };

  const remove = async () => {
    await deletePlaylist(playlist.id);
    toast(`Deleted ${playlist.name}`);
    await navigate({ to: "/playlists" });
    await reload();
  };

  const reorder = async (next: Song[]) => {
    try {
      await setPlaylistSongs(
        playlist.id,
        next.map((song) => song.id),
      );
      await reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't save the new order");
      throw err;
    }
  };

  const removeTrack = async (index: number) => {
    await updatePlaylist(playlist.id, { songIndexToRemove: [index] });
    toast(`Removed from ${playlist.name}`);
    await reload();
  };

  return (
    <main className="pb-10">
      <CollectionHeader
        label="Playlist"
        coverArt={playlist.coverArt}
        title={playlist.name}
        subtitle={playlist.owner && `By ${playlist.owner}`}
        meta={`${playlist.songCount} ${playlist.songCount === 1 ? "track" : "tracks"} · ${formatTotal(playlist.duration)}`}
        songs={songs}
        source={source}
        actions={
          editable && (
            <>
              <button
                type="button"
                aria-label="Rename playlist"
                onClick={() => setRenaming(true)}
                className={button.icon}
              >
                <Pencil className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Delete playlist"
                onClick={() => setDeleting(true)}
                className={button.icon}
              >
                <Trash2 className="size-4" />
              </button>
            </>
          )
        }
      />
      <div className="px-8">
        {songs.length ? (
          <TrackList
            songs={songs}
            full
            source={source}
            onReorder={editable ? reorder : undefined}
            menuExtra={
              editable
                ? (index) => [
                    {
                      label: "Remove from playlist",
                      icon: ListX,
                      onSelect: () => void removeTrack(index).catch((err: Error) => toast(err.message)),
                    },
                  ]
                : undefined
            }
          />
        ) : (
          <EmptyState
            icon={ListMusic}
            title="This playlist is empty"
            description="Right-click any track or album and choose “Add to playlist”."
          />
        )}
      </div>

      <NameDialog
        key={`rename-${playlist.name}`}
        open={renaming}
        onOpenChange={setRenaming}
        title="Rename playlist"
        confirmLabel="Save"
        initialName={playlist.name}
        onSubmit={rename}
      />
      <ConfirmDialog
        open={deleting}
        onOpenChange={setDeleting}
        title={`Delete “${playlist.name}”?`}
        description="This removes the playlist from your server. The songs stay in your library."
        confirmLabel="Delete"
        onConfirm={remove}
      />
    </main>
  );
}
