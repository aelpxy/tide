import { createFileRoute } from "@tanstack/react-router";
import { ListMusic, Plus } from "lucide-react";
import { PlaylistCard } from "../components/playlists/playlist-card";
import { EmptyState } from "../components/ui/empty-state";
import { GridSkeleton, PageTitle } from "../components/ui/skeletons";
import { getPlaylists } from "../lib/subsonic";
import { button } from "../lib/ui";
import { openNewPlaylist } from "../stores/playlists";

export const Route = createFileRoute("/playlists/")({
  loader: () => getPlaylists(),
  component: Playlists,
  pendingComponent: () => (
    <main className="px-8 pt-4 pb-10">
      <PageTitle eyebrow="My Collection" title="Playlists" />
      <GridSkeleton />
    </main>
  ),
});

function Playlists() {
  const playlists = Route.useLoaderData();

  return (
    <main className="px-8 pt-4 pb-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">My Collection</p>
          <h1 className="mt-1 text-4xl font-bold tracking-tight">Playlists</h1>
        </div>
        <button type="button" onClick={() => openNewPlaylist()} className={button.primary}>
          <Plus className="size-4" />
          New playlist
        </button>
      </div>
      {playlists.length === 0 && (
        <EmptyState
          icon={ListMusic}
          title="No playlists yet"
          description="Create a playlist, then add songs from any right-click menu."
          action={
            <button type="button" onClick={() => openNewPlaylist()} className={button.primary}>
              <Plus className="size-4" />
              New playlist
            </button>
          }
        />
      )}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(176px,1fr))] gap-x-6 gap-y-8">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </main>
  );
}
