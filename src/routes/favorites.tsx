import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { CollectionHeader } from "../components/library/collection-header";
import { AlbumRow } from "../components/library/album-row";
import { ArtistRow } from "../components/library/artist-row";
import { TrackList } from "../components/library/track-list";
import { EmptyState } from "../components/ui/empty-state";
import { GridSkeleton, PageTitle, TrackListSkeleton } from "../components/ui/skeletons";
import { mosaicIds } from "../lib/mosaic";
import { getStarred } from "../lib/subsonic";

export const Route = createFileRoute("/favorites")({
  loader: () => getStarred(),
  component: Favorites,
  pendingComponent: () => (
    <main className="flex flex-col gap-10 px-8 pt-4 pb-10">
      <PageTitle eyebrow="My Collection" title="Favorites" />
      <TrackListSkeleton count={8} full />
      <GridSkeleton count={6} />
    </main>
  ),
});

const viewAll = "text-xs font-semibold tracking-widest text-neutral-400 uppercase transition-colors hover:text-white";

function Favorites() {
  const { songs, albums, artists } = Route.useLoaderData();
  const source = { type: "favorites", name: "Favorites" } as const;
  const empty = !songs.length && !albums.length && !artists.length;

  return (
    <main className="pb-10">
      <CollectionHeader
        label="My Collection"
        title="Favorites"
        meta={[
          `${songs.length} ${songs.length === 1 ? "track" : "tracks"}`,
          `${albums.length} ${albums.length === 1 ? "album" : "albums"}`,
          `${artists.length} ${artists.length === 1 ? "artist" : "artists"}`,
        ].join(" · ")}
        coverArt={songs[0]?.coverArt ?? albums[0]?.coverArt}
        mosaic={mosaicIds([...songs, ...albums.map((album) => ({ albumId: album.id, coverArt: album.coverArt }))])}
        songs={songs}
        source={source}
      />

      <div className="flex flex-col gap-10 px-8">
        {empty && (
          <EmptyState
            icon={Heart}
            title="Nothing here yet"
            description="Tap the heart on any track, album or artist to save it here."
          />
        )}

        {songs.length > 0 && (
          <section>
            <h2 className="mb-2 text-xl font-bold tracking-tight">Tracks</h2>
            <TrackList songs={songs} full source={source} />
          </section>
        )}

        {albums.length > 0 && (
          <AlbumRow
            title="Albums"
            albums={albums}
            action={
              <Link to="/albums" search={{ filter: "favorites" }} className={viewAll}>
                View all
              </Link>
            }
          />
        )}

        {artists.length > 0 && (
          <ArtistRow
            title="Artists"
            artists={artists}
            action={
              <Link to="/artists" search={{ filter: "favorites" }} className={viewAll}>
                View all
              </Link>
            }
          />
        )}
      </div>
    </main>
  );
}
