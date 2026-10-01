import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shuffle } from "lucide-react";
import { AlbumGrid } from "../components/library/album-grid";
import { GridSkeleton } from "../components/ui/skeletons";
import { genreColor } from "../lib/genres";
import { getAlbumsByGenre, getSongsByGenre } from "../lib/subsonic";
import { button } from "../lib/ui";
import { usePlayer } from "../stores/player";

export const Route = createFileRoute("/genres/$genre")({
  loader: ({ params }) => getAlbumsByGenre(params.genre),
  component: GenrePage,
  pendingComponent: () => (
    <main className="pb-10">
      <div className="px-8 pt-8 pb-10">
        <div className="h-3 w-16 skeleton rounded" />
        <div className="mt-3 h-12 w-72 skeleton rounded-md" />
      </div>
      <div className="px-8">
        <GridSkeleton />
      </div>
    </main>
  ),
});

function GenrePage() {
  const albums = Route.useLoaderData();
  const { genre } = Route.useParams();
  const shuffle = usePlayer((state) => state.shuffle);
  const [loading, setLoading] = useState(false);

  const shufflePlay = async () => {
    setLoading(true);
    try {
      const songs = await getSongsByGenre(genre);
      if (songs.length) shuffle(songs, { type: "genre", genre, name: genre });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pb-10">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundColor: genreColor(genre) }} />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black" />
        <div className="relative px-8 pt-10 pb-10">
          <p className="text-xs font-semibold tracking-widest text-neutral-300 uppercase">Genre</p>
          <h1 className="mt-2 text-5xl font-bold tracking-tight">{genre}</h1>
          <p className="mt-2 text-sm text-neutral-300">
            {albums.length} {albums.length === 1 ? "album" : "albums"}
          </p>
          <button
            type="button"
            disabled={loading}
            onClick={() => void shufflePlay()}
            className={`${button.primary} mt-6`}
          >
            <Shuffle className="size-4" />
            {loading ? "Loading…" : "Shuffle play"}
          </button>
        </div>
      </header>
      <div className="px-8">
        <AlbumGrid albums={albums} />
      </div>
    </main>
  );
}
