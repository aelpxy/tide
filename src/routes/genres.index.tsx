import { createFileRoute } from "@tanstack/react-router";
import { Shapes } from "lucide-react";
import { GenreTile } from "../components/genres/genre-tile";
import { EmptyState } from "../components/ui/empty-state";
import { PageTitle } from "../components/ui/skeletons";
import { getGenres } from "../lib/subsonic";

export const Route = createFileRoute("/genres/")({
  loader: async () => (await getGenres()).sort((a, b) => b.albumCount - a.albumCount),
  component: Genres,
  pendingComponent: () => (
    <main className="px-8 pt-4 pb-10">
      <PageTitle title="Genres" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {Array.from({ length: 12 }, (_, index) => (
          <div key={index} className="h-36 skeleton rounded-lg" />
        ))}
      </div>
    </main>
  ),
});

function Genres() {
  const genres = Route.useLoaderData();

  return (
    <main className="px-8 pt-4 pb-10">
      <PageTitle title="Genres" />
      {genres.length === 0 && (
        <EmptyState
          icon={Shapes}
          title="No genres yet"
          description="Genres come from your music’s tags. Your server hasn’t found any."
        />
      )}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {genres.map((genre) => (
          <GenreTile key={genre.value} genre={genre} />
        ))}
      </div>
    </main>
  );
}
