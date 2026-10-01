import { createFileRoute, Link } from "@tanstack/react-router";
import { QuickTile } from "../components/home/quick-tile";
import { AlbumRow } from "../components/library/album-row";
import { RowSkeleton } from "../components/ui/skeletons";
import { useRecentlyPlayed } from "../hooks/use-recently-played";
import { greeting } from "../lib/greeting";
import { getAlbumList } from "../lib/subsonic";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [recentlyPlayed, recentlyAdded, mostPlayed, random] = await Promise.all([
      getAlbumList("recent", 18),
      getAlbumList("newest", 18),
      getAlbumList("frequent", 18),
      getAlbumList("random", 18),
    ]);
    return { recentlyPlayed, recentlyAdded, mostPlayed, random };
  },
  // recently and most played change as you listen, so always refetch
  staleTime: 0,
  component: Home,
  pendingComponent: () => (
    <main className="flex flex-col gap-10 px-8 pt-4 pb-10">
      <h1 className="text-4xl font-bold tracking-tight">Home</h1>
      <RowSkeleton />
      <RowSkeleton />
      <RowSkeleton />
    </main>
  ),
});

const QUICK_TILES = 6;

function Home() {
  const { recentlyPlayed: serverRecent, recentlyAdded, mostPlayed, random } = Route.useLoaderData();
  const recentlyPlayed = useRecentlyPlayed(serverRecent);
  const tiles = recentlyPlayed.slice(0, QUICK_TILES);
  const moreRecent = recentlyPlayed.slice(QUICK_TILES);

  return (
    <main className="flex flex-col gap-10 px-8 pt-4 pb-10">
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold tracking-tight">{greeting()}</h1>
        {tiles.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
            {tiles.map((album) => (
              <QuickTile key={album.id} album={album} />
            ))}
          </div>
        )}
      </div>
      {moreRecent.length > 0 && <AlbumRow title="Recently played" albums={moreRecent} />}
      <AlbumRow
        title="Recently added"
        albums={recentlyAdded}
        action={
          <Link
            to="/albums"
            className="text-xs font-semibold tracking-widest text-neutral-400 uppercase hover:text-white"
          >
            View all
          </Link>
        }
      />
      {mostPlayed.length > 0 && <AlbumRow title="Most played" albums={mostPlayed} />}
      {random.length > 0 && <AlbumRow title="Rediscover" albums={random} />}
    </main>
  );
}
