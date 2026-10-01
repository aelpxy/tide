import { createFileRoute } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import type { KeyboardEvent } from "react";
import { AlbumGrid } from "../components/library/album-grid";
import { ArtistRow } from "../components/library/artist-row";
import { TrackList } from "../components/library/track-list";
import { RecentSearches } from "../components/search/recent-searches";
import { TopResultCard } from "../components/search/top-result-card";
import { TrackListSkeleton } from "../components/ui/skeletons";
import { search as searchLibrary } from "../lib/subsonic";
import { pickTopResult } from "../lib/top-result";
import { type Source } from "../stores/player";
import { addRecentSearch } from "../stores/recent-searches";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  loaderDeps: ({ search }) => ({ q: search.q?.trim() ?? "" }),
  loader: ({ deps }) => (deps.q ? searchLibrary(deps.q) : null),
  component: Search,
  pendingComponent: () => (
    <main className="flex flex-col gap-10 px-8 pt-4 pb-10">
      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6">
        <div className="h-56 skeleton rounded-lg" />
        <TrackListSkeleton count={4} />
      </div>
    </main>
  ),
});

// up/down move between results; Esc goes back to the search field
function navigateResults(event: KeyboardEvent<HTMLElement>) {
  const results = [...event.currentTarget.querySelectorAll<HTMLElement>("[data-result]")];
  const current = results.indexOf(document.activeElement as HTMLElement);

  if (event.key === "Escape") {
    document.querySelector<HTMLInputElement>("#search")?.focus();
  } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    if (event.key === "ArrowUp" && current <= 0) {
      document.querySelector<HTMLInputElement>("#search")?.focus();
      return;
    }
    results[Math.min(results.length - 1, current + (event.key === "ArrowDown" ? 1 : -1))]?.focus();
  }
}

function Search() {
  const { q = "" } = Route.useSearch();
  const query = q.trim();
  const results = Route.useLoaderData();

  if (!results) return <RecentSearches />;

  const source: Source = { type: "search", query, name: `“${query}”` };
  const top = pickTopResult(query, results);
  const empty = !results.artists.length && !results.albums.length && !results.songs.length;

  return (
    <main
      onKeyDown={navigateResults}
      // opening a result counts as a finished search worth remembering
      onClickCapture={(event) => {
        if ((event.target as Element).closest("[data-result], a")) addRecentSearch(query);
      }}
      className="flex flex-col gap-10 px-8 pt-4 pb-10"
    >
      {empty && (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <SearchIcon className="size-10 text-neutral-600" />
          <p className="text-lg font-semibold">No results for “{query}”</p>
          <p className="text-sm text-neutral-400">Check the spelling, or try an artist, album or song name.</p>
        </div>
      )}

      {top && (
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6">
          <section>
            <h2 className="mb-4 text-xl font-bold tracking-tight">Top result</h2>
            <TopResultCard result={top} source={source} />
          </section>
          {results.songs.length > 0 && (
            <section>
              <h2 className="mb-2 text-xl font-bold tracking-tight">Songs</h2>
              <TrackList songs={results.songs.slice(0, 4)} source={source} />
            </section>
          )}
        </div>
      )}

      {results.artists.length > 0 && <ArtistRow title="Artists" artists={results.artists} />}

      {results.albums.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold tracking-tight">Albums</h2>
          <AlbumGrid albums={results.albums} />
        </section>
      )}

      {results.songs.length > 4 && (
        <section>
          <h2 className="mb-2 text-xl font-bold tracking-tight">More songs</h2>
          <TrackList songs={results.songs.slice(4)} full source={source} />
        </section>
      )}
    </main>
  );
}
