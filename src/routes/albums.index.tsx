import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { ReactNode } from "react";
import { AlbumGrid } from "../components/library/album-grid";
import { type Filter } from "../components/ui/filter-toggle";
import { FilteredTitle } from "../components/library/filtered-title";
import { EmptyState } from "../components/ui/empty-state";
import { GridSkeleton } from "../components/ui/skeletons";
import { validateFilter } from "../lib/filter";
import { getAlbumList, getStarred } from "../lib/subsonic";

export const Route = createFileRoute("/albums/")({
  validateSearch: validateFilter,
  loaderDeps: ({ search }) => ({ filter: search.filter }),
  loader: ({ deps }) =>
    deps.filter === "favorites"
      ? getStarred().then((starred) => starred.albums)
      : getAlbumList("alphabeticalByName", 500),
  component: Albums,
  pendingComponent: () => (
    <Page>
      <GridSkeleton />
    </Page>
  ),
});

function Page({ children }: { children: ReactNode }) {
  const { filter = "all" } = Route.useSearch();
  const navigate = useNavigate({ from: "/albums/" });
  const change = (next: Filter) => navigate({ search: { filter: next === "favorites" ? "favorites" : undefined } });

  return (
    <main className="px-8 pt-4 pb-10">
      <FilteredTitle title="Albums" filter={filter} onChange={change} />
      {children}
    </main>
  );
}

function Albums() {
  const albums = Route.useLoaderData();
  const { filter } = Route.useSearch();

  return (
    <Page>
      {albums.length === 0 && filter === "favorites" ? (
        <EmptyState
          icon={Heart}
          title="No favorite albums yet"
          description="Tap the heart on an album’s page, or right-click an album and choose “Add to favorites”."
        />
      ) : (
        <AlbumGrid albums={albums} />
      )}
    </Page>
  );
}
