import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { ReactNode } from "react";
import { ArtistGrid } from "../components/library/artist-grid";
import { FilteredTitle } from "../components/library/filtered-title";
import { EmptyState } from "../components/ui/empty-state";
import { type Filter } from "../components/ui/filter-toggle";
import { GridSkeleton } from "../components/ui/skeletons";
import { validateFilter } from "../lib/filter";
import { getArtists, getStarred } from "../lib/subsonic";

export const Route = createFileRoute("/artists/")({
  validateSearch: validateFilter,
  loaderDeps: ({ search }) => ({ filter: search.filter }),
  loader: ({ deps }) => (deps.filter === "favorites" ? getStarred().then((starred) => starred.artists) : getArtists()),
  component: Artists,
  pendingComponent: () => (
    <Page>
      <GridSkeleton round />
    </Page>
  ),
});

function Page({ children }: { children: ReactNode }) {
  const { filter = "all" } = Route.useSearch();
  const navigate = useNavigate({ from: "/artists/" });
  const change = (next: Filter) => navigate({ search: { filter: next === "favorites" ? "favorites" : undefined } });

  return (
    <main className="px-8 pt-4 pb-10">
      <FilteredTitle title="Artists" filter={filter} onChange={change} />
      {children}
    </main>
  );
}

function Artists() {
  const artists = Route.useLoaderData();
  const { filter } = Route.useSearch();

  return (
    <Page>
      {artists.length === 0 && filter === "favorites" ? (
        <EmptyState
          icon={Heart}
          title="No favorite artists yet"
          description="Tap the heart on an artist’s page to add them here."
        />
      ) : (
        <ArtistGrid artists={artists} />
      )}
    </Page>
  );
}
