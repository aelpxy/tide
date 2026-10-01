import { createFileRoute } from "@tanstack/react-router";
import { ArtistAbout } from "../components/artist/artist-about";
import { AlbumGrid } from "../components/library/album-grid";
import { ArtistRow } from "../components/library/artist-row";
import { CollectionHeader } from "../components/library/collection-header";
import { HeartButton } from "../components/library/heart-button";
import { TrackList } from "../components/library/track-list";
import { GridSkeleton, HeaderSkeleton } from "../components/ui/skeletons";
import { plainText } from "../lib/html";
import { getArtist, getArtistInfo, getTopSongs } from "../lib/subsonic";

export const Route = createFileRoute("/artists/$artistId")({
  loader: async ({ params }) => {
    const artist = await getArtist(params.artistId);
    const [info, topSongs] = await Promise.all([
      getArtistInfo(artist.id).catch(() => null),
      getTopSongs(artist.name).catch(() => []),
    ]);
    return { artist, info, topSongs };
  },
  component: ArtistPage,
  pendingComponent: () => (
    <main className="pb-10">
      <HeaderSkeleton round />
      <section className="px-8">
        <div className="mb-4 h-5 w-24 skeleton rounded" />
        <GridSkeleton count={6} />
      </section>
    </main>
  ),
});

function ArtistPage() {
  const { artist, info, topSongs } = Route.useLoaderData();
  const albums = artist.album ?? [];
  const source = { type: "artist", id: artist.id, name: artist.name } as const;
  const bio = info?.biography ? plainText(info.biography) : "";
  const similar = info?.similarArtist?.filter((similarArtist) => similarArtist.id) ?? [];

  return (
    <main className="pb-10">
      <CollectionHeader
        label="Artist"
        coverArt={artist.coverArt}
        title={artist.name}
        meta={`${albums.length} ${albums.length === 1 ? "album" : "albums"}`}
        songs={topSongs.length ? topSongs : undefined}
        source={source}
        round
        actions={<HeartButton type="artist" id={artist.id} starred={artist.starred} circle iconClassName="size-5" />}
      />

      <div className="flex flex-col gap-10 px-8">
        {topSongs.length > 0 && (
          <section>
            <h2 className="mb-2 text-xl font-bold tracking-tight">Popular</h2>
            <TrackList songs={topSongs.slice(0, 5)} full source={source} />
          </section>
        )}

        <section>
          <h2 className="mb-4 text-xl font-bold tracking-tight">Albums</h2>
          <AlbumGrid albums={albums} />
        </section>

        {bio && <ArtistAbout text={bio} />}

        {similar.length > 0 && <ArtistRow title="Similar artists" artists={similar} />}
      </div>
    </main>
  );
}
