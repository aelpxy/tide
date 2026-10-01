import { createFileRoute, Link } from "@tanstack/react-router";
import { CollectionHeader } from "../components/library/collection-header";
import { HeartButton } from "../components/library/heart-button";
import { AlbumRow } from "../components/library/album-row";
import { TrackList } from "../components/library/track-list";
import { HeaderSkeleton, TrackListSkeleton } from "../components/ui/skeletons";
import { formatTotal } from "../lib/format";
import { getAlbum, getArtist } from "../lib/subsonic";

export const Route = createFileRoute("/albums/$albumId")({
  loader: async ({ params }) => {
    const album = await getAlbum(params.albumId);
    const artist = album.artistId ? await getArtist(album.artistId).catch(() => null) : null;
    const moreByArtist = (artist?.album ?? []).filter((other) => other.id !== album.id);
    return { album, moreByArtist };
  },
  component: AlbumPage,
  pendingComponent: () => (
    <main className="pb-10">
      <HeaderSkeleton />
      <div className="px-8">
        <TrackListSkeleton />
      </div>
    </main>
  ),
});

function AlbumPage() {
  const { album, moreByArtist } = Route.useLoaderData();
  const songs = album.song ?? [];
  const source = { type: "album", id: album.id, name: album.name } as const;

  return (
    <main className="pb-10">
      <CollectionHeader
        label="Album"
        coverArt={album.coverArt}
        title={album.name}
        subtitle={
          album.artistId ? (
            <Link to="/artists/$artistId" params={{ artistId: album.artistId }} className="hover:underline">
              {album.artist}
            </Link>
          ) : (
            album.artist
          )
        }
        meta={[
          album.year,
          album.genre,
          `${album.songCount} ${album.songCount === 1 ? "track" : "tracks"}`,
          formatTotal(album.duration),
        ]
          .filter(Boolean)
          .join(" · ")}
        songs={songs}
        source={source}
        actions={<HeartButton type="album" id={album.id} starred={album.starred} circle iconClassName="size-5" />}
      />
      <div className="flex flex-col gap-12 px-8">
        <TrackList songs={songs} source={source} />
        {moreByArtist.length > 0 && <AlbumRow title={`More by ${album.artist}`} albums={moreByArtist} />}
      </div>
    </main>
  );
}
