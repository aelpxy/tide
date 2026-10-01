import { Link, useNavigate } from "@tanstack/react-router";
import { History, X } from "lucide-react";
import { removeRecentSearch, useRecentSearches } from "../../stores/recent-searches";

export function RecentSearches() {
  const searches = useRecentSearches((state) => state.searches);
  const navigate = useNavigate();

  return (
    <main className="px-8 pt-4 pb-10">
      <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">Search</p>
      <h1 className="mt-1 text-4xl font-bold tracking-tight">Find something to play</h1>

      {searches.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold tracking-tight">Recent searches</h2>
          <div className="flex flex-wrap gap-2">
            {searches.map((search) => (
              <div
                key={search}
                className="flex items-center rounded-full bg-white/8 ring-1 ring-white/8 transition-colors hover:bg-white/12"
              >
                <button
                  type="button"
                  onClick={() => navigate({ to: "/search", search: { q: search } })}
                  className="flex items-center gap-2 py-2 pr-1 pl-4 text-sm"
                >
                  <History className="size-3.5 text-neutral-400" />
                  {search}
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${search} from recent searches`}
                  onClick={() => removeRecentSearch(search)}
                  className="mr-1.5 flex size-6 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <p className="mt-3 text-sm text-neutral-400">Type in the search field above to search your library.</p>
      )}

      <Link
        to="/genres"
        className="mt-10 inline-flex text-sm font-semibold text-neutral-300 transition-colors hover:text-white"
      >
        Or browse by genre →
      </Link>
    </main>
  );
}
